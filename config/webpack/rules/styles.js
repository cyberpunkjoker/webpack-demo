const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { STATUS: { __PROD__, __DEV__ }} = require('../../infoConf');

const plugins = [
    'postcss-flexbugs-fixes',
    ['postcss-px-to-viewport', {
        viewportWidth: 750,
        viewportHeight: 1334,
        unitPrecision: 5,
        viewportUnit: 'vw',
        selectorBlackList: ['window'],
        minPixelValue: 1,
        mediaQuery: false,
        fontViewportUnit: 'vw',
    }]
]

const lessUse = [{
    loader: 'css-loader',
    options: {
        importLoaders: 1,
    },
}, {
    loader: 'postcss-loader',
    options: {
        postcssOptions: {
            plugins,
        }
    },
}, {
    loader: 'less-loader',
}];

const less = {
    test: /\.less$/,
    use: (__PROD__ ? [{
        loader: MiniCssExtractPlugin.loader,
        options: {
            hmr: __DEV__,
        },
    }] : [{
        loader: 'style-loader',
    }]).concat(lessUse),
};

const css = {
    test: /\.css$/,
    use: (__PROD__ ? [{
        loader: MiniCssExtractPlugin.loader,
        options: {
            hmr: __DEV__,
        },
    }] : [{
        loader: 'style-loader',
    }]).concat([
        'css-loader',
    ]),
};

module.exports = [
    less,
    css,
];
