import { Question, QuestionInfo } from "./Question"
import connection from "./connection"
import { useEffect } from "react"
import { ID } from "./index"
import styles from "./QuestionQueue.module.scss"

export const QuestionQueue = ({
	questions,
	isHost = false
}: {
	questions: QuestionInfo[]
	isHost?: boolean
}) => {
	const sendSync = () => {
		connection.send({ type: "sync", content: questions })
	}

	const sendSyncRequest = () => {
		connection.send({ type: "requestSync", content: null })
	}

	useEffect(() => {
		// Keyboard shortcut handler
		const controller = new AbortController()

		const listener = (ev: KeyboardEvent) => {
			if (ev.key === "s" && ev.altKey) {
				if (isHost) {
					sendSync()
				}

				ev.preventDefault()
			} else if (ev.key === "r" && ev.altKey) {
				if (!isHost) {
					sendSyncRequest()
				}

				ev.preventDefault()
			}
		}

		document.addEventListener("keydown", listener, {
			signal: controller.signal
		} as unknown as AddEventListenerOptions)

		return () => {
			controller.abort()
		}
	})

	const upCallback = (id: ID) => {
		connection.send({ type: "vote", content: { id, voteAmount: 1 } })
	}

	const downCallback = (id: ID) => {
		connection.send({
			type: "vote",
			content: { id, voteAmount: -1 }
		})
	}

	const removeCallback = (id: ID) => {
		connection.send({ type: "removed", content: { id } })
	}

	return (
		<div className={styles.queue}>
			{
				// Display the questions in decending order of points
				questions
					.sort(
						(a: QuestionInfo, b: QuestionInfo) => b.score - a.score
					)
					.map((question) => (
						<Question
							{...question}
							key={question.id}
							upCallback={upCallback}
							downCallback={downCallback}
							removeCallback={removeCallback}
						/>
					))
			}
		</div>
	)
}
