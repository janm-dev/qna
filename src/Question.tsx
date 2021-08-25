import { ID } from "./index"
import styles from "./Question.module.scss"

export const Question = (props: QuestionInfo & QuestionCallbacks) => (
	<div className={styles.question}>
		<b className={styles.author}>{props.author || "Anonymous"}</b>
		<code className={styles.score}>{props.score}</code>

		<button
			className={styles.button}
			onClick={() => {
				props.upCallback(props.id)
			}}
		>
			<img
				alt="up"
				src="/up.svg"
				className={`${styles.up} ${styles.buttonimg}`}
			/>
		</button>
		<button
			className={styles.button}
			onClick={() => {
				props.removeCallback(props.id)
			}}
		>
			<img
				alt="remove"
				src="/remove.svg"
				className={`${styles.remove} ${styles.buttonimg}`}
			/>
		</button>
		<button
			className={styles.button}
			onClick={() => {
				props.downCallback(props.id)
			}}
		>
			<img
				alt="down"
				src="/down.svg"
				className={`${styles.down} ${styles.buttonimg}`}
			/>
		</button>

		<p className={styles.text}>{props.text}</p>
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
