'use strict';

const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const yaml = require('js-yaml');
const webpack = require('webpack');

const isProduction = process.env.NODE_ENV === 'production';

const yamlPath = path.resolve('app.yml');
const yamlConfig = yaml.load(fs.readFileSync(yamlPath, 'utf8'));

let nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = {
    target: 'node',
    entry: {
        api: './src/api/server'
    },
    externals: nodeModules,
    context: __dirname,
    devtool: isProduction ? 'inline-source-map' : 'source-map',
    node: {
      __filename: true,
      __dirname: true
    },
    output: {
        path: path.resolve('./public'),
        publicPath: isProduction ? '/' : '/public/',
        filename: '[name].js'
    },
    resolve: {
        modulesDirectories: [
            'node_modules',
            path.resolve(__dirname, 'node_modules')
        ],
        extensions: ['', '.js', '.ts'],
        alias: {
            '~': path.resolve(__dirname, 'src')
        }
    },
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loaders: ['babel', 'ts'],
                exclude: /node_modules/
            },
            {
                test: /\.jsx?$/,
                loader: 'babel',
                exclude: /node_modules/
            },
            {
                test: /\.json$/,
                loader: 'json'
            }
        ]
    },
    plugins: _.compact([
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            PROJECT_ROOT: JSON.stringify(__dirname),
            CONFIG: JSON.stringify(yamlConfig)
        }),
        isProduction && new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: true
            }
        }),
        isProduction && new webpack.optimize.DedupePlugin()
    ])
};
