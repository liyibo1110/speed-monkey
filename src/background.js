import { app, protocol, BrowserWindow, Menu, dialog} from 'electron'
import fs from 'fs'
import path from 'path'
import jobs from './config/jobs'
import {
  createProtocol,
  //installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
// Standard scheme must be registered before the app is ready
protocol.registerStandardSchemes(['app'], { secure: true })
function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 1024, height: 768})
  Menu.setApplicationMenu(null); 
  if (isDevelopment || process.env.IS_TEST) {

    console.log(__dirname)
    //console.log(process.argv[0])
    //console.log(dialog.showErrorBox('title', process.argv[0]))
    //let confData = fs.readFileSync(path.join(__dirname) + path.sep + 'conf.json');
    
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
    jobs.setConfig(JSON.parse(fs.readFileSync(path.join(__dirname) + path.sep + 'conf.json')));
    console.log(jobs.config[1].name);
  } else {
    //console.log(dialog.showErrorBox('title', process.argv[0]))
    //let confData = fs.readFileSync(path.dirname(process.argv[0]) + path.sep + 'conf.json');
    jobs.setConfig(JSON.parse(fs.readFileSync(path.dirname(process.argv[0]) + path.sep + 'conf.json')));
    //console.log(jobs.config[1].name);
    console.log(dialog.showErrorBox('title', jobs.config[1].name));
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html') 
  }

  win.on('closed', () => {
    win = null
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    //await installVueDevtools()
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
