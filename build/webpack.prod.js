const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    // 生产环境中启用 source map，因为它们对调试源码(debug)和运行基准测试(benchmark tests)很有帮助
    // 避免在生产中使用 inline-*** 和 eval-***，因为它们可以增加 bundle 大小，并降低整体性能。
    devtool: 'source-map',
    plugins: [
        // 压缩JS
        new UglifyJSPlugin({
            sourceMap: true
        }),
        // 可以使用 webpack 内置的 DefinePlugin 为所有的依赖定义 process.env.NODE_ENV
        // 无法在构建脚本 webpack.config.js 中，将 process.env.NODE_ENV 设置为 "production"
        // 因此，例如 process.env.NODE_ENV === 'production' ? '[name].[hash].bundle.js' : '[name].bundle.js' 这样的条件语句，在 webpack 配置文件中，无法按照预期运行。

        /*
        以上描述也可以通过命令行实现。例如，--optimize-minimize 标记将在后台引用 UglifyJSPlugin。
        和以上描述的 DefinePlugin 实例相同，--define process.env.NODE_ENV="'production'" 也会做同样的事情。
        并且，webpack -p 将自动地调用上述这些标记，从而调用需要引入的插件。
        */ 
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ]
});