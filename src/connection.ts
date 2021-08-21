import { QuestionInfo } from "./Question"
import EventEmitter from "events"
import { ID } from "./index"

export enum DataTransport {
	BROADCASTCHANNEL = "b",
	WEBSOCKET = "s"
}

export const navigate = (
	action: "connect" | "host",
	code: string,
	transport: DataTransport
) => {
	window.location.href = `/${action}#${encodeURIComponent(code)}@${transport}`
}

class Connection extends EventEmitter {
	code: string
	isOpen: boolean
	isHost: boolean | null
	dataTransport: DataTransport | null
	#relayServerUrl: URL
	#broadcastChannel: BroadcastChannel | null
	#webSocket: WebSocket | null
	#dataQueue: ConnectionData[]

	constructor(relayServerUrl: URL) {
		super()
		window.logger.log("Instantiating connection")
		this.code = ""
		this.isOpen = false
		this.isHost = null
		this.dataTransport = null
		this.#relayServerUrl = relayServerUrl
		this.#broadcastChannel = null
		this.#webSocket = null
		this.#dataQueue = []
	}

	send(data: Data) {
		this._send(data)
		this._handleIncomingData(data)
	}

	open(code: string, dataTransport: DataTransport, isHost: boolean) {
		if (!this.isOpen) {
			window.logger.log(
				`Opening connection to ${code} with ${dataTransport}`
			)
			this.code = code
			this.isHost = isHost
			this.dataTransport = dataTransport

			switch (dataTransport) {
				case DataTransport.BROADCASTCHANNEL:
					this._openBroadcastChannel()
					break

				case DataTransport.WEBSOCKET:
					this._openWebSocket()
					break
			}

			this._send({
				type: "connection",
				content: this.isHost ? "host" : "client"
			})
		}
	}

	close() {
		if (this.isOpen) {
			window.logger.log("Closing connection")

			this._send({
				type: "disconnection",
				content: this.isHost ? "host" : "client"
			})

			this.code = ""
			this.isHost = null
			this._closeBroadcastChannel()
			this._closeWebSocket()

			this.isOpen = false
		}
	}

	_isData(potentialData: any): potentialData is Data {
		return (
			potentialData &&
			potentialData.type &&
			(potentialData.content || potentialData.content === null) &&
			dataTypes.includes(potentialData.type)
		)
	}

	_isInternalData(
		potentialInternalData: any
	): potentialInternalData is InternalData {
		return (
			potentialInternalData &&
			potentialInternalData.type &&
			(potentialInternalData.content ||
				potentialInternalData.content === null) &&
			internalDataTypes.includes(potentialInternalData.type)
		)
	}

	_isConnectionData(
		potentialConnectionData: any
	): potentialConnectionData is ConnectionData {
		return (
			this._isData(potentialConnectionData) ||
			this._isInternalData(potentialConnectionData)
		)
	}

	private _send(data: ConnectionData) {
		if (this.isOpen) {
			window.logger.log(
				`Sending ${JSON.stringify(data, null, "\t")} to ${this.code}`
			)

			switch (this.dataTransport) {
				case DataTransport.BROADCASTCHANNEL:
					this._sendOnBroadcastChannel(data)
					break

				case DataTransport.WEBSOCKET:
					this._sendOnWebSocket(data)
					break
			}
		} else {
			this.#dataQueue.push(data)
		}
	}

	private _onOpen() {
		this.isOpen = true

		for (const data of this.#dataQueue) {
			this._send(data)
		}

		this.#dataQueue = []

		if (!this.isHost) {
			this._send({ type: "requestSync", content: null })
		}
	}

	private _handleIncomingData(data: ConnectionData) {
		window.logger.log(
			`Received ${JSON.stringify(data, null, "\t")} on ${this.code}`
		)

		if (this._isData(data)) {
			this.emit("data", data)
		} else if (this._isInternalData(data)) {
			this._handleInternalData(data)
		} else {
			window.logger.warn("Received unknown data (see previous log)")
		}
	}

	private _handleIncomingBroadcastChannelData(ev: MessageEvent) {
		this._handleIncomingData(ev.data)
	}

	private _handleIncomingWebSocketData(ev: MessageEvent) {
		this._handleIncomingData(JSON.parse(ev.data))
	}

	private _handleIncomingErrorData(err?: unknown) {
		window.logger.warn(`Error in ${this.code}: ${err}`)
	}

	private _handleInternalData(data: InternalData) {
		switch (data.type) {
			case "rejectHost":
				if (this.isHost) {
					window.logger.error(
						"Closing connection due to error: Host connection rejected by existing host."
					)
					this.close()
				}
				break

			case "connection":
				window.logger.info(`${data.content} connected`)
				if (this.isHost && data.content === "host") {
					this._send({ type: "rejectHost", content: null })
				}
				break

			case "disconnection":
				window.logger.info(`${data.content} disconnected`)
				break
		}
	}

	private _openBroadcastChannel() {
		window.logger.debug(`Opening BroadcastChannel to ${this.code}`)

		this.#broadcastChannel = new BroadcastChannel(this.code)
		this.#broadcastChannel.onmessage = (ev: MessageEvent) => {
			this._handleIncomingBroadcastChannelData(ev)
		}
		this.#broadcastChannel.onmessageerror = (ev: MessageEvent) => {
			this._handleIncomingErrorData(ev.data)
		}

		this._onOpen()
	}

	private _closeBroadcastChannel() {
		window.logger.debug("Closing BroadcastChannel")
		this.#broadcastChannel?.close()

		this.isOpen = false
	}

	private _openWebSocket() {
		window.logger.debug(
			`Opening WebSocket to ${this.code} using ${this.#relayServerUrl}`
		)

		this.#webSocket = new WebSocket(
			new URL(this.code, this.#relayServerUrl).toString()
		)
		this.#webSocket.onmessage = (ev: MessageEvent) => {
			this._handleIncomingWebSocketData(ev)
		}
		this.#webSocket.onerror = (ev: Event) => {
			this._handleIncomingErrorData(ev)
		}
		this.#webSocket.onopen = () => {
			this._onOpen()
		}
		this.#webSocket.onclose = () => {
			this.isOpen = false
		}
	}

	private _closeWebSocket() {
		window.logger.debug("Closing WebSocket")
		this.#webSocket?.close()
	}

	private _sendOnBroadcastChannel(data: ConnectionData) {
		if (this.#broadcastChannel) {
			window.logger.debug("Sending over BroadcastChannel")
			this.#broadcastChannel.postMessage(data)
		}
	}

	private _sendOnWebSocket(data: ConnectionData) {
		if (this.#webSocket) {
			window.logger.debug("Sending over WebSocket")
			this.#webSocket.send(JSON.stringify(data))
		}
	}
}

export default new Connection(new URL("wss://qna.janm.ml/ws/"))

interface DataNew {
	type: "new"
	content: QuestionInfo
}

interface DataVote {
	type: "vote"
	content: { id: ID; voteAmount: number }
}

interface DataRemoved {
	type: "removed"
	content: { id: ID }
}

interface DataSync {
	type: "sync"
	content: QuestionInfo[]
}

interface DataSyncRequest {
	type: "requestSync"
	content: null
}

interface DataConnection {
	type: "connection"
	content: "client" | "host"
}

interface DataDisconnection {
	type: "disconnection"
	content: "client" | "host"
}

interface DataRejectHostConnection {
	type: "rejectHost"
	content: null
}

export const dataTypes = ["new", "vote", "removed", "sync", "requestSync"]
export const internalDataTypes = ["connection", "disconnection", "rejectHost"]
export const connectionDataTypes = [...dataTypes, ...internalDataTypes]

export type Data = DataNew | DataVote | DataRemoved | DataSync | DataSyncRequest
export type InternalData =
	| DataConnection
	| DataDisconnection
	| DataRejectHostConnection
export type ConnectionData = Data | InternalData
