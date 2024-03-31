const { app, BrowserWindow,ipcMain } = require('electron')
const path = require('node:path')
const fs = require('fs');
const filename = "./test.txt"

function editSavestate(){
  // Step 1: Read the content of the text file
  fs.readFile('../data/savestates/savestates.js', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }

    // Step 2: Modify the content as needed
    const modifiedContent = "let savestate1 = {money:0, xp: 0, last_place: 'town', last_x_map: 100, last_y_map: 100}\n /*let savestate1 = {money:0, xp: 0, last_place: 'town', last_x_map: map_offsets.town.x, last_y_map: map_offsets.town.y}*/"

    // Step 3: Write the modified content back to the text file
    fs.writeFile('../data/savestates/savestates.js', modifiedContent, 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }
      console.log('File successfully modified!');
    });
  });
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 900,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  win.maximize()
  win.setFullScreen(true)
  win.loadFile('./views/main.html')
  ipcMain.on('get-fs-module', (event) => {
    event.returnValue = fs;
  });
  win.setMenuBarVisibility(true)
  win.scro
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

