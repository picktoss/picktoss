import React from 'react'
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router'

import {
  AccountInfoPage,
  AccountPage,
  ContactPage,
  DailyQuizAttendancePage,
  FaQPage,
  NoticePage,
  NotificationConfigPage,
  PaymentHistoryPage,
  PolicyPage,
  QuizAnalysisPage,
  QuizRecordDailyDetailPage,
  QuizRecordPage,
  QuizRecordSetDetailPage,
  WithdrawPage,
} from '@/pages/account'
import { FeedbackCompletePage } from '@/pages/account/feedback-complete-page'
import FeedbackPage from '@/pages/account/feedback-page'
import LanguagePage from '@/pages/account/language-page'
import MyStarPage from '@/pages/account/my-star-page'
import StarHistoryPage from '@/pages/account/star-history-page'
import { LoginPage } from '@/pages/auth'
import { ExploreComplainPage, ExplorePage, ExploreSearchPage } from '@/pages/explore'
import ExploreReleasePage from '@/pages/explore/explore-release-page'
import HomePage from '@/pages/home-page'
import { InstallGuidePage } from '@/pages/install-guide-page'
import InviteLoginPage from '@/pages/invite/invite-login-page'
import InvitePage from '@/pages/invite/invite-page'
import { LibraryPage } from '@/pages/library'
import { NoteCreatePage } from '@/pages/note-create'
import { ProgressQuizPage } from '@/pages/progress-quiz-page'
import QuizDetailEditPage from '@/pages/quiz-detail/quiz-detail-edit-page'
import QuizDetailListPage from '@/pages/quiz-detail/quiz-detail-list-page'
import QuizDetailPage from '@/pages/quiz-detail/quiz-detail-page'
import SearchPage from '@/pages/search-page'

import { AuthLayout } from '@/app/layout/auth-layout'
import { RewardLayout } from '@/app/layout/reward-layout'
import { RootLayout } from '@/app/layout/root-layout'
import NetworkErrorFallback from '@/app/network-error'
import NotFound from '@/app/not-found'

import { RoutePath } from '@/shared/lib/router'
import { SUPPORTED_LANGUAGE, SUPPORTED_LANGUAGE_VALUE, i18n } from '@/shared/locales/i18n'

const detectPreferredLanguage = (): SUPPORTED_LANGUAGE_VALUE => {
  if (typeof navigator === 'undefined') return SUPPORTED_LANGUAGE.EN
  const browserLanguage = navigator.language || navigator.languages?.[0] || SUPPORTED_LANGUAGE.EN
  if (browserLanguage.toLowerCase().startsWith('ko')) return SUPPORTED_LANGUAGE.KO
  return SUPPORTED_LANGUAGE.EN
}

const detectLocaleBase = (): string | undefined => {
  if (typeof window === 'undefined') {
    return undefined
  }
  const [, maybeLocale] = window.location.pathname.split('/')
  if (maybeLocale === 'ko' || maybeLocale === 'en') {
    return `/${maybeLocale}`
  }
  return undefined
}

const LocaleSync = () => {
  const location = useLocation()
  const [, firstSegment] = location.pathname.toLowerCase().split('/')
  const targetLocale =
    firstSegment === 'ko' ? SUPPORTED_LANGUAGE.KO : firstSegment === 'en' ? SUPPORTED_LANGUAGE.EN : undefined

  React.useEffect(() => {
    if (targetLocale && i18n.language !== targetLocale) {
      i18n.changeLanguage(targetLocale)
    }
  }, [targetLocale])

  return null
}

const LocaleRedirect = ({ basename }: { basename?: string }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [, firstSegment] = location.pathname.split('/')

  React.useEffect(() => {
    // 이미 베이스가 지정되어 있으면(= URL에 언어 접두사가 포함됨) 아무 것도 하지 않음
    if (basename) return

    if (firstSegment === 'ko' || firstSegment === 'en') return

    const currentPath = window.location.pathname
    const trimmedPath = currentPath.replace(/^\/[^/]+/, '')
    // 루트 진입 시에는 /explore로 유도
    const normalizedPath = trimmedPath === '' || trimmedPath === '/' ? '/explore' : trimmedPath
    const targetLang = detectPreferredLanguage()
    const target = `/${targetLang}${normalizedPath}${location.search}${location.hash}`

    // 히스토리를 깔끔하게 유지하고, 베이스를 제대로 인식시키기 위해 전체 리로드
    window.location.replace(target)
  }, [basename, firstSegment, location.hash, location.pathname, location.search, navigate])

  return null
}

export const AppRouter = () => {
  const basename = detectLocaleBase()

  return (
    <BrowserRouter basename={basename}>
      <LocaleRedirect basename={basename} />
      <LocaleSync />
      <Routes>
        <Route element={<RootLayout />}>
          <Route element={<RewardLayout />}>
            <Route element={<AuthLayout />}>
              {/* Home */}
              <Route path={RoutePath.root} element={<HomePage />} />
              <Route path={RoutePath.search} element={<SearchPage />} />

              {/* Note Create 노트 생성 */}
              <Route path={RoutePath.noteCreate} element={<NoteCreatePage />} />

              {/* Library */}
              <Route path={RoutePath.library}>
                <Route index element={<LibraryPage />} />
              </Route>

              {/* Account */}
              <Route path={RoutePath.account}>
                <Route index element={<AccountPage />} />
                <Route path={RoutePath.accountInfo} element={<AccountInfoPage />} />
                <Route path={RoutePath.accountLanguage} element={<LanguagePage />} />
                <Route path={RoutePath.accountDailyQuizAttendance} element={<DailyQuizAttendancePage />} />
                <Route path={RoutePath.accountQuizAnalysis} element={<QuizAnalysisPage />} />
                <Route path={RoutePath.accountQuizRecord} element={<QuizRecordPage />} />
                <Route path={RoutePath.accountQuizRecordDailyDetail} element={<QuizRecordDailyDetailPage />} />
                <Route path={RoutePath.accountQuizRecordSetDetail} element={<QuizRecordSetDetailPage />} />
                <Route path={RoutePath.accountNotificationConfig} element={<NotificationConfigPage />} />
                <Route path={RoutePath.accountMyStar} element={<MyStarPage />} />
                <Route path={RoutePath.accountStarHistory} element={<StarHistoryPage />} />
                <Route path={RoutePath.accountPaymentHistory} element={<PaymentHistoryPage />} />
                <Route path={RoutePath.accountNotice} element={<NoticePage />} />
                <Route path={RoutePath.accountContact} element={<ContactPage />} />
                <Route path={RoutePath.accountFaq} element={<FaQPage />} />
                <Route path={RoutePath.accountPolicy} element={<PolicyPage />} />
                <Route path={RoutePath.accountWithdraw} element={<WithdrawPage />} />
                <Route path={RoutePath.accountFeedback} element={<FeedbackPage />} />
                <Route path={RoutePath.accountFeedbackComplete} element={<FeedbackCompletePage />} />
              </Route>
            </Route>

            {/* Theme Quiz */}
            <Route>
              <Route path={RoutePath.progressQuiz} element={<ProgressQuizPage />} />
            </Route>

            {/* Explore */}
            <Route path={RoutePath.explore}>
              <Route index element={<ExplorePage />} />
              <Route path={RoutePath.exploreSearch} element={<ExploreSearchPage />} />

              <Route element={<AuthLayout />}>
                <Route path={RoutePath.exploreComplain} element={<ExploreComplainPage />} />
                <Route path={RoutePath.exploreRelease} element={<ExploreReleasePage />} />
              </Route>
            </Route>

            <Route path={RoutePath.quizDetail} element={<QuizDetailPage />} />
            <Route path={RoutePath.quizDetailEdit} element={<QuizDetailEditPage />} />
            <Route path={RoutePath.quizDetailList} element={<QuizDetailListPage />} />

            {/* Invite */}
            <Route path={RoutePath.invite} element={<InvitePage />} />
            <Route path={RoutePath.inviteLogin} element={<InviteLoginPage />} />

            {/* Install Induce */}
            <Route path={RoutePath.installGuide} element={<InstallGuidePage />} />

            {/* Auth */}
            <Route path={RoutePath.login} element={<LoginPage />} />
          </Route>
        </Route>

        <Route path="/ads.txt" />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

        {/* network-error */}
        <Route path="/network-error" element={<NetworkErrorFallback />} />
      </Routes>
    </BrowserRouter>
  )
}
