import type { AxiosInstance } from 'axios'
import type { Settings } from '../settings'
import type { LanguagesMap } from './language'
import { formatError } from '../utils'

// Language names for better prompting
const languageNames: Record<string, string> = {
  en: 'English',
  zh: 'Chinese',
  zh_hant: 'Traditional Chinese',
  ja: 'Japanese',
  ko: 'Korean',
  fr: 'French',
  de: 'German',
  es: 'Spanish',
  ru: 'Russian',
  it: 'Italian',
  pt: 'Portuguese',
  pt_pt: 'European Portuguese',
  pt_br: 'Brazilian Portuguese',
  ar: 'Arabic',
  hi: 'Hindi',
  tr: 'Turkish',
  nl: 'Dutch',
  pl: 'Polish',
  sv: 'Swedish',
  da: 'Danish',
  fi: 'Finnish',
  no: 'Norwegian',
  cs: 'Czech',
  hu: 'Hungarian',
  ro: 'Romanian',
  th: 'Thai',
  vi: 'Vietnamese',
  id: 'Indonesian',
  ms: 'Malay',
  he: 'Hebrew',
  uk: 'Ukrainian',
  el: 'Greek',
  bg: 'Bulgarian',
  sk: 'Slovak',
  sl: 'Slovenian',
  hr: 'Croatian',
  sr: 'Serbian',
  lt: 'Lithuanian',
  lv: 'Latvian',
  et: 'Estonian',
}

export async function translate(
  text: string,
  from: string,
  to: string,
  axiosInstance: AxiosInstance,
  _options: Settings,
): Promise<string> {
  const apiKey = _options.openAI.apiKey
  const baseUrl = _options.openAI.baseUrl || 'https://api.openai.com/v1'
  const model = _options.openAI.model || 'gpt-4o-mini'

  if (!apiKey) {
    return 'Error: OpenAI API key not configured'
  }

  try {
    const url = baseUrl.endsWith('/')
      ? `${baseUrl}chat/completions`
      : `${baseUrl}/chat/completions`

    const fromLang = from === 'auto' ? 'the source language' : languageNames[from] || from
    const toLang = languageNames[to] || to

    const prompt = from === 'auto'
      ? `Translate the following text to ${toLang}. Only provide the translation, no explanations:\n\n${text}`
      : `Translate the following text from ${fromLang} to ${toLang}. Only provide the translation, no explanations:\n\n${text}`

    const response = await axiosInstance.post(
      url,
      {
        model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      },
    )

    const result = response.data?.choices?.[0]?.message?.content
    if (!result) {
      return 'Error: Invalid response from OpenAI'
    }

    return result.trim()
  }
  catch (error) {
    return formatError(error)
  }
}

// OpenAI supports most common languages, this is a comprehensive list
export const languagesMap: LanguagesMap = {
  auto: 'auto',
  af: 'af',
  sq: 'sq',
  am: 'am',
  ar: 'ar',
  hy: 'hy',
  az: 'az',
  bn: 'bn',
  bs: 'bs',
  bg: 'bg',
  ca: 'ca',
  zh: 'zh',
  zh_hant: 'zh_hant',
  hr: 'hr',
  cs: 'cs',
  da: 'da',
  nl: 'nl',
  en: 'en',
  et: 'et',
  fi: 'fi',
  fr: 'fr',
  ka: 'ka',
  de: 'de',
  el: 'el',
  gu: 'gu',
  ht: 'ht',
  he: 'he',
  hi: 'hi',
  hu: 'hu',
  is: 'is',
  id: 'id',
  ga: 'ga',
  it: 'it',
  ja: 'ja',
  kn: 'kn',
  kk: 'kk',
  km: 'km',
  ko: 'ko',
  ku: 'ku',
  ky: 'ky',
  lo: 'lo',
  lv: 'lv',
  lt: 'lt',
  mk: 'mk',
  ms: 'ms',
  ml: 'ml',
  mt: 'mt',
  mi: 'mi',
  mr: 'mr',
  mn_cy: 'mn',
  mn_mo: 'mn',
  my: 'my',
  ne: 'ne',
  nb: 'nb',
  nb_no: 'no',
  nn_no: 'no',
  ps: 'ps',
  fa: 'fa',
  pl: 'pl',
  pt: 'pt',
  pt_pt: 'pt',
  pt_br: 'pt',
  pa: 'pa',
  ro: 'ro',
  ru: 'ru',
  'sr-Cyrl': 'sr-Cyrl',
  'sr-Latn': 'sr-Latn',
  si: 'si',
  sk: 'sk',
  sl: 'sl',
  so: 'so',
  es: 'es',
  sv: 'sv',
  ta: 'ta',
  te: 'te',
  th: 'th',
  tr: 'tr',
  uk: 'uk',
  ur: 'ur',
  uz: 'uz',
  vi: 'vi',
  cy: 'cy',
  yo: 'yo',
  zu: 'zu',
}
