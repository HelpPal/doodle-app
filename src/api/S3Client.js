
/* globals PROJECT_ROOT */

import path from 'path';
import Promise from 'bluebird';
import Aws from 'aws-sdk';
import merge from 'lodash/merge';
import crypto from 'crypto';
import CryptoJS from 'crypto-js';

// FIXME
import electronApp from '../desktop/app';

import { isProduction } from '~/constants';

const appPath = isProduction ? electronApp.getAppPath() : PROJECT_ROOT;

export default class S3Client {
    constructor(bucket, region) {
        this.bucket = bucket;
        this.region = region;
        this.credentials = new Aws.FileSystemCredentials(path.join(appPath, 'credentials.json'));
        this.s3 = new Aws.S3({
            params: {
                Bucket: bucket
            },
            region,
            credentials: this.credentials
        });
    }

    getUploadSignatureForRequest(req) {
        return Promise.resolve()
            .then(() => {
                const { body } = req;
                const headers = body.headers;
                const secretAccessKey = this.credentials.secretAccessKey;
                // Signs multipart (chunked) requests.
                if (headers) {
                    const words = CryptoJS.HmacSHA1(headers, secretAccessKey);
                    const signature = CryptoJS.enc.Base64.stringify(words);
                    return {
                        signature
                    };
                }
                // Signs "simple" (non-chunked) upload requests.
                const hmac = crypto.createHmac('sha1', secretAccessKey);
                const policy = new Buffer(JSON.stringify(body))
                                   .toString('base64')
                                   .replace(/\n|\r/, '');
                hmac.update(policy);
                const signature = hmac.digest('base64');
                const conditions = merge(...body.conditions);
                const contentType = conditions['Content-Type'];
                const fileName = conditions['x-amz-meta-qqfilename'];
                const bucket = conditions['bucket'];
                const params = {
                    Bucket: bucket,
                    Key: fileName,
                    ContentType: contentType,
                    ACL: 'public-read'
                };
                return Promise.join(
                    this.s3.getSignedUrl('putObject', params),
                    policy,
                    signature
                );
            })
            .spread((url, policy, signature) => ({
                url,
                policy,
                signature
            }));
    }

    getSignedUploadUrl(fileName) {
        const params = {
            Bucket: this.bucket,
            Key: fileName
        };
        return new Promise((resolve, reject) => {
            this.s3.getSignedUrl('getObject', params, (error, url) => {
                if (error) {
                    return reject(error);
                }
                return resolve(url);
             });
        });
    }
}
