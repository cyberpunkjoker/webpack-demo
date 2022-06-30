const Koa = require('koa');
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const proxyMiddleware = require('http-proxy-middleware');
const connectMiddleware = require('koa-connect');

const proxys = require('../proxys');
const router = require('./router');
const { PATH, SERVER } = require('../infoConf');

const keyOpts = {
  key: fs.readFileSync(path.resolve(__dirname, './privatekey.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, './certificate.pem')),
};

module.exports = middleware => {
  const app = new Koa();

    for (let key in proxys.proxys) {
        const middleware = proxyMiddleware(key, Object.assign(proxys.proxys[key], {}));

    app.use(connectMiddleware(middleware));
  }

  app.use(router.routes(), router.allowedMethods());
  app.use(middleware);

  https.createServer(keyOpts, app.callback()).listen(SERVER.https);
  http.createServer(app.callback()).listen(SERVER.http);
}
