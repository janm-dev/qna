import { createTranslations } from "react-ridge-translations"

type TranslationLanguages = {
	en: string
}

const translate = createTranslations<TranslationLanguages>()(
	{
		TransportSelect: {
			local: {
				en: "local"
			},
			remote: {
				en: "remote"
			}
		},

		Home: {
			code: {
				en: "Code:"
			},
			type: {
				en: "Type:"
			},

			connect: {
				en: "Connect"
			},
			host: {
				en: "Host"
			},

			shortcuts: {
				en: "Keyboard Shortcuts:"
			},
			shortH: {
				en: "Show/Hide header"
			},
			shortT: {
				en: "Switch themes (browser setting, light, dark)"
			},
			shortD: {
				en: "Show/Hide debug information in the console"
			},
			shortF: {
				en: "(/host or /connect) Show/hide question form"
			},
			shortS: {
				en: "(/host) Sync all clients to the current questions"
			},
			shortR: {
				en: "(/connect) Request a sync to all clients from the host"
			},

			types: {
				en: "Connection Types:"
			},
			local: {
				en: "local"
			},
			localDesc: {
				en: "Connect to other tabs in the same browser using BroadcastChannel (Chrome, Firefox, Edge, Opera)*"
			},
			remote: {
				en: "remote"
			},
			remoteDesc: {
				en: "Connect to other tabs in any browser with an internet connection through a server using WebSockets (most browsers)*"
			},

			note1: {
				en: "* Modern desktop versions of the above browsers. For more info on browser version support check "
			},
			note2: {
				en: "here for local connections"
			},
			note3: {
				en: ", and "
			},
			note4: {
				en: "here for remote connection"
			},
			note5: {
				en: "."
			},

			copy: {
				en: "© janm.ml and contributors"
			},
			webapp: {
				en: "Web App source"
			},
			server: {
				en: "WebSocket server source"
			}
		},

		QuestionForm: {
			author: {
				en: "Author"
			},
			question: {
				en: "Lorem ipsum dolor sit amet, ..."
			},

			clear: {
				en: "Clear form"
			},
			send: {
				en: "Send question"
			}
		},

		Question: {
			up: {
				en: "Upvote"
			},
			remove: {
				en: "Remove"
			},
			down: {
				en: "Downvote"
			}
		}
	},
	{
		language: "en",
		fallback: "en"
	}
)

export default translate
