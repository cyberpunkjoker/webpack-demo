const https = require('https');
const Router = require('@koa/router');
const fetch = require('node-fetch');

const proxys = require('../proxys');

const { portalWebUrl, portalWebPort, protocol } = proxys.RUN_TIME_INFO;

const router = new Router();

const {
    SERVER: {
        http: {
            port,
        },
        https: {
            ports
        },
        loginUrl,
        loginPort,
    }
} = require('../infoConf');

const agent = new https.Agent({
    rejectUnauthorized: false,
});

const protocolType = {
    [port]: 'http',
    [ports]: 'https'
};

const mergeHeaders = ctx => {
    return Object.assign(ctx.headers, {
        host: 'dev2.c-jtalk.jd.com',
        Cookie: ctx.headers.cookie,
    });
};

router.get('/', async (ctx, next) => {
    const originalUrl = ctx.originalUrl;
    // const breakUrl = encodeURIComponent(`${protocol}://${ctx.get('host')}${originalUrl}`);
    const reqUrl = `${protocol}://${portalWebUrl}:${portalWebPort}/hindex.htm${originalUrl.replace(/\//, '')}`;
    const headers = mergeHeaders(ctx);

    try {
        const response = await fetch(reqUrl, {
            headers,
            agent,
            redirect: 'manual',
            timeout: 3000,
        });

        console.log('Cookie值 Star-------------------------------------------------------');
        if (response.headers.raw()['set-cookie'] && response.headers.raw()['set-cookie'].length) {
            response.headers.raw()['set-cookie'].map(item => {
                const [key, value] = item.substring(0, item.indexOf(';')).split('=')

                console.log(key, value);
                ctx.cookies.set(key, value);
                ctx.cookies.set(key, value, {
                    domain: 'jd.com',
                });
            });
        }
        console.log('Cookie值 End-------------------------------------------------------');

        // http://plogin.m.jd.com/user/login.action?appid=370&returnurl=http%3A%2F%2Fjtk.jd.com%3A443%2Fhindex.htm%3Fentrance%3D22
        // http://plogin.m.jd.com/user/login.action?appid=207&returnurl=www.jd.com
    } catch (err) {
        console.error(err);
    }

    next();
});

module.exports = router;
