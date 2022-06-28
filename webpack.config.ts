// const path = require('path')
import path from 'path';
import htmlWebpackPlugin from 'html-webpack-plugin'
import webpack from 'webpack';

console.log('当前环境为 ----- ',process.env.NODE_ENV);

const config: webpack.Configuration = {
  mode: 'development',
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
      { test: /\.ts$/, 
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          }
        },
        
      },
      { test: /\.(js|ts|jsx|tsx)$/, exclude: '/node_modules/',
        use: { 
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-typescript'],
            // presets: ['env', 'react'],
          },
        }
      },
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      template: "./public/index.html"  // html目录模版
    })
  ],
}

export default config