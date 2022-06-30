const webpack = require('webpack');
const webpackDevMid = require('webpack-dev-middleware');
const express = require('express');
const devConf = require('./webpack.dev.conf');
const prodConf = require('./webpack.prod.conf');
const proxys = require('./proxys');
const httpProxy = require('http-proxy-middleware');
const fetch = require('node-fetch');
const https = require('https');
const agent = new https.Agent({
  rejectUnauthorized: false,
});

let webpackConf = devConf;
if (process.env.NODE_ENV === 'production') {
  webpackConf = prodConf;
}

const app = express();
const port = process.env.PORT || 8000;
const compiler = webpack(webpackConf);

const devMid = webpackDevMid(compiler, {
  quiet: true,
  noInfo: true,
  publicPath: webpackConf.output.publicPath,
});
const hotMid = require('webpack-hot-middleware')(compiler, {
  log: () => {},
});

// 设置http代理
for (let key in proxys) {
  if (['loginUrl', 'loginPort'].indexOf(key) > -1) continue;
  app.use(httpProxy(key, Object.assign(proxys[key], {})));
}

// 登陆验证
app.all('/', function(req, res, next) {
  let host = req.get('host');
  let url = encodeURIComponent(`http://${host}${req.originalUrl}`);
  fetch(`${proxys.loginUrl}:${proxys.loginPort}/hindex.htm` + req.originalUrl.replace(/\//, ''), {
    redirect: 'manual',
    headers: Object.assign(req.headers, {
      host: 'jtalk.jd.com',
      Cookie: req.headers.cookie,
    }),
    timeout: 3000,
    agent,
  })
    .then((response) => {
      let statusCode = response.status;
      if (response.headers._headers['set-cookie']) {
        response.headers._headers['set-cookie'].map((item) => {
          res.append('Set-Cookie', item);
        });
      }

      if (statusCode == 302 || statusCode == 304) {
        const returnUrl = `http://plogin.m.jd.com/user/login.action?appid=207&returnurl=${url}`;
        return res.redirect(302, returnUrl);
      }
      return next();
    })
    .catch((e) => {
      console.error(e);

      next();
    });
});

app.use(devMid);

app.use(hotMid);
let _html = '';
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function(compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function(data, cb) {
    // 解决webpack 3.0+ HtmlWebpackPlugin bug
    // https://github.com/webpack/webpack-dev-server/issues/949
    _html = _html || data.html.source();
    if (_html !== data.html.source()) {
      _html = data.html.source();
      hotMid.publish({
        action: 'reload',
      });
    }
    cb();
  });
});

console.log('> Starting dev server...');

devMid.waitUntilValid(() => {
  console.log('> Listening at http://localhost:' + port + '\n');
});

const server = app.listen(port);
