import { DataTransport, navigate } from "./connection"
import "./Home.scss"

const TransportSelect = ({
	dataTransport,
	setDataTransport
}: {
	dataTransport: DataTransport
	setDataTransport: (newDataTransport: DataTransport) => unknown
}) => (
	<select
		name="connection type"
		value={dataTransport}
		onChange={(ev) => {
			setDataTransport(ev.target.value as DataTransport)
		}}
	>
		<option value={DataTransport.BROADCASTCHANNEL}>locally</option>
		<option value={DataTransport.WEBSOCKET}>remotely</option>
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
	const hostBackupCode = Math.floor(
		Math.random() * 900000 + 100000
	).toString()

	return (
		<main>
			<div>
				<h3>Use the code</h3>
				<input
					type="text"
					name="code"
					id="code"
					placeholder="123456"
					value={code}
					maxLength={9}
					size={10}
					onChange={(ev) => {
						setCode(ev.target.value)
					}}
				/>
				<h3>to</h3>
			</div>
			<div>
				<button
					disabled={code.length < 1}
					onClick={() => navigate("connect", code, dataTransport)}
				>
					Connect
				</button>
				<TransportSelect
					dataTransport={dataTransport}
					setDataTransport={setDataTransport}
				/>
				<h3>to</h3>
				<code>{code}</code>
				<h3>or</h3>
			</div>
			<div>
				<button
					disabled={(code || hostBackupCode).length < 1}
					onClick={() =>
						navigate("host", code || hostBackupCode, dataTransport)
					}
				>
					Host
				</button>
				<TransportSelect
					dataTransport={dataTransport}
					setDataTransport={setDataTransport}
				/>
				<h3>as</h3>
				<code>{code || hostBackupCode}</code>
			</div>
			<div className="info">
				<b>Keyboard Shortcuts:</b>
				<div>
					<code>alt+h</code>
					<p>Show/Hide header</p>
				</div>
				<div>
					<code>alt+d</code>
					<p>Show/Hide debug information in the console</p>
				</div>
				<div>
					<code>alt+f</code>
					<p>(/host or /connect) show/hide question form</p>
				</div>
				<div>
					<code>alt+s</code>
					<p>(/host) sync all clients to the current questions</p>
				</div>
				<div>
					<code>alt+r</code>
					<p>
						(/connect) request a sync to all clients from the host
					</p>
				</div>
				<br />
				<b>Connection Methods</b>
				<div>
					<code>local</code>
					<p>
						Connect to other tabs in the same browser using
						BroadcastChannel (Chrome, Firefox, Edge, Opera *)
					</p>
				</div>
				<div>
					<code>remote</code>
					<p>
						Connect to other tabs in any browser with an internet
						connection through a server using WebSockets (most
						browsers *)
					</p>
				</div>
				<i>
					* Modern desktop versions of the above browsers. For more
					info on browser version support check{" "}
					<a href="https://caniuse.com/broadcastchannel">
						here for local connections
					</a>
					, and{" "}
					<a href="https://caniuse.com/mdn-api_websocket">
						here for remote connection
					</a>
					.
				</i>
			</div>
		</main>
	)
}

export default Home
