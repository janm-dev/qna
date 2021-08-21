import connection from "./connection"
import { useState } from "react"
import { nanoid } from "nanoid"
import "./QuestionForm.scss"

export const QuestionForm = () => {
	const [author, setAuthor] = useState("")
	const [text, setText] = useState("")
	const [score, _setScore] = useState(0)

	const setScore = (newScore: string) => {
		newScore = newScore.trim().toUpperCase()

		if (newScore.match(/^-?[\d]{1,2}$/giu)) {
			_setScore(parseInt(newScore))
		}
	}

	const clear = () => {
		setAuthor("")
		setText("")
		_setScore(0)
	}

	const send = () => {
		connection.send({
			type: "new",
			content: { id: nanoid(), author, text, score }
		})

		clear()
	}

	return (
		<div className="form">
			<input
				type="text"
				className="author"
				placeholder="Author"
				maxLength={10}
				width={12}
				value={author}
				onChange={(ev) => {
					setAuthor(ev.target.value)
				}}
			/>
			<input
				type="number"
				className="score"
				aria-label="initial score"
				value={score}
				onChange={(ev) => {
					setScore(ev.target.value)
				}}
			/>

			<button onClick={clear}>
				<img alt="clear" src="/clear.svg" className="clear" />
			</button>
			<button onClick={send}>
				<img alt="send" src="/send.svg" className="send" />
			</button>

			<textarea
				className="text"
				placeholder="Lorem ipsum dolor sit amet, ..."
				cols={80}
				rows={5}
				value={text}
				onChange={(ev) => {
					setText(ev.target.value)
				}}
			/>
		</div>
	)
}
