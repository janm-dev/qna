import { ID } from "./index"
import "./Question.scss"

export const Question = (props: QuestionInfo & QuestionCallbacks) => (
	<div className="question">
		<b className="author">{props.author || "Anonymous"}</b>
		<code className="score">{props.score}</code>

		<button
			onClick={() => {
				props.upCallback(props.id)
			}}
		>
			<img alt="up" src="/up.svg" className="up" />
		</button>
		<button
			onClick={() => {
				props.removeCallback(props.id)
			}}
		>
			<img alt="remove" src="/remove.svg" className="remove" />
		</button>
		<button
			onClick={() => {
				props.downCallback(props.id)
			}}
		>
			<img alt="down" src="/down.svg" className="down" />
		</button>

		<p className="text">{props.text}</p>
	</div>
)

export interface QuestionInfo {
	id: ID
	score: number
	author?: string
	text: string
}

export interface QuestionCallbacks {
	upCallback: (id: ID) => unknown
	downCallback: (id: ID) => unknown
	removeCallback: (id: ID) => unknown
}
