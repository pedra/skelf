import { app, Tray, Menu, ipcMain } from 'electron'
import Windows from './windows.mjs'
import TemplateTray from './templateTray.mjs'
import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import IpcHandler from './ipchandler.mjs'
import Cpu from './cpu.mjs'

class App {
	static instance = null
	tray = null
	path = null
	windows = null
	ipc = null

	constructor() {
		this.path = path.resolve(existsSync('./resources/app.asar/app/app.mjs') ? 
			'./resources/app.asar' : 
			'.')
		this.windows = Windows.getInstance()
		this.ipc = new IpcHandler()
		app.on('ready', (e) => this.init(e));

		if (!app.requestSingleInstanceLock()) app.quit()
		else app.on('second-instance', () => {
			const Window = this.windows.get('main')
			if (Window.isMinimized()) Window.restore()
			Window.show()
			Window.focus()
		})

		app.on('window-all-closed', (e) => this.onWindowAllClosed(e))
		app.on('will-quit', (e) => this.onWillQuit(e)) // Before quit ...
		app.on('quit', (e) => this.onQuit(e))
	}

	static getInstance() {
		if (!App.instance) App.instance = new App()
		return App.instance
	}

	init(e) {
		this.windows.create('main')
		this.setTray()		
	}

	// EVENTS --------------------------------------------------------------------------------------------------------*/
	onWindowAllClosed(e){
		console.log('\nTodas as janelas foram fechadas - window-all-closed\n')
		e.preventDefault()
	}

	onQuit(e){
		console.log("---> Quit!")

		// Destroy Tray
		this.tray.destroy()
	}

	onWillQuit(e) {
		console.log('Antes de fechar tudo - will-quit')
		e.preventDefault()

		// TESTE .... 
		//setTimeout(() => { app.exit() }, 100)
		app.exit()
	}


	// TRAY ----------------------------------------------------------------------------------------------------------*/
	getTray() {
		return this.tray
	}
	setTray() {
		this.tray = new Tray(this.path + '/assets/img/tray/icon.png')
		this.tray.setContextMenu(Menu.buildFromTemplate(TemplateTray.getTemplate()))
		this.tray.setToolTip('Título da Aplicação')
		this.tray.on('click', () => this.windows.get('main').show())
		this.tray.on('balloon-click', () => console.log('Clicou no balloon | main.ts:37'))
	}
}

export default App.getInstance()