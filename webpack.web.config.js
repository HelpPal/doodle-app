'use strict';

const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const yaml = require('js-yaml');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isTest = process.env.NODE_ENV == 'test';
const isProduction = process.env.NODE_ENV === 'production';
const isDev = !isProduction;
const libraryName = 'doodle-app';

const yamlPath = path.resolve('app.yml');
const yamlConfig = yaml.load(fs.readFileSync(yamlPath, 'utf8'));


let config = {
    target: 'web',
    debug: isDev,
    entry: _.extend({

        // Note: entry points must be in arrays to fix a strange bug with webpack
        // See: "A dependency to an entry point is not allowed"
        // https://github.com/webpack/webpack/issues/300
        index: ['./src/index.js']
    },
    isDev && {
        'hotLoader': 'webpack-hot-middleware/client'
    }),
    externals: _.extend({}, isTest ? {
        'react': true,
        'react-dom': true,
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true
    } : {}),
    context: __dirname,
    devtool: isProduction ? 'inline-source-map' : 'source-map',
    node: {
        __filename: true,
        __dirname: true,
        fs: 'empty' // TODO only in web
    },
    output: {
        publicPath: '/',
        path: path.resolve('public'),
        filename: '[name].js',
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    resolve: {
        modulesDirectories: [
            'node_modules',
            path.resolve(__dirname, './node_modules')
        ],
        extensions: ['', '.js', '.jsx', '.css', '.scss', '.ts', '.tsx'],
        alias: {
            '~': path.resolve(__dirname, 'src'),
            modernizr$: path.resolve(__dirname, '.modernizrrc'),
            'react-redux': path.join(__dirname, '/node_modules/react-redux/dist/react-redux.min')
        }
    },
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loaders: _.compact([ isDev && 'react-hot', 'babel', 'ts']),
                exclude: /node_modules/,
                presets: ['react']
            },
            {
                test: /\.jsx?$/,
                loaders: _.compact([ isDev && 'react-hot', 'babel']),
                exclude: /node_modules/,
                presets: ['react']
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
                loader: 'file?name=[name].[ext]'
            },
            {
                test: /\.modernizrrc$/,
                loader: 'modernizr'
            },
            {
                test: /\.ejs$/,
                loader: 'ejs'
            },
            {
                test: /\.(frag|vert)$/,
                loader: 'raw'
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style', 'css')
            },
            {
                test: /\.(jpg|png)$/,
                loader: 'file?name=[name].[ext]'
            }
        ]
    },
    plugins: _.compact([
        new ExtractTextPlugin(libraryName + '.css', { allChunks: true }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            'ELECTRON': JSON.stringify(process.env.BUILD_ENV === 'electron'),
            'typeof window': JSON.stringify('object'),
            PROJECT_ROOT: JSON.stringify(__dirname),
            CONFIG: JSON.stringify(yamlConfig)
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.join(__dirname, 'template.ejs'),
            chunks: ['index', 'hotLoader', 'common'],
            excludeChunks: [],
            chunksSortMode: 'dependency'
        }),
        isDev && new webpack.HotModuleReplacementPlugin(),
        isProduction && new webpack.optimize.CommonsChunkPlugin({
            name: 'common'
        }),
        isProduction && new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: true
            }
        }),
        isProduction && new webpack.optimize.DedupePlugin()
    ])
};

module.exports = config;
