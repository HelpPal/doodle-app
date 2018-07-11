
import os from 'os';
import fs from 'fs';
import path from 'path';
import shortid from 'shortid';
import { Menu, BrowserWindow } from 'electron';

import app from './app';
import { web } from '~/constants';
import startServer from './server';

let mainWindow;

function createWindow() {
    const menu = Menu.buildFromTemplate([
        {
            label: 'Options',
            submenu: [
                {
                    role: 'Options',
                    label: 'Home',
                    click() {
                        mainWindow.loadURL(`http://localhost:${web.port}`);
                    }
                },
                {
                    role: 'Options',
                    label: 'Settings',
                    click() {
                        mainWindow.loadURL(`http://localhost:${web.port}/settings`);
                    }
                },
                {
                    role: 'Options',
                    label: 'Toggle FullScreen',
                    click() {
                        mainWindow.setFullScreen(!mainWindow.isFullScreen());
                    }
                },
                {
                    role: 'Options',
                    label: 'Open Developer Tools',
                    click() {
                        mainWindow.toggleDevTools();
                    }
                }
            ]
        }
    ]);
    Menu.setApplicationMenu(menu);
    mainWindow = new BrowserWindow({
        show: true,
        width: 1024,
        height: 768,
        fullscreenable: true
    });
    mainWindow.loadURL(`http://localhost:${web.port}`);
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
        const hash = shortid.generate();
        const fileName = item.getFilename() || `Doodle_${hash}.png`;
        const homedir = os.homedir();
        const uploadDir = path.resolve(homedir, 'Desktop', 'Doodles');
        const uploadPath = path.resolve(uploadDir, fileName);
        console.log(`Beginning file upload to ${uploadPath}`);
        item.setSavePath(uploadPath);
        item.once('done', (event, state) => {
            if (state === 'completed') {
                console.log('Download successfully');
            }
            else {
                console.log(`Download failed: ${state}`);
            }
        });
    });
}
app.on('ready', createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});


const homedir = os.homedir();
const downloadsDirectory = `${homedir}/Desktop/Doodles`;
console.log(`Creating downloads directory in: ${downloadsDirectory}`);
if (!fs.existsSync(downloadsDirectory)) {
    fs.mkdirSync(downloadsDirectory);
}

startServer();
