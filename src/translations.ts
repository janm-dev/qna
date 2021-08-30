import { createTranslations } from "react-ridge-translations"
import en from "./translations/en.json"

export const languages = { en: "english" }
const translations = { en }

export const fallback = "en"
export type Language = keyof typeof translations

type TranslationLanguages = {
	[language in Language]: string
}

type Translations = {
	[component: string]: {
		[text: string]: TranslationLanguages
	}
}

const mappedTranslations: Translations = {}

// Map from { language: { component: { text: "" } } }
// to { component: { text: { language: "" } } }
for (const _language in translations) {
	const language = _language as keyof typeof translations

	// Get the components in the current language
	const components = translations[language]

	for (const _component in components) {
		const component = _component as keyof typeof components

		// Default to empty component (will be populated later)
		if (!mappedTranslations[component]) {
			mappedTranslations[component] = {}
		}

		// Get all translated texts as an array of [text, ""]
		const texts = Object.entries(components[component])

		for (const text of texts) {
			// Set mapped text to {} initially
			if (!mappedTranslations[component][text[0]]) {
				mappedTranslations[component][text[0]] =
					{} as TranslationLanguages
			}

			// Set the translated text in the form of { text: { language: "" } }
			mappedTranslations[component][text[0]][language] = text[1]
		}
	}
}

window.logger.info(`Loaded translations: ${JSON.stringify(mappedTranslations)}`)

const translate = createTranslations<TranslationLanguages>()(
	mappedTranslations,
	{
		language: "en",
		fallback
	}
)

export default translate
