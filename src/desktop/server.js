
/* globals PROJECT_ROOT */

import os from 'os';
import fs from 'fs';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';

import electronApp from './app';
import { web, isProduction, UPLOADS_DIRECTORY } from '~/constants';
import { initializeRouter as initializeAPIRouter } from '~/api';
import log from './log';

const app = express();
const appPath = isProduction ? electronApp.getAppPath() : PROJECT_ROOT;

const homedir = os.homedir();
const uploadsDirectory = `${homedir}/Desktop/${UPLOADS_DIRECTORY}`;
if (!fs.existsSync(uploadsDirectory)) {
    log.info(`Creating uploads directory in: ${uploadsDirectory}`);
    fs.mkdirSync(uploadsDirectory);
}

export default function startServer() {
  app.use(bodyParser.json());
  app.use(cors({
      origin: true,
      credentials: true,
      preflightContinue: true
  }));
  app.use(morgan('combined'));
  app.use(express.static(path.join(appPath, 'public')));
  app.use('/api', initializeAPIRouter());
  app.get('*', (req, res) => {
    res.sendFile(path.join(appPath, 'public', 'index.html'));
  });
  app.listen(web.port, () => {
      console.log(`Electron/Express listening on http://localhost:${web.port}`);
  });
}
