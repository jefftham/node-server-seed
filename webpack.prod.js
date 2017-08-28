 const merge = require('webpack-merge');
 const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
 const common = require('./webpack.common.js');
 const path = require('path');
 const ClosureCompilerPlugin = require('webpack-closure-compiler');

 module.exports = merge(common, {
     devtool: 'cheap-module-source-map',
     plugins: [
         new UglifyJSPlugin()

         /*          new ClosureCompilerPlugin({
                      compiler: {
                          // jar: 'path/to/your/custom/compiler.jar', //optional
                          language_in: 'ECMASCRIPT6',
                          language_out: 'ECMASCRIPT5',
                          compilation_level: 'ADVANCED'
                      },
                      concurrency: 3,
                  }) */
     ]
 });
