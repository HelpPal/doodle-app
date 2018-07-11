
import express from 'express';
import os from 'os';
import fs from 'fs';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';

import { api, UPLOADS_DIRECTORY } from '~/constants';
import log from './log';

import { initializeRouter } from './index';

const homedir = os.homedir();
const uploadsDirectory = `${homedir}/Desktop/${UPLOADS_DIRECTORY}`;
if (!fs.existsSync(uploadsDirectory)) {
    log.info(`Creating uploads directory in: ${uploadsDirectory}`);
    fs.mkdirSync(uploadsDirectory);
}

function startServer() {
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors({
        origin: true,
        credentials: true,
        preflightContinue: true
    }));
    app.use(morgan('combined'));
    app.set('trust proxy', true);
    app.use('/api', initializeRouter());
    app.listen(api.port, (err) => {
      if (err) {
        log.trace(err);
        log.error('Failed to start Development Server.');
        return;
      }
      log.info(`Listening at http://${api.host}:${api.port}`);
    });

}

startServer();
