const path = require("path");
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: ['./index.ts'] ,
    context: path.resolve(__dirname, 'src'),
    mode: "production",
    plugins: [
        new CopyPlugin([
            { from: '../public' },
            { from: './assets', to: 'assets'}
        ])
      ],    
    resolve: {
        extensions: [".ts", ".tsx", '.js']
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "ts-loader", exclude: /node_modules/ },
            { test: /\.glb?$/, loader: "file-loader", exclude: /node_modules/ },
        ]
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist')
    },
};