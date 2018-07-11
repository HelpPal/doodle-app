
/* globals CONFIG */

import express from 'express';

import { initializeS3Router, initializeUploadsRouter } from './routers';
import S3Client from './S3Client';

export function initializeRouter() {
    const router = express.Router();
    const s3Client = new S3Client(CONFIG.s3.bucket, CONFIG.s3.region);
    router.use('/s3', initializeS3Router(s3Client));
    router.use('/uploads', initializeUploadsRouter());
    return router;
}
