var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var WriteFilePlugin = require('write-file-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CompressionPlugin = require("compression-webpack-plugin");

var path = require('path');

module.exports = {
    entry: {
        'scvo-loader': './src/scvo-loader.ts'
    },
    output: {
        path: path.join(__dirname, "./dist"),
        filename: '[name].js',
        libraryTarget: 'var',
        library: 'ScvoLoader'
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: "source-map-loader"
            },
            {
                enforce: 'pre',
                test: /\.tsx?$/,
                use: "ts-loader",
                options: {
                    configFileName: "./tsconfig-loader.json"
                }
            },
            {
                test: /\.js$/,
                loader: 'unlazy-loader'
            },
        ],
    },
    plugins: [
        new WriteFilePlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new CompressionPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0
        })
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        alias: {
            "handlebars": "handlebars/dist/handlebars.js"
        } 
    },
    resolveLoader: {
        alias: {
        }
    },
    devtool: 'cheap-module-source-map',
    node: {
        fs: 'empty'
    }
};

