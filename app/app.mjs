import { app, Tray, Menu, ipcMain } from 'electron'
import Windows from './windows.mjs'
import TemplateTray from './templateTray.mjs'
import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'

class App {
	static instance = null
	wins = []

	tray = null
	path = null
	windows = null

	constructor() {
		this.path = path.resolve(existsSync('./resources/app.asar/app/app.mjs') ? 
			'./resources/app.asar' : 
			'.')
		this.windows = Windows.getInstance()
		app.on('ready', () => this.init());

		// Passar isso 👇👇 para métodos dessa classe ------------------------------------------------------------------

		if (!app.requestSingleInstanceLock()) app.quit()
		else app.on('second-instance', () => {
			console.log("second-instance!!!")

			const Window = this.windows.get('main')
			if (Window.isMinimized()) Window.restore()
			Window.show()
			Window.focus()
		})

		// Previne o fechamento - destruição - de TODAS as janelas
		app.on('window-all-closed', e => {
			console.log('\nTodas as janelas foram fechadas - window-all-closed\n')
			e.preventDefault()
		})

		/* Antes de fechar a aplicação...
		 Uma sequencia de ações podem ser empilhadas para executar tarefas antes de fechar totalmente a aplicação.
		*/
		app.on('will-quit', e => {
			console.log('Antes de fechar tudo - will-quit')
			e.preventDefault()

			// TESTE .... 
			setTimeout(() => { app.exit() }, 1000)
		})

		// Finaliza quando todas as janelas estiverem fechadas.
		app.on('quit', e => {
			console.log("---> Quit!")

			// Destroy Tray
			this.tray.destroy()
		})
	}

	static getInstance() {
		if (!App.instance) {
			App.instance = new App()
		}
		return App.instance
	}

	init() {
		console.log('App->init: ', this.path)
		const m = JSON.parse(readFileSync(this.path + '/assets/messages.json', 'utf8'))
		console.log('App->init 2: ', `Message ID: ${m.messages[1].id} - Message: ${m.messages[1].text}`)

		this.windows.create('main')
		this.setTray()
	}

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