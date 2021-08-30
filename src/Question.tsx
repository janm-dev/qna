import translate from "./translations"
import { ID } from "./index"
import { ReactComponent as UpIcon } from "./icons/up.svg"
import { ReactComponent as RemoveIcon } from "./icons/remove.svg"
import { ReactComponent as DownIcon } from "./icons/down.svg"
import styles from "./Question.module.scss"
import shared from "./shared.module.scss"

export const Question = (props: QuestionInfo & QuestionCallbacks) => {
	const t = translate.use().Question

	return (
		<div className={styles.question}>
			<b className={styles.author}>{props.author || t.anonymous}</b>
			<code className={styles.score}>{props.score}</code>

			<button
				className={shared.iconbutton}
				title={t.up}
				onClick={() => {
					props.upCallback(props.id)
				}}
			>
				<UpIcon
					className={`${styles.up} ${shared.iconbuttonimg} ${shared.svgicon}`}
				/>
			</button>
			<button
				className={shared.iconbutton}
				title={t.remove}
				onClick={() => {
					props.removeCallback(props.id)
				}}
			>
				<RemoveIcon
					className={`${styles.remove} ${shared.iconbuttonimg} ${shared.svgicon}`}
				/>
			</button>
			<button
				className={shared.iconbutton}
				title={t.down}
				onClick={() => {
					props.downCallback(props.id)
				}}
			>
				<DownIcon
					className={`${styles.down} ${shared.iconbuttonimg} ${shared.svgicon}`}
				/>
			</button>

			<p className={styles.text}>{props.text}</p>
		</div>
	)
}

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
