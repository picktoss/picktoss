import { useTranslation as useI18nTranslation } from 'react-i18next'

import { SUPPORTED_LANGUAGE_VALUE } from '@/shared/locales/i18n'
import { LANGUAGE } from '@/shared/locales/language'

export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation()

  const changeLanguage = (lng: SUPPORTED_LANGUAGE_VALUE) => {
    if (i18n && typeof i18n.changeLanguage === 'function') {
      i18n.changeLanguage(lng)
      // 로컬 스토리지에 언어 설정 저장
      // localStorage.setItem('i18nextLng', lng)
    } else {
      console.warn('i18n is not properly initialized')
    }
  }

  const currentLanguage = (i18n?.language as SUPPORTED_LANGUAGE_VALUE) || LANGUAGE.KOREAN.key

  return {
    t,
    changeLanguage,
    currentLanguage,
    i18n,
  }
}
