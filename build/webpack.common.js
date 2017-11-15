const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        // main: './src/index.js',
        // vendor里的第三方库，在每次构建时，vendor hash 都不变，方便缓存。
        // vendor: [
        //     'lodash'
        // ]
        main: path.resolve(__dirname, '../src/js/index.js')        
    },
    output: {
        // filename: 'bundle.js',
        // [hash] 替换可以用于在文件名中包含一个构建相关(build-specific)的 hash，但是更好的方式是使用 [chunkhash] 替换，在文件名中包含一个 chunk 相关(chunk-specific)的哈希。
        // filename: '[name].[chunkhash].js',
        // filename: '[name].bundle.js',
        filename: "assets/js/[name].[hash:10].js",
        path: path.resolve(__dirname, 'dist'),
        // publicPath 也会在服务器脚本用到，以确保文件资源能够在 http://localhost:3000 下正确访问，我们稍后再设置端口号。
        publicPath: '/'
    },
    resolve: {
        extensions: ['.js', '.json', '.scss'],
        alias: {}
    },
    module: {
        rules: [{
                test: /(\.scss|\.css)$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                            loader: "css-loader",
                            options: {
                                minimize: true
                            }
                        },
                        {
                            loader: "postcss-loader"
                        },
                        {
                            loader: "sass-loader"
                        }
                    ]
                })
            },
            {
                test: /(\.jsx|\.js)$/,
                use: {
                    loader: "babel-loader"
                },
                exclude: /node_modules/
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        // 指定图片打包位置
                        name: 'assets/image/[name].[hash:10].[ext]'
                    } 
                }]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(csv|tsv)$/,
                use: [
                    'csv-loader'
                ]
            },
            {
                test: /\.xml$/,
                use: [
                    'xml-loader'
                ]
            },
            {
                test: /\.html$/,
                use: [ "html-loader" ]
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin(''),
        //在每次构建前清理 /dist 文件夹
        new CleanWebpackPlugin(['dist'], {
            "root": path.resolve(__dirname, '../'),
            "verbose": true,
            "dry": false,
            "exclude": ["files", "to", "ignore"],
            "watch": false
        }),
        //HtmlWebpackPlugin会默认新生成的 index.html 文件，把我们的原来的替换。
        new HtmlWebpackPlugin({
            title: 'Output Management',
            filename: 'index.html',
            template: path.resolve(__dirname, '../src/index.html')
        }),

        new ExtractTextPlugin("assets/css/[name].[hash:10].css"),

        // 添加了 NamedModulesPlugin，以便更容易查看要修补(patch)的依赖。
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        // 似乎加不加都是一样的了，作用是：每次构建，让vendor hash 都应该保持一致。
        new webpack.HashedModuleIdsPlugin(),
        /*将第三方库(library)（例如 lodash 或 react）提取到单独的 vendor chunk 文件中，是比较推荐的做法，
        这是因为，它们很少像本地的源代码那样频繁修改。因此通过实现以上步骤，利用客户端的长效缓存机制，可以通过命中缓存来消除请求，并减少向服务器获取资源，同时还能保证客户端代码和服务器端代码版本一致。
        这可以通过使用新的 entry(入口) 起点，以及再额外配置一个 CommonsChunkPlugin 实例的组合方式来实现： */
        // 注意，引入顺序在这里很重要。CommonsChunkPlugin 的 'vendor' 实例，必须在 'runtime' 实例之前引入。
        // CommonsChunkPlugin 插件可以将公共的依赖模块提取到已有的入口 chunk 中，或者提取到一个新生成的 chunk。
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'vendor'
        // }),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'runtime'
        // }),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'common' // 指定公共 bundle 的名称。
        // }),
    ]
};