import translate, { Language, languages } from "./translations"
import { useEffect } from "react"
import { ReactComponent as HeaderIcon } from "./icons/header.svg"
import { ReactComponent as ThemesIcon } from "./icons/theme.svg"
import { ReactComponent as DebugIcon } from "./icons/debug.svg"
import { ReactComponent as FormIcon } from "./icons/form.svg"
import { ReactComponent as SyncIcon } from "./icons/sync.svg"
import styles from "./Controls.module.scss"
import shared from "./shared.module.scss"

const LanguageSelect = () => {
	const { language, fallback } = translate.useOptions()

	return (
		<select
			className={styles.languageselect}
			name="language"
			value={language}
			onChange={(ev) => {
				translate.setOptions({
					language: ev.target.value as Language,
					fallback
				})
			}}
		>
			{Object.keys(languages).map((language) => (
				<option key={language} value={language}>
					{languages[language as Language]}
				</option>
			))}
		</select>
	)
}

export const Controls = ({
	questionRelated,
	headerEnabled,
	setHeaderEnabled,
	toggleTheme,
	formEnabled,
	setFormEnabled
}: {
	questionRelated: boolean
	headerEnabled: boolean
	setHeaderEnabled: (newHeaderEnabled: boolean) => unknown
	toggleTheme: () => unknown
	formEnabled: boolean
	setFormEnabled: (newHeaderEnabled: boolean) => unknown
}) => {
	const t = translate.use().Controls

	useEffect(() => {
		// Keyboard shortcuts
		const controller = new AbortController()

		const listener = (ev: KeyboardEvent) => {
			if (ev.key === "h" && ev.altKey) {
				setHeaderEnabled(!headerEnabled)
				ev.preventDefault()
			} else if (ev.key === "d" && ev.altKey) {
				window.logger.enabled = !window.logger.enabled
				ev.preventDefault()
			} else if (ev.key === "t" && ev.altKey) {
				toggleTheme()
				ev.preventDefault()
			} else if (ev.key === "f" && ev.altKey && questionRelated) {
				setFormEnabled(!formEnabled)
				ev.preventDefault()
			}
		}

		document.addEventListener("keydown", listener, {
			signal: controller.signal
		} as unknown as AddEventListenerOptions)

		return () => {
			controller.abort()
		}
	}, [
		questionRelated,
		headerEnabled,
		setHeaderEnabled,
		toggleTheme,
		formEnabled,
		setFormEnabled
	])

	return (
		<div className={styles.controls}>
			<LanguageSelect />

			<div className={styles.buttons}>
				<button
					className={shared.iconbutton}
					onClick={() => {
						setHeaderEnabled(!headerEnabled)
					}}
					title={t.header}
				>
					<HeaderIcon
						className={`${shared.iconbuttonimg} ${shared.svgicon}`}
					/>
				</button>
				<button
					className={shared.iconbutton}
					onClick={() => {
						toggleTheme()
					}}
					title={t.theme}
				>
					<ThemesIcon
						className={`${shared.iconbuttonimg} ${shared.svgicon}`}
					/>
				</button>
				<button
					className={shared.iconbutton}
					onClick={() => {
						window.logger.enabled = !window.logger.enabled
					}}
					title={t.debug}
				>
					<DebugIcon
						className={`${shared.iconbuttonimg} ${shared.svgicon}`}
					/>
				</button>

				{questionRelated ? (
					<>
						<button
							className={shared.iconbutton}
							onClick={() => setFormEnabled(!formEnabled)}
							title={t.form}
						>
							<FormIcon
								className={`${shared.iconbuttonimg} ${shared.svgicon}`}
							/>
						</button>
						<button
							className={shared.iconbutton}
							onClick={() => console.log("sync/syncrequest")}
							title={t.sync}
						>
							<SyncIcon
								className={`${shared.iconbuttonimg} ${shared.svgicon}`}
							/>
						</button>
					</>
				) : null}
			</div>
		</div>
	)
}
