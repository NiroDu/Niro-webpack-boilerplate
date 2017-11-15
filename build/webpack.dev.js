const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    devtool: 'inline-source-map',
    devServer: {
        // 告知 webpack-dev-server，在 localhost:8080 下建立服务，将 dist 目录下的文件，作为可访问文件。
        contentBase: './dist',
        port: 12222,
        host: "localhost",
        proxy: {
            /*'/api': {
              target: 'https://other-server.example.com',
              pathRewrite: {
                '^/api': ''
              }
            }*/
        } 
    },
    plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            'NODE_ENV': JSON.stringify('dev'),
          }
        })
    ]
});