const { app, BrowserWindow } = require('electron')
const path = require('node:path')

const createWindow = () => {
    const win = new BrowserWindow({
      width: 900,
      height: 900,
      webPreferences: {
        preload: path.join(__dirname, 'scripts/preload.js')
      }
    })
    win.maximize()
    win.setFullScreen(true)
    win.loadFile('./views/index.html')
    win.setMenuBarVisibility(false)
    win.scro
  }

  app.whenReady().then(() => {
    createWindow()
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })