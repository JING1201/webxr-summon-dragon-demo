
const path = require('path');
const mergeTools = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = mergeTools.merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
//   devtool: 'source-map',
  devServer: {  
      port: 8080,
      contentBase: path.join(__dirname, 'dist'),
      watchContentBase: true
  },
});

