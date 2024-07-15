// main.js

// Modules to control application life and create native browser window
//const { app, BrowserWindow } = require('electron')
//const path = require('node:path')

import { app, BrowserWindow } from 'electron'
import { dirname, join, resolve } from 'node:path'

console.log(process.versions)
const __DIR = dirname(import.meta.url)

const browserConfig = {
	width: 480,
	minWidth: 370,
	maxWidth: 800,

	height: 720,
	minHeight: 640,

	//x: 10,
	//y: 150,
	center: true,
	fullscreenable: false,
	maximizable: false,

	//show: false,
	paintWhenInitiallyHidden: false,
	icon: './icon.png',

	// backgroundColor: '#000000',
	frame: true,
	darkTheme: true,
	opacity: 1,

	//parent: parent'

	webPreferences: {
		nativeWindowOpen: true,
		nodeIntegration: true,
		contextIsolation: false
	}
}

const createWindow = () => {
	// Create the browser window.
	const mainWindow = new BrowserWindow(browserConfig
	// {
	// 	width: 800,
	// 	height: 600,
	// 	webPreferences: {
	// 		preload: './preload.js'
	// 	}
	// }
)

	// and load the index.html of the app.
	mainWindow.loadFile('index.html')

	// Open the DevTools.
	// mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Algumas APIs podem ser usadas somente depois que este evento ocorre.
app.whenReady().then(() => {
	createWindow()

	app.on('activate', () => {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. Você também pode colocar eles em arquivos separados e requeridos-as aqui.