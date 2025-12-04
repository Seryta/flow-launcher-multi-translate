import type { LanguageCode } from './service/language'

export interface Settings {
  services: string[]
  requestTimeout: number
  translateDelay: number
  proxyUrl: string
  sourceLanguageCode: LanguageCode
  targetLanguageCode: LanguageCode
  languagePairs: string[]
  triggerKeyword: string
  interfaceLanguage: 'en' | 'tr' | 'zh'
  deepL: {
    key: string
  }
  deepLX: {
    url: string
  }
  mTranServer: {
    url: string
    token: string
  }
  openAI: {
    baseUrl: string
    apiKey: string
    model: string
  }
}

export function parseSettings(settings: Record<string, string>): Settings {
  const services = (settings.services as string).split('\n').map(i => i.trim().toLowerCase()).filter(i => i)
  let requestTimeout = Number.parseInt(settings.requestTimeout, 10)
  if (Number.isNaN(requestTimeout))
    requestTimeout = 3000
  let translateDelay = Number.parseInt(settings.translateDelay, 10)
  if (Number.isNaN(translateDelay))
    translateDelay = 700
  const proxyUrl = settings.proxyUrl || ''
  const sourceLanguageCode = settings.sourceLanguageCode as LanguageCode || 'auto'
  const targetLanguageCode = settings.targetLanguageCode as LanguageCode || 'zh'
  const languagePairs = (settings.languagePairs || '').split('\n').map(i => i.trim()).filter(i => i)
  const triggerKeyword = settings.triggerKeyword || 'tr'
  const interfaceLanguage = settings.interfaceLanguage === 'English'
    ? 'en'
    : settings.interfaceLanguage === 'Türkçe' ? 'tr' : 'zh'

  const serviceConfigs: Record<string, string> = {}
  const serviceConfigsStr = settings.serviceConfigs || ''
  serviceConfigsStr
    .split('\n')
    .map(i => i.trim())
    .filter(i => i)
    .forEach((i) => {
      const eqIndex = i.indexOf('=')
      if (eqIndex === -1) {
        return null
      }
      const key = i.slice(0, eqIndex).trim().toUpperCase()
      const value = i.slice(eqIndex + 1).trim()
      serviceConfigs[key] = value
    })
  const deepL = {
    key: serviceConfigs.DEEPL_KEY || '',
  }
  const deepLX = {
    url: serviceConfigs.DEEPLX_URL || '',
  }
  const mTranServer = {
    url: serviceConfigs.MTRANSERVER_URL || '',
    token: serviceConfigs.MTRANSERVER_TOKEN || '',
  }
  const openAI = {
    baseUrl: serviceConfigs.OPENAI_BASE_URL || 'https://api.openai.com/v1',
    apiKey: serviceConfigs.OPENAI_API_KEY || '',
    model: serviceConfigs.OPENAI_MODEL || 'gpt-4o-mini',
  }

  return {
    services,
    requestTimeout,
    translateDelay,
    proxyUrl,
    sourceLanguageCode,
    targetLanguageCode,
    languagePairs,
    triggerKeyword,
    interfaceLanguage,
    deepL,
    deepLX,
    mTranServer,
    openAI,
  }
}
