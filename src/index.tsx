import sw from "./service-worker-registration"
import preval from "preval.macro"
import ReactDOM from "react-dom"
import React from "react"
import App from "./App"
import "./index.scss"

export const buildTime: number = preval`module.exports = Date.now()`
export const buildVersion = `${
	process.env.REACT_APP_VERCEL_GIT_COMMIT_REF || process.env.NODE_ENV
}-${buildTime.toString(36)}`

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
