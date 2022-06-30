const webpack = require('webpack');
const path = require('path');

const rules = require('./rules');
const infoConf = require('../infoConf');
const proxys = require('../proxys');

const { PATH } = infoConf;

module.exports = {
    resolve: {
        extensions: [
            '.js',
            '.jsx',
            '.json',
            '.ts',
            '.tsx',
            '.css',
            '.less',
        ],

        alias: {
            "@": PATH.src,
        },

        modules: [PATH.src, 'node_modules'],
    },

    module: {
        rules,
    },

    plugins: [
        new webpack.IgnorePlugin(/\.\/locale/, /moment/),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(infoConf.STATUS.__ENV__),
            'process.env.RUN_TIME': JSON.stringify(proxys.RUN_TIME),
            'process.env.profile_name': JSON.stringify(process.env.profile_name || 'production'),
        }),
    ]
};
