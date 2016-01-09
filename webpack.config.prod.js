var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')


module.exports = {
  entry: [
    './index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new HtmlWebpackPlugin({template: 'index.html'})
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: [ 'babel' ],
        exclude: /node_modules/,
        include: __dirname
      }, {
        test: /\.css?$/,
        loaders: [ 'style', 'raw' ],
        include: __dirname
      }, {
        test: /\.json$/,
        loader: 'json-loader',
        include: __dirname
      }, {
        test: /\.txt$/,
        loader: 'raw-loader',
        include: __dirname
      }, {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        loader: 'url-loader?limit=10000',
        include: __dirname
      }, {
        test: /\.(eot|ttf|wav|mp3)$/,
        loader: 'file-loader',
        include: __dirname
      }]
    
  }
}

