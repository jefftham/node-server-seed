 const path = require('path');
 const CleanWebpackPlugin = require('clean-webpack-plugin');
 const HtmlWebpackPlugin = require('html-webpack-plugin');
 const webpack = require('webpack');

 // ref https://github.com/johnagan/clean-webpack-plugin
 // the path(s) that should be cleaned
 let pathsToClean = [
     'dist/'
 ];

 // the clean options to use
 let cleanOptions = {
     exclude: ['index.html']
 };

 module.exports = {
     entry: {
         app: './src/index.js'
     },

     output: {
         filename: '[name].bundle.js',
         path: path.resolve(__dirname, 'dist')
     },
     plugins: [
         /*          new webpack.optimize.CommonsChunkPlugin({
                      name: 'common' // Specify the common bundle's name.
                  }), */
         new CleanWebpackPlugin(pathsToClean, cleanOptions),
         /*
                  // generate index.html
                  new HtmlWebpackPlugin({
                      title: 'Production'
                  }) */
     ],
     module: {
         rules: [{
             test: /\.css$/,
             use: ['style-loader', 'css-loader']
         }, {
             test: /\.(png|svg|jpg|gif)$/,
             use: ['file-loader']
         }, {
             test: /\.(woff|woff2|eot|ttf|otf)$/,
             use: ['file-loader']
         }, {
             test: /\.(csv|tsv)$/,
             use: ['csv-loader']
         }, {
             test: /\.xml$/,
             use: ['xml-loader']
         }]
     }
 };
