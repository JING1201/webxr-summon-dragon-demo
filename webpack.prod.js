const mergeTools = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = mergeTools.merge(common, {
  mode: 'production',
});