import os from 'os';
import express from 'express';
import Promise from 'bluebird';
import fs from 'fs';
import multer from 'multer';

import log from '../log';
import { api, UPLOADS_DIRECTORY } from '~/constants';

export default function initializeUploadsRouter() {
  const upload = multer();
  const router = express.Router();
  router.post('/', upload.single('qqfile'), createUpload());
  router.get('/:file', getUpload());
  router.get('/:file/css', getUploadCSS());
  return router;
}

function createUpload() {
  return (req, res) => {
    const file = req.file;
    const fileName = file.originalname;
    return Promise.resolve()
      .then(() => {
        const homedir = os.homedir();
        const uploadDir = `${homedir}/Desktop/${UPLOADS_DIRECTORY}`;
        const uploadPath = `${uploadDir}/${fileName}`;
        log.info(`Beginning file upload to ${uploadPath}`);
        fs.writeFile(uploadPath, file.buffer, { flag: 'w+' }, (error) => {
          if (error) {
            log.trace(error);
            log.error('Failed to upload file.');
            res.status(500);
            res.json({
              success: false
            });
            return;
          }
          log.info(`Successfully uploaded file to ${uploadPath}`);
          res.json({
            success: true
          });
        });
      })
      .catch((e) => {
        log.trace(e);
        log.error('Failed to upload file.');
        res.status(500);
        res.json({
          success: false
        });
      });
  };
}

function getUpload() {
    return (req, res) => {
      const fileName = req.params.file;
      return Promise.resolve()
        .then(() => {
          const homedir = os.homedir();
          const uploadDir = `${homedir}/Desktop/${UPLOADS_DIRECTORY}`;
          const uploadPath = `${uploadDir}/${fileName}`;
          if (!fs.existsSync(uploadPath)) {
            res.status(404);
            res.json({
              success: false
            });
            return;
          }
          fs.createReadStream(uploadPath)
            .pipe(res)
            .on('error', (error) => {
              log.trace(error);
              log.error('Failed to find file.');
              res.status(500);
              res.json({
                success: false
              });
            });
      })
      .catch((e) => {
        log.trace(e);
        log.error('Failed to find file.');
        res.status(500);
        res.json({
          success: false
        });
      });
    };
}

function getUploadCSS() {
    return (req, res) => {
      const fileName = req.params.file;
      const fontFamily = req.query.fontFamily;
      return Promise.resolve()
      .then(() => {
        res.header('Content-Type', 'text/css');
        res.send(
          `@font-face {
              font-family: '${fontFamily}';
              font-style: normal;
              src: url(http://${api.host}:${api.port}/api/uploads/${encodeURIComponent(fileName)});
          }`
        );
      })
      .catch((e) => {
        log.trace(e);
        log.error('Failed to find file.');
        res.status(500);
        res.json({
          success: false
        });
      });
    };
}