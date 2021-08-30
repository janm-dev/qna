# How to add a translation

0. Use the [2-letter code](https://en.wikipedia.org/wiki/ISO_639-1) code for [YOUR LANGUAGE].
1. Create the file with the name `[YOUR LANGUAGE].json` in this directory. You should use `en.json` as a template.
2. Modify `translations.ts` with [YOUR LANGUAGE]. See below for details.
3. Translate all of the values into [YOUR LANGUAGE]. For example `"Home": { "code": "Code:", "type": "Type:", ...}` would become `"Home": { "code": "[TRANSLATION]", "type": "[TRANSLATION]", ...}`.
4. If for some reason you can't translate something, delete it entirely. This means `"Home": { "code": "Code:", "type": "Type:", ...}` without a translation for `code` would become `"Home": { "type": "[TRANSLATION]", ...}`. That way the english version will be used instead. If you want to leave the text blank instead, set the translation to an empty string (`""`).
5. Check if the translations work and look good by running the site locally in [YOUR LANGUAGE].

## `translations.ts`

For the translation to be loaded, it must be included in `translations.ts`. Using the same [2-letter code](https://en.wikipedia.org/wiki/ISO_639-1) for [YOUR LANGUAGE] as above, modify `translations.ts`:

```ts
import en from "./translations/en.json"
// ... other languages
import [YOUR LANGUAGE] from "./translations/[YOUR LANGUAGE].json"

export const languages = { en: "english", /* other languages */, '[YOUR LANGUAGE]': '[the name of your language in your language]' }
const translations = { en, /* other languages */ , '[YOUR LANGUAGE]' }
```
