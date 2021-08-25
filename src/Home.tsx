import { DataTransport, navigate } from "./connection"
import styles from "./Home.module.scss"

// Symbols for randomly generated code (digits more likely on purpose)
const symbols = "01234567890123456789abcdefghijklmnopqrstuvwxyz"

const TransportSelect = ({
	dataTransport,
	setDataTransport
}: {
	dataTransport: DataTransport
	setDataTransport: (newDataTransport: DataTransport) => unknown
}) => (
	<select
		className={styles.transportselect}
		name="connection type"
		value={dataTransport}
		onChange={(ev) => {
			setDataTransport(ev.target.value as DataTransport)
		}}
	>
		<option value={DataTransport.BROADCASTCHANNEL}>local</option>
		<option value={DataTransport.WEBSOCKET}>remote</option>
	</select>
)

const Home = ({
	code,
	setCode,
	dataTransport,
	setDataTransport
}: {
	code: string
	setCode: (newCode: string) => unknown
	dataTransport: DataTransport
	setDataTransport: (newDataTransport: DataTransport) => unknown
}) => {
	// I'm using crypto here just because it's convenient,
	// not because this has anything to do with cryptography.
	const hostBackupCode = [
		...crypto.getRandomValues(
			new Uint8Array(
				dataTransport === DataTransport.BROADCASTCHANNEL ? 4 : 9
			)
		)
	]
		.map((num) => symbols[num % symbols.length])
		.join("")

	return (
		<main className={styles.main}>
			<div className={styles.connectform}>
				<b className={styles.codeinputtext}>Code:</b>
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
				<b className={styles.transportselecttext}>Type:</b>
				<TransportSelect
					dataTransport={dataTransport}
					setDataTransport={setDataTransport}
				/>
				<button
					className={styles.connectbutton}
					disabled={code.length < 1}
					onClick={() => navigate("connect", code, dataTransport)}
				>
					Connect
				</button>
				<button
					className={styles.hostbutton}
					onClick={() =>
						navigate("host", code || hostBackupCode, dataTransport)
					}
				>
					Host
				</button>
			</div>

			<section className={styles.infosection}>
				<h4 className={styles.infoheader}>Keyboard Shortcuts:</h4>
				<div className={styles.infoblock}>
					<code className={styles.mono}>alt+h</code>
					<p className={styles.infotext}>Show/Hide header</p>
				</div>
				<div className={styles.infoblock}>
					<code className={styles.mono}>alt+t</code>
					<p className={styles.infotext}>
						Switch themes (browser setting, light, dark)
					</p>
				</div>
				<div className={styles.infoblock}>
					<code className={styles.mono}>alt+d</code>
					<p className={styles.infotext}>
						Show/Hide debug information in the console
					</p>
				</div>
				<div className={styles.infoblock}>
					<code className={styles.mono}>alt+f</code>
					<p className={styles.infotext}>
						(/host or /connect) show/hide question form
					</p>
				</div>
				<div className={styles.infoblock}>
					<code className={styles.mono}>alt+s</code>
					<p className={styles.infotext}>
						(/host) sync all clients to the current questions
					</p>
				</div>
				<div className={styles.infoblock}>
					<code className={styles.mono}>alt+r</code>
					<p className={styles.infotext}>
						(/connect) request a sync to all clients from the host
					</p>
				</div>
			</section>

			<section className={styles.infosection}>
				<h4 className={styles.infoheader}>Connection Types:</h4>
				<div className={styles.infoblock}>
					<code className={styles.mono}>local</code>
					<p className={styles.infotext}>
						Connect to other tabs in the same browser using
						BroadcastChannel (Chrome, Firefox, Edge, Opera&nbsp;*)
					</p>
				</div>
				<div className={styles.infoblock}>
					<code className={styles.mono}>remote</code>
					<p className={styles.infotext}>
						Connect to other tabs in any browser with an internet
						connection through a server using WebSockets (most
						browsers&nbsp;*)
					</p>
				</div>
			</section>

			<section className={styles.infosection}>
				<i className={styles.infonote}>
					*&nbsp;Modern desktop versions of the above browsers. For
					more info on browser version support check{" "}
					<a
						className={styles.infolink}
						href="https://caniuse.com/broadcastchannel"
					>
						here for local connections
					</a>
					, and{" "}
					<a
						className={styles.infolink}
						href="https://caniuse.com/mdn-api_websocket"
					>
						here for remote connection
					</a>
					.
				</i>
			</section>
			<div className={styles.source}>
				<p className={styles.sourcetext}>&copy;&nbsp;janm.ml</p>
				<a href="https://github.com/janmml/qna">
					<p className={styles.sourcetext}>Web App source</p>
				</a>
				<a href="https://github.com/janmml/qna-relay">
					<p className={styles.sourcetext}>WebSocket server source</p>
				</a>
			</div>
		</main>
	)
}

export default Home
