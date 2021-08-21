import connection, { Data, DataTransport } from "./connection"
import { QuestionQueue } from "./QuestionQueue"
import { QuestionForm } from "./QuestionForm"
import { useEffect, useState } from "react"
import { QuestionInfo } from "./Question"
import "./Client.scss"

const Client = ({
	code,
	dataTransport,
	formEnabled,
	setFormEnabled,
	isHost = false
}: {
	code: string
	dataTransport: DataTransport
	formEnabled: boolean
	setFormEnabled: (formEnabled: boolean) => unknown
	isHost?: boolean
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
		<main>
			{formEnabled ? null : <QuestionForm />}
			<QuestionQueue questions={questions} isHost={isHost} />
		</main>
	)
}

export default Client
