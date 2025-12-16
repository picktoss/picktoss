import { SUPPORTED_LANGUAGE, SUPPORTED_LANGUAGE_VALUE } from '@/shared/locales/i18n'

export interface LanguageObject {
  key: SUPPORTED_LANGUAGE_VALUE
  label: string
}

export const LANGUAGE = {
  KOREAN: {
    key: SUPPORTED_LANGUAGE.KO,
    label: '한국어',
  },
  ENGLISH: {
    key: SUPPORTED_LANGUAGE.EN,
    label: 'English',
  },
} satisfies Record<string, LanguageObject>
