import connection, { Data, DataTransport } from "./connection"
import { QuestionQueue } from "./QuestionQueue"
import { QuestionForm } from "./QuestionForm"
import { useEffect, useState } from "react"
import { QuestionInfo } from "./Question"
import { Controls } from "./Controls"
import styles from "./Client.module.scss"

const Client = ({
	isHost = false,
	code,
	dataTransport,
	headerEnabled,
	setHeaderEnabled,
	toggleTheme,
	formEnabled,
	setFormEnabled,
	toggleDebugEnabled
}: {
	isHost?: boolean
	code: string
	dataTransport: DataTransport
	headerEnabled: boolean
	setHeaderEnabled: (newHeaderEnabled: boolean) => unknown
	toggleTheme: () => unknown
	formEnabled: boolean
	setFormEnabled: (newHeaderEnabled: boolean) => unknown
	toggleDebugEnabled: () => unknown
}) => {
	const [questions, setQuestions] = useState([] as QuestionInfo[])

	useEffect(() => {
		setFormEnabled(!isHost)
	}, [setFormEnabled, isHost])

	useEffect(() => {
		connection.open(code, dataTransport, isHost)

		return () => {
			connection.close()
		}
	}, [code, dataTransport, isHost])

	useEffect(() => {
		const handler = (data: Data) => {
			switch (data.type) {
				case "new":
					setQuestions([...questions, data.content])
					break

				case "removed":
					setQuestions([
						...questions.filter(
							(question) => question.id !== data.content.id
						)
					])
					break

				case "vote":
					const votedQuestion = questions.find(
						(question) => question.id === data.content.id
					)

					if (!votedQuestion) {
						break
					}

					setQuestions([
						...questions.filter(
							(question) => question !== votedQuestion
						),
						{
							...votedQuestion,
							score: votedQuestion.score + data.content.voteAmount
						}
					])
					break

				case "sync":
					if (!isHost) {
						setQuestions(data.content)
					}
					break

				case "requestSync":
					if (isHost) {
						connection.send({
							type: "sync",
							content: questions
						})
					}
					break
			}
		}

		connection.on("data", handler)

		return () => {
			connection.off("data", handler)
		}
	}, [questions, code, dataTransport, isHost])

	return (
		<main className={styles.main}>
			<Controls
				questionRelated
				isHost={isHost}
				questions={questions}
				headerEnabled={headerEnabled}
				setHeaderEnabled={setHeaderEnabled}
				toggleTheme={toggleTheme}
				formEnabled={formEnabled}
				setFormEnabled={setFormEnabled}
				toggleDebugEnabled={toggleDebugEnabled}
			/>
			{formEnabled ? null : <QuestionForm />}
			<QuestionQueue questions={questions} isHost={isHost} />
		</main>
	)
}

export default Client
