import translate, { Language, languages } from "./translations"
import { QuestionInfo } from "./Question"
import connection from "./connection"
import { useEffect } from "react"
import { ReactComponent as HeaderIcon } from "./icons/header.svg"
import { ReactComponent as ThemesIcon } from "./icons/theme.svg"
import { ReactComponent as DebugIcon } from "./icons/debug.svg"
import { ReactComponent as FormIcon } from "./icons/form.svg"
import { ReactComponent as SyncIcon } from "./icons/sync.svg"
import styles from "./Controls.module.scss"
import shared from "./shared.module.scss"

const LanguageSelect = ({
	language,
	setLanguage,
}: {
	language: Language
	setLanguage: (newLanguage: Language) => unknown
}) => (
	<select
		className={styles.languageselect}
		name="language"
		value={language}
		onChange={(ev) => {
			setLanguage(ev.target.value as Language)
		}}
	>
		{Object.keys(languages).map((language) => (
			<option key={language} value={language}>
				{languages[language as Language]}
			</option>
		))}
	</select>
)

export const Controls = ({
	questionRelated,
	isHost = false,
	questions,
	headerEnabled,
	setHeaderEnabled,
	toggleTheme,
	formEnabled,
	setFormEnabled,
	toggleDebugEnabled,
	language,
	setLanguage,
}: {
	questionRelated: boolean
	isHost?: boolean
	questions?: QuestionInfo[]
	headerEnabled: boolean
	setHeaderEnabled: (newHeaderEnabled: boolean) => unknown
	toggleTheme: () => unknown
	formEnabled: boolean
	setFormEnabled: (newHeaderEnabled: boolean) => unknown
	toggleDebugEnabled: () => unknown
	language: Language
	setLanguage: (newLanguage: Language) => unknown
}) => {
	const t = translate.use().Controls

	const sync = () => {
		if (questionRelated) {
			if (isHost && questions) {
				connection.send({ type: "sync", content: questions })
			} else if (!isHost) {
				connection.send({ type: "requestSync", content: null })
			}
		}
	}

	useEffect(() => {
		// Keyboard shortcuts
		const controller = new AbortController()

		const listener = (ev: KeyboardEvent) => {
			if (ev.key === "h" && ev.altKey) {
				setHeaderEnabled(!headerEnabled)
				ev.preventDefault()
			} else if (ev.key === "d" && ev.altKey) {
				toggleDebugEnabled()
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
			signal: controller.signal,
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
		setFormEnabled,
		toggleDebugEnabled,
	])

	return (
		<div className={styles.controls}>
			<LanguageSelect language={language} setLanguage={setLanguage} />

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
						toggleDebugEnabled()
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
							onClick={() => sync()}
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
