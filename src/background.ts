"use strict";


import { app, protocol, BrowserWindow, Tray, Menu, dialog, nativeImage } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import path from 'path'

import * as worker from '@/main/worker'

import "reflect-metadata"

import pkg from 'root/package.json'

const isDevelopment = process.env.NODE_ENV !== "production";

let win: BrowserWindow | null;
let tray: Tray | null
let contextMenu: Menu | null

protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } }
]);



function createContextMenu() {
  contextMenu = Menu.buildFromTemplate([
    {
      label: '关于',
      click() {
        dialog.showMessageBox({
          title: pkg.name,
          message: pkg.name,
          icon: nativeImage.createFromPath(`${__static}/logo.png`),
          detail: `Version: ${pkg.version}\nAuthor: Morris\nGithub: https://github.com/cc12703/docsetSyncerForPC`
        })
      }
    },
    {
      role: 'quit',
      label: '退出'
    }
  ])
}


function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    center: true,
    webPreferences: {
      nodeIntegration: (process.env.ELECTRON_NODE_INTEGRATION as unknown) as boolean,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    win.loadURL("app://./index.html");
  }

  win.on("closed", () => {
    win = null;
  });
 
}




function createTray() {
  tray = new Tray(`${__static}/menubar.png`)
  tray.on('click', () => {
      if(win === null) {
        createWindow()
      }
      win!.show();
  })
  tray.on('right-click', () => {
    createContextMenu()
    tray!.popUpContextMenu(contextMenu!)
  })
}


app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});


app.on("ready", async () => {
  /*
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  */
  
  worker.init()

  if (process.env.RUN_MODE === "debug") {
    worker.test()
  }
  else {
    createWindow()
    createTray()
  }
  
});

app.on('will-quit', () => {
});

if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", data => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

if(app.isPackaged) {
  app.setLoginItemSettings({ 
    openAtLogin: true
  })
}
