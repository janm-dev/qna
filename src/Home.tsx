import { DataTransport, navigate } from "./connection"
import translate, { Language } from "./translations"
import { Controls } from "./Controls"
import { ReactComponent as HeaderIcon } from "./icons/header.svg"
import { ReactComponent as ThemesIcon } from "./icons/theme.svg"
import { ReactComponent as DebugIcon } from "./icons/debug.svg"
import { ReactComponent as FormIcon } from "./icons/form.svg"
import { ReactComponent as SyncIcon } from "./icons/sync.svg"
import shared from "./shared.module.scss"
import styles from "./Home.module.scss"

// Symbols for randomly generated code (digits more likely on purpose)
const symbols = "01234567890123456789abcdefghijklmnopqrstuvwxyz"

const TransportSelect = ({
	dataTransport,
	setDataTransport,
}: {
	dataTransport: DataTransport
	setDataTransport: (newDataTransport: DataTransport) => unknown
}) => {
	const t = translate.use().TransportSelect

	return (
		<select
			className={styles.transportselect}
			name="connection type"
			value={dataTransport}
			onChange={(ev) => {
				setDataTransport(ev.target.value as DataTransport)
			}}
		>
			<option value={DataTransport.BROADCASTCHANNEL}>{t.local}</option>
			<option value={DataTransport.WEBSOCKET}>{t.remote}</option>
		</select>
	)
}

const Home = ({
	code,
	setCode,
	dataTransport,
	setDataTransport,
	headerEnabled,
	setHeaderEnabled,
	toggleTheme,
	formEnabled,
	setFormEnabled,
	toggleDebugEnabled,
	language,
	setLanguage,
}: {
	code: string
	setCode: (newCode: string) => unknown
	dataTransport: DataTransport
	setDataTransport: (newDataTransport: DataTransport) => unknown
	headerEnabled: boolean
	setHeaderEnabled: (newHeaderEnabled: boolean) => unknown
	toggleTheme: () => unknown
	formEnabled: boolean
	setFormEnabled: (newHeaderEnabled: boolean) => unknown
	toggleDebugEnabled: () => unknown
	language: Language
	setLanguage: (newLanguage: Language) => unknown
}) => {
	const t = translate.use().Home

	// I'm using crypto here just because it's convenient,
	// not because this has anything to do with cryptography.
	const hostBackupCode = [
		...crypto.getRandomValues(
			new Uint8Array(
				dataTransport === DataTransport.BROADCASTCHANNEL ? 4 : 9
			)
		),
	]
		.map((num) => symbols[num % symbols.length])
		.join("")

	return (
		<main className={styles.main}>
			<div className={styles.connectform}>
				<b className={styles.codeinputtext}>{t.code}</b>
				<input
					size={10}
					id="code"
					name="code"
					type="text"
					value={code}
					maxLength={9}
					placeholder={hostBackupCode}
					className={styles.codeinput}
					onChange={(ev) => {
						setCode(ev.target.value)
					}}
				/>
				<b className={styles.transportselecttext}>{t.type}</b>
				<TransportSelect
					dataTransport={dataTransport}
					setDataTransport={setDataTransport}
				/>
				<button
					className={styles.connectbutton}
					disabled={code.length < 1}
					onClick={() => navigate("connect", code, dataTransport)}
				>
					{t.connect}
				</button>
				<button
					className={styles.hostbutton}
					onClick={() =>
						navigate("host", code || hostBackupCode, dataTransport)
					}
				>
					{t.host}
				</button>
			</div>

			<Controls
				questionRelated={false}
				headerEnabled={headerEnabled}
				setHeaderEnabled={setHeaderEnabled}
				toggleTheme={toggleTheme}
				formEnabled={formEnabled}
				setFormEnabled={setFormEnabled}
				toggleDebugEnabled={toggleDebugEnabled}
				language={language}
				setLanguage={setLanguage}
			/>

			<section className={styles.infosection}>
				<h3 className={styles.infoheader}>{t.shortcuts}</h3>
				<div className={styles.infoblock}>
					<code className={styles.mono}>
						alt+h
						<HeaderIcon
							className={`${shared.svgicon} ${styles.controlicon}`}
						/>
					</code>
					<p className={styles.infotext}>{t.shortH}</p>
				</div>
				<div className={styles.infoblock}>
					<code className={styles.mono}>
						alt+t
						<ThemesIcon
							className={`${shared.svgicon} ${styles.controlicon}`}
						/>
					</code>
					<p className={styles.infotext}>{t.shortT}</p>
				</div>
				<div className={styles.infoblock}>
					<code className={styles.mono}>
						alt+d
						<DebugIcon
							className={`${shared.svgicon} ${styles.controlicon}`}
						/>
					</code>
					<p className={styles.infotext}>{t.shortD}</p>
				</div>
				<div className={styles.infoblock}>
					<code className={styles.mono}>
						alt+f
						<FormIcon
							className={`${shared.svgicon} ${styles.controlicon}`}
						/>
					</code>
					<p className={styles.infotext}>{t.shortF}</p>
				</div>
				<div className={styles.infoblock}>
					<code className={styles.mono}>
						alt+s
						<SyncIcon
							className={`${shared.svgicon} ${styles.controlicon}`}
						/>
					</code>
					<p className={styles.infotext}>{t.shortS}</p>
				</div>
				<div className={styles.infoblock}>
					<code className={styles.mono}>
						alt+r
						<SyncIcon
							className={`${shared.svgicon} ${styles.controlicon}`}
						/>
					</code>
					<p className={styles.infotext}>{t.shortR}</p>
				</div>
			</section>

			<section className={styles.infosection}>
				<h3 className={styles.infoheader}>{t.types}</h3>
				<div className={styles.infoblock}>
					<code className={styles.mono}>{t.local}</code>
					<p className={styles.infotext}>{t.localDesc}</p>
				</div>
				<div className={styles.infoblock}>
					<code className={styles.mono}>{t.remote}</code>
					<p className={styles.infotext}>{t.remoteDesc}</p>
				</div>
			</section>

			<section className={styles.infosection}>
				<i className={styles.infonote}>
					{t.note1}
					<a
						className={styles.infolink}
						href="https://caniuse.com/broadcastchannel"
					>
						{t.note2}
					</a>
					{t.note3}
					<a
						className={styles.infolink}
						href="https://caniuse.com/mdn-api_websocket"
					>
						{t.note4}
					</a>
					{t.note5}
				</i>
			</section>
			<div className={styles.source}>
				<p className={styles.sourcetext}>{t.copy}</p>
				<a href="https://github.com/janm-dev/qna">
					<p className={styles.sourcetext}>{t.webapp}</p>
				</a>
				<a href="https://github.com/janm-dev/ws-relay">
					<p className={styles.sourcetext}>{t.server}</p>
				</a>
			</div>
		</main>
	)
}

export default Home
