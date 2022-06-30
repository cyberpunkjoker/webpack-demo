const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const ImageminPlugin = require('imagemin-webpack-plugin').default;
const infoConf = require('../infoConf');

const CDNPath = '//static-cdjr.jd.com/fe-jtalk-client-im/';

module.exports = {
    mode: 'production',
    entry: {
        index: [
            infoConf.PATH.entryIndex,
        ],
    },
    output: {
        path: infoConf.PATH.dist,
        filename: `static/${process.env.BROWSER}/js/[name].[chunkhash:8].js`,
        chunkFilename: `static/${process.env.BROWSER}/js/[name].[chunkhash:8].chunk.js`,
        publicPath: CDNPath,
    },
    optimization: {
        splitChunks: {
            chunks: "async",
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                },
            },
        },
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                cache: false,
            }),
            new OptimizeCssAssetsPlugin({
                cssProcessor: require('cssnano'),
                cssProcessorPluginOptions: {
                    preset: ['default', { discardComments: { removeAll: true }}],
                },
                canPrint: false
            }),
        ],
    },
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new HtmlWebpackPlugin({
            filename: `index.${process.env.BROWSER}.html`,
            template: path.join(infoConf.PATH.src, '/public/index.html'),
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            },
        }),
        new MiniCssExtractPlugin({
            filename: `static/${process.env.BROWSER}/css/index.[chunkhash:8].css`,
            chunkFilename: `static/${process.env.BROWSER}/css/[id].[chunkhash:8].css`,
            ignoreOrder: false,
        }),
        // new ImageminPlugin({
        //     disable: process.env.NODE_ENV !== 'production',
        //     pngquant: {
        //         quality: '95-100'
        //     }
        // }),
        new webpack.HashedModuleIdsPlugin(),
    ]
}
