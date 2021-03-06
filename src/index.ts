import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { app, BrowserWindow } from 'electron';
import { argv } from 'yargs';
import { Colors } from '@blueprintjs/core';
import { devices } from 'node-hid';
import { enableLiveReload } from 'electron-compile';

import * as usbDetect from 'usb-detection';

if (argv.list) {
  console.log(devices());
  process.exit(0);
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: Electron.BrowserWindow | null = null;

const isDevMode = process.execPath.match(/[\\/]electron/);
if (isDevMode) enableLiveReload({ strategy: 'react-hmr' });

usbDetect.startMonitoring();

usbDetect.on('change', function (device) {
  if (mainWindow != null) {
    console.log('USB Event Changed');
    mainWindow.webContents.send('usb:change', device);
  }
});


const createWindow = async () => {

  // Create the browser window.
  mainWindow = new BrowserWindow({
    backgroundColor: Colors.LIGHT_GRAY5,
    width: 800,
    height: 600,
    title: "KSO Config",
    titleBarStyle: "hidden-inset",
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  if (isDevMode) {
    await installExtension(REACT_DEVELOPER_TOOLS);
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('quit', () => {
  usbDetect.stopMonitoring();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
