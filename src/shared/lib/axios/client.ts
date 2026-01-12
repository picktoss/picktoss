import axios from 'axios'

import { useAuthStore } from '@/features/auth/model/auth-store'
import { i18n, SUPPORTED_LANGUAGE } from '@/shared/locales/i18n'

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

client.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (timezone) {
      config.headers = config.headers ?? {}
      config.headers['X-Timezone'] = timezone
    }
    const language = (i18n.resolvedLanguage || i18n.language || '').toLowerCase()
    const normalizedLanguage = language.startsWith(SUPPORTED_LANGUAGE.KO)
      ? SUPPORTED_LANGUAGE.KO
      : language.startsWith(SUPPORTED_LANGUAGE.EN)
        ? SUPPORTED_LANGUAGE.EN
        : null
    if (normalizedLanguage) {
      config.headers = config.headers ?? {}
      config.headers['X-Locale'] = normalizedLanguage
    }
    return config
  },
  (error) => Promise.reject(error),
)

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      useAuthStore.getState().clearToken()
    }
    return Promise.reject(error.response)
  },
)
