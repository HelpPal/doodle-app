/* globals ELECTRON */
import React from 'react';
import Promise from 'bluebird';
import { saveAs } from 'file-saver';
import { renderToStaticMarkup } from 'react-dom/server';
import uuid from 'uuid';

import { api } from '~/constants';
import { Renderer } from '~/components/renderer';
import AppProvider from '~/AppProvider';

export function exportUpload() {
  const canvas = document.querySelector('#webGLCanvas');
  if (!canvas) {
      throw new Error('Failed to find canvas.');
  }
  canvas.toBlob(blob => exportBlob(blob), 'image/png');
}

function exportBlob(blob) {
  const fileName = `doodles/${uuid.v4()}.png`;
  const contentType = 'image/png';
  Promise.resolve(fetch(
    `http://${api.host}:${api.port}/api/media/signature`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contentType: contentType,
        fileName: fileName
      })
    }
  ))
  .then(res => res.json())
  .then(body => {
    return new Promise((resolve, reject) => {
       const reader = new FileReader();
       reader.readAsDataURL(blob);
       reader.onload = () => {
         const buffer = new Buffer(reader.result.replace(/^data:image\/\w+;base64,/, ''), 'base64');
         resolve(fetch(
           body.url,
           {
             method: 'PUT',
             headers: {
               'x-amz-acl': 'public-read',
               'Content-Type': contentType,
               'Content-Length': buffer.length
             },
             body: buffer
           }
         ));
       };
       reader.onerror = error => reject(error);
   });
 });
}

export function exportAsPNG(fileName = 'doodle.png', printRotation = 0) {
    const canvas = document.querySelector('#webGLCanvas');
    if (!canvas) {
        throw new Error('Failed to find canvas.');
    }
    canvas.toBlob(blob => saveAs(blob, fileName), 'image/png');
}

export function exportAsSVG() {
    const svgElementString = renderSvgElementToString();
    const svgString = `
        <?xml version="1.0" standalone="no"?>
        <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
         "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
        ${replaceTags(svgElementString)}
    `.trim();
    saveAs(stringToBlob(svgString), 'doodle.svg');
}

/**
 * FIXME:
 * This is super hacky....
 * We should definitely come up with a better solution
 * #needsrefactor
 */
function replaceTags(svgElementString) {
    return svgElementString.replace('href', 'xlink:href');
}

function renderSvgElementToString() {
    const canvas = document.querySelector('#webGLCanvas');
    if (!canvas) {
        throw new Error('Failed to find canvas.');
    }
    return renderToStaticMarkup((
      <AppProvider>
        <Renderer kind="svg" dimensions={{
            width: canvas.width,
            height: canvas.height
        }}/>
      </AppProvider>
    ));
}

function stringToBlob(str) {
    return new Blob([str], { type: 'image/svg+xml' });
}

export function exportToPrinter(printRotation = 0, callback) {
    const canvas = document.querySelector('#webGLCanvas');
    if (!canvas) {
        throw new Error('Failed to find canvas.');
    }
    const { width, height } = canvas;

    // TODO fix this for web version
    // canvas.toBlob(blob => {
    //     const dataUrl = URL.createObjectURL(blob);
    //     if (ELECTRON) {
    //         return printDataUrlElectron(dataUrl, width, height);
    //     }
    //     return printDataUrlWeb(dataUrl, width, height);
    // }, 'image/png');

    const dataUrl = canvas.toDataURL();
    if (ELECTRON) {
        return printDataUrlElectron(printRotation, dataUrl, width, height, callback);
    }
    return printDataUrlWeb(printRotation, dataUrl, width, height);
}

function printDataUrlElectron(printRotation = 0, dataUrl, width, height, callback) {
    const BrowserWindow = require('electron').remote.BrowserWindow;
    const newWindow = new BrowserWindow({
      width,
      height,
      show: false,
      useContentSize: true,
      center: true,
      resizable: true,
      frame: true,
      transparent: false
    });
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            img {
              transform: rotate(${printRotation}deg);
            }
            body {
              margin: 0;
            }
            @page {
              size: auto;
              margin: 0mm;
            }
            @media print {
              html, body {
                overflow: hidden;
              }
            }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" height="100%" width="100%">
        </body>
      </html>`;
    newWindow.loadURL(`data:text/html,${html}`);
    newWindow.webContents.on('did-finish-load', () => {
      Promise.resolve()
        .delay(1000)
        .then(() => {
          newWindow.webContents.toggleDevTools();
          newWindow.webContents.print({
            silent: false,
            printBackground: false
          });
        })
        .delay(1000)
        .then(() => callback());
    });
}

function printDataUrlWeb(printRotation = 0, dataUrl, width, height) {
    const windowContent = `<!DOCTYPE html>
                           <html>
                               <head>
                                 <style>
                                   img {
                                     transform: rotate(${printRotation}deg);
                                   }
                                   body {
                                     margin: 0;
                                   }
                                   @page {
                                     size: auto;
                                     margin: 0mm;
                                   }
                                   @media print {
                                     html, body {
                                       height: 100%;
                                       overflow: hidden;
                                     }
                                   }
                                 </style>
                               </head>
                               <body>
                                    <img src="${dataUrl}">
                               </body>
                           </html>`;
     const printWin = window.open('', '', `width=${width},height=${height}`);
     printWin.document.open();
     printWin.document.write(windowContent);
     printWin.document.close();
     printWin.focus();
     printWin.print();
     printWin.close();
}
