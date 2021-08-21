import sw from "./service-worker-registration"
import ReactDOM from "react-dom"
import React from "react"
import App from "./App"
import "./index.scss"

declare global {
	interface Window {
		logger: {
			enabled: boolean
			debug: (data: string) => void
			info: (data: string) => void
			log: (data: string) => void
			warn: (data: string) => void
			error: (data: string) => void
		}
	}
}

sw.register()

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("root")
)

export type ID = string
