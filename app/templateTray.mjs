/*
	Electronizer

	Copyright (c) 2021, Bill Rocha
	Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com
	Git: https://github.com/pedra/electronizer

 */

import { app } from 'electron'
import { readFileSync } from 'node:fs'
import App from './app.mjs'

class AppTray {

	getTemplate() {
		return [{
			label: 'Abrir Electronizer',
			icon: App.path + '/assets/img/tray/icon16.png',
			click: () => app.show()
		}, {
			label: 'Site da Aplicação',
			icon: App.path + '/assets/img/tray/h.png',
			click: () => this.Notify('Electronizer', "A notificação está funcionando como esperado!")
			// click: () => shell.openExternal('https://google.com')
			}, {
				label: 'Mensagens',
				icon: App.path + '/assets/img/tray/globe32.png',
				click: () => {
					const m = JSON.parse(readFileSync(App.path + '/assets/messages.json', 'utf8'))
					this.Notify('Message', `Message ID: ${m.messages[1].id} - Message: ${m.messages[1].text}`)
				}
			}, {
			type: 'separator'
		}, {
			label: 'Sair e fechar',
			icon: App.path + '/assets/img/tray/x.png',
			click: () => {
				App.windows.clear()
				app.quit()
			}
		}]
	}

	Notify(titulo, mensagem) {
		const tray = App.getTray()

		if (tray) {
			titulo = titulo || 'Electronizer'
			mensagem = mensagem || 'Hello Word!'

			tray.setImage(App.path + '/assets/img/tray/icon.png')

			tray.displayBalloon({
				icon: App.path + '/assets/img/tray/icon.png',
				title: titulo,
				content: mensagem
			})

			tray.on('balloon-click', () => {
				App.windows.get('main').show()
			})
		}
	}
}

const TemplateTray = new AppTray()
export default TemplateTray