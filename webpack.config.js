'use strict';

const electron = require('./webpack.electron.config.js');
const web = require('./webpack.web.config.js');
const api = require('./webpack.api.config.js');

module.exports = [
  electron,
  web,
  api
];
