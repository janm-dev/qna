import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import createPersistedState from "use-persisted-state"
import { DataTransport } from "./connection"
import { useEffect, useState } from "react"
import Client from "./Client"
import Home from "./Home"
import styles from "./App.module.scss"

export const themes = ["none", "light", "dark"]

const useHeaderState = createPersistedState("headerEnabled")
const useThemeState = createPersistedState("theme")

const App = () => {
	const [theme, setTheme] = useThemeState(0)
	const [headerEnabled, setHeaderEnabled] = useHeaderState(false)
	const [formEnabled, setFormEnabled] = useState(true)
	const [code, _setCode] = useState(
		(window.location.hash
			.slice(1)
			.split("@")[0]
			.match(/^[a-zA-Z0-9]{0,9}$/giu) || [""])[0]
	)
	const [dataTransport, setDataTransport] = useState(
		(window.location.hash.slice(1).split("@")[1] as DataTransport) ||
			DataTransport.BROADCASTCHANNEL
	)

	const setCode = (newCode: string) => {
		newCode = newCode.trim()

		if (/^[a-zA-Z0-9]{0,9}$/giu.test(newCode)) {
			_setCode(newCode)
		}
	}

	useEffect(() => {
		if (window.location.pathname !== "/" && (!code || !dataTransport)) {
			window.location.pathname = "/"
		}
	})

	useEffect(() => {
		document.querySelector("html")!.dataset.forceTheme = themes[theme]
	})

	useEffect(() => {
		// Keyboard shortcuts
		const controller = new AbortController()

		const switchTheme = () => {
			if (theme + 1 >= themes.length) {
				window.logger.log("Not forcing theme")
				setTheme(0)
			} else {
				window.logger.log(`Forcing theme ${themes[theme + 1]}`)
				setTheme(theme + 1)
			}
		}

		const listener = (ev: KeyboardEvent) => {
			if (ev.key === "h" && ev.altKey) {
				setHeaderEnabled(!headerEnabled)
				ev.preventDefault()
			} else if (ev.key === "f" && ev.altKey) {
				setFormEnabled(!formEnabled)
				ev.preventDefault()
			} else if (ev.key === "d" && ev.altKey) {
				window.logger.enabled = !window.logger.enabled
				ev.preventDefault()
			} else if (ev.key === "t" && ev.altKey) {
				switchTheme()
				ev.preventDefault()
			}
		}

		document.addEventListener("keydown", listener, {
			signal: controller.signal
		} as unknown as AddEventListenerOptions)

		return () => {
			controller.abort()
		}
	}, [headerEnabled, setHeaderEnabled, theme, setTheme, formEnabled])

	return (
		<Router>
			{!headerEnabled ? (
				<header className={styles.header}>
					<a className={styles.logolink} href="/">
						<h1 className={styles.logo}>qna</h1>
					</a>
					<h2 className={styles.code}>{code}</h2>
				</header>
			) : null}

			<Switch>
				<Route path="/connect">
					<Client
						code={code}
						dataTransport={dataTransport}
						formEnabled={formEnabled}
						setFormEnabled={setFormEnabled}
					/>
				</Route>
				<Route path="/host">
					<Client
						code={code}
						dataTransport={dataTransport}
						formEnabled={formEnabled}
						setFormEnabled={setFormEnabled}
						isHost
					/>
				</Route>
				<Route path="/">
					<Home
						code={code}
						setCode={(newCode: string) => {
							setCode(newCode)
						}}
						dataTransport={dataTransport}
						setDataTransport={setDataTransport}
					/>
				</Route>
			</Switch>
		</Router>
	)
}

export default App
