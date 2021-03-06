var webpack = require('webpack');
var path = require('path');
var extractTextPlugin = require("extract-text-webpack-plugin");
var htmlWebpackPlugin = require('html-webpack-plugin');
var openBrowserPlugin = require('open-browser-webpack-plugin');

// 定义路径
const PATHS = {
    src: path.resolve(__dirname, 'src'),
    dist: path.resolve(__dirname),
    node_modules: path.resolve(__dirname, 'node_modules')
};

module.exports = {
  entry: {
    app: './src/js/app.js',
  },
  output: {
    path: PATHS.dist,
    filename: 'js/[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: extractTextPlugin.extract({
          fallback: "style-loader",
          use: ['css-loader?importLoaders=1&minimize=1','postcss-loader','less-loader'],
          publicPath: PATHS.dist
        }),
        exclude: path.resolve(__dirname, 'node_modules'),
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: [ 'url-loader?limit=128&name=images/[hash:8].[name].[ext]' ]
      },
      {
        test: /\.html$/,
        use: [ 'html-loader' ],
      },
      {
        test: /\.js$/,
        use: {
          loader:'babel-loader',
          options: {
            presets: ['babel-preset-es2015']
          }
        },
        exclude: PATHS.node_modules,
        include: PATHS.src
      },
    ]
  },
  plugins:[
    // 公有模块抽离 
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    }),
    // css 文件导出
    new extractTextPlugin("css/style.css"),
    // 代码混淆
    new webpack.optimize.UglifyJsPlugin({
      output: { comments: false },
      compress: { warnings: false }
    }),
    // html 文件导出
    new htmlWebpackPlugin({
      template: './src/index.html',
      filename: './index.html',
      inject: 'body',
      favicon: './src/images/favicon.ico',
      minify: {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true,
        removeComments: true,
      }
    }),
    // 打开浏览器
    new openBrowserPlugin({
      url: 'http://localhost:8080'
    })
  ],
};
