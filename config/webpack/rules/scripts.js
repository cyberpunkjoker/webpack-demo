const path = require('path');
const threadLoader = require('thread-loader');

const infoConf = require('../../infoConf');
const osSize = require('os').cpus().length;

const { STATUS: { __PROD__, __DEV__ }} = infoConf;
const threadLoaderOpts = {
  workers: __PROD__ ? osSize : osSize - 1,
  workerParallelJobs: 50,
  workerNodeArgs: ['--max-old-space-size=1024'],
  poolRespawn: false,
  poolTimeout: __PROD__ ? 500 : Infinity,
  poolParallelJobs: 50,
  name: "tsx-pool",
};

threadLoader.warmup(threadLoaderOpts, [
  'babel-loader',
  'ts-loader',
  'css-loader',
  'less-loader',
  'style-loader',
  'postcss-loader',
]);

module.exports = [{
  test: [/\.(ts|tsx)$/],
  use: [
    ...(__DEV__ ? [{
      loader: 'cache-loader',
    }] : []),
    {
      loader: "thread-loader",
      options: threadLoaderOpts,
    },
    {
      loader: 'babel-loader',
      options: Object.assign(
        {
          cacheDirectory: true,
          babelrc: false,
        },
        infoConf.BABELRC
      ),
    },
    {
      loader: 'ts-loader',
      options: {
        transpileOnly: __DEV__,
        happyPackMode: true,
        ignoreDiagnostics: [],
      },
    },
  ],
  include: infoConf.PATH.src,
  exclude: path.join(infoConf.PATH.root, 'node_modules'),
}, {
  test: [/\.(js|jsx)$/],
  use: {
    loader: 'babel-loader?cacheDirectory=true',
    options: Object.assign(
      {
        cacheDirectory: true,
        babelrc: false,
      },
      infoConf.BABELRC
    ),
  },
  include: infoConf.PATH.src,
  exclude: path.join(infoConf.PATH.root, 'node_modules'),
}];
