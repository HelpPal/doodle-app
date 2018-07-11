import express from 'express';
import Promise from 'bluebird';
import request from 'request';
import log from '../log';

export default function initializeS3Router(s3Client) {
    const router = express.Router();
    router.post('/signature', getCreateUploadSignatureHander(s3Client));
    router.get('/signature', getSignedUploadHandler(s3Client));
    return router;
}

function getCreateUploadSignatureHander(s3Client) {
    return (req, res) => {
        log.debug('Generating signature for upload.');
        return Promise.resolve()
            .then(() => s3Client.getUploadSignatureForRequest(req))
            .then(uploadSignuature => res.json(uploadSignuature))
            .catch(error => {
                log.trace(error);
                log.error(`Unable to generate signature: ${JSON.stringify(req.body)}`);
                return res.sendStatus(500);
            });
    };
}

function getSignedUploadHandler(s3Client) {
    return (req, res) => {
        const fileName = req.query.fileName;
        return Promise.resolve()
            .then((data) => {
                if (data) {
                    const url = data.toString();
                    return url;
                }
                return s3Client.getSignedUploadUrl(fileName);
            })
            .then(url => request(url).pipe(res))
            .catch(error => {
                log.trace(error);
                log.error(`Failed to get signature for fileName ${fileName}`);
                return res.sendStatus(500);
            });
    };
}
