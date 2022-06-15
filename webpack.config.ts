// const path = require('path')
import path from 'path';
import htmlWebpackPlugin from 'html-webpack-plugin'
import webpack from 'webpack';

const config: webpack.Configuration = {
  entry: {
    app: "./src/app.js",
    search: "./src/index.js",
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader' },
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      template: "./public/index.html"
    })
  ],
  mode: 'production'
}

export default config