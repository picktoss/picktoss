import { PropsWithChildren, createContext, useContext, useEffect, useMemo } from 'react'

import { init, track } from '@amplitude/analytics-browser'

/**
 * Amplitude API Key
 */
const AMPLITUDE_API_KEY = import.meta.env.VITE_AMPLITUDE_API_KEY || ''

/* -------------------------------------------------------------------------- */
/*                           [이벤트별 Props 정의]                             */
/* -------------------------------------------------------------------------- */

// 로그인/가입
/** [로그인/가입] onboard_complete_click - 완료 버튼 클릭 */
export interface OnboardCompleteClickProps {
  category: '자격증·수험' | '학문·전공' | 'IT·개발' | '재테크·시사' | '언어' | '상식·교양'
}

// GNB
/** [GNB] explore_click - 탐험 메뉴 클릭 */
export interface ExploreClickProps {}

/** [GNB] library_click - 도서관 메뉴 클릭 */
export interface LibraryClickProps {}

/** [GNB] daily_click - 데일리 메뉴 클릭 */
export interface DailyClickProps {}

// 데일리 이벤트
/** [데일리] daily_star_click - 헤더 별 아이콘 클릭 */
export interface DailyStarClickProps {}

/** [데일리] daily_complete_click - 10문제 완료 리워드 drawer에서 '확인' 버튼 클릭 */
export interface DailyCompleteClickProps {}

/** [데일리] daily_setting_type_click - 퀴즈 설정 drawer 문제 유형 영역 내 옵션 클릭 */
export interface DailySettingTypeClickProps {
  type: '전체' | '객관식' | 'O/X'
}

/** [데일리] daily_setting_range_click - 퀴즈 설정 drawer 문제 범위 영역 내 옵션 클릭 */
export interface DailySettingRangeClickProps {
  range: '전체' | '내 퀴즈' | '북마크'
}

/** [데일리] daily_setting_save_click - 퀴즈 설정 drawer에서 '저장'버튼 클릭 */
export interface DailySettingSaveClickProps {
  type: '전체' | '객관식' | 'O/X'
  range: '전체' | '내가 만든 퀴즈만' | '북마크한 퀴즈만'
}

// 도서관 이벤트
/** [도서관] library_item_click - 내 퀴즈 목록에 있는 아이템 클릭 */
export interface LibraryItemClickProps {
  location: '내 퀴즈 탭' | '북마크 탭'
}

/** [도서관] library_quiz_edit_click - 노트 상세-퀴즈 수정 버튼 클릭 */
export interface LibraryQuizEditClickProps {}

/** [도서관] library_share_click - 노트 상세 공유하기 버튼 클릭 */
export interface LibraryShareClickProps {}

/** [도서관] library_detail_p_click - 노트 상세 툴바- 플레이 버튼 클릭 */
export interface LibraryDetailPClickProps {}

/** [도서관] library_detail_review_click - 노트 상세 툴바- 복습 pick 버튼 클릭 */
export interface LibraryDetailReviewClickProps {}

/** [도서관] library_detail_note_click - 노트 상세 툴바- 원본 노트 버튼 클릭 */
export interface LibraryDetailNoteClickProps {}

/** [도서관] library_detail_download_click - 노트 상세 툴바- PDF 다운로드 버튼 클릭 */
export interface LibraryDetailDownloadClickProps {}

/** [도서관] library_detail_delete_click - 노트 상세 툴바- 삭제 버튼 클릭 */
export interface LibraryDetailDeleteClickProps {}

/** [도서관] library_detail_more_click - 노트 상세 툴바- 더보기 버튼 클릭 */
export interface LibraryDetailMoreClickProps {}

/** [도서관] library_detail_answer_click - 노트 상세 툴바- 정답 표시 스위치 클릭 */
export interface LibraryDetailAnswerClickProps {
  value: boolean
}

/** [탐험] explore_category_click - 분야 tab 클릭 */
export interface ExploreCategoryClickProps {
  category: '전체' | '자격증·수험' | '학문·전공' | 'IT·개발' | '재테크·시사' | '언어' | '상식·교양'
}

/** [탐험] explore_bookmark_click - 북마크 버튼 클릭 */
export interface ExploreBookmarkClickProps {
  location: '미리보기 페이지' | '상세 페이지'
  state: '추가' | '해제'
}

/** [탐험] explore_share_click - 공유 버튼 클릭 */
export interface ExploreShareClickProps {
  location: '미리보기 페이지' | '상세 페이지'
}

/** [탐험] explore_detail_click - 퀴즈 질문 미리보기에서 '전체보기'버튼 클릭 */
export interface ExploreDetailClickProps {}

// 퀴즈 생성 이벤트
/** [퀴즈 생성] generate_quiz_click - 완료' 버튼 클릭 */
export interface GenerateQuizClickProps {
  format: '텍스트' | '파일'
  type: '전체' | '객관식' | 'O/X'
}

/** [퀴즈 생성] generate_quiz_start_click - 퀴즈 로딩 완료 후 '퀴즈 시작' 버튼 클릭 */
export interface GenerateQuizStartClickProps {}

/** [퀴즈 생성] generate_quiz_later_click - 퀴즈 로딩 완료 후 '다음에' 버튼 클릭 */
export interface GenerateQuizLaterClickProps {}

// 퀴즈 이벤트
/** [퀴즈 생성] generate_new_click - 퀴즈 생성 페이지에서 '새 퀴즈 생성' 버튼 클릭 */
export interface GenerateNewClickProps {
  format: '텍스트 버튼' | '파일 버튼'
  location: '데일리 페이지' | '탐험 페이지' | '도서관 페이지'
}

/** [퀴즈] quiz_complete_view - 퀴즈 결과 페이지 조회 */
export interface QuizCompleteViewProps {}

/** [퀴즈] quiz_start_click - 퀴즈 시작 버튼 클릭 */
export interface QuizStartClickProps {
  location: '탐험 메인' | '공개 퀴즈 상세' | '내 퀴즈 상세'
}

/** [퀴즈] quiz_setting_time_click - 퀴즈 설정 drawer 시간 숨기기 switch 클릭 */
export interface QuizSettingTimeClickProps {
  value: boolean
}

/** [퀴즈] quiz_setting_skip_click - 퀴즈 설정 drawer 문제 바로 넘기기 switch 클릭 */
export interface QuizSettingSkipClickProps {
  value: boolean
}

/** [퀴즈] quiz_setting_save_click - 퀴즈 설정 drawer에서 '저장'버튼 클릭 */
export interface QuizSettingSaveClickProps {
  time: boolean
  skip: boolean
}

/** [퀴즈] quiz_exit_click - 퀴즈 나가기' 버튼 클릭 */
export interface QuizExitClickProps {}

/** [퀴즈] quiz_pdf_download - 퀴즈 PDF 다운로드 버튼 클릭 */
export interface QuizPdfDownloadProps {}

// 마이 이벤트
/** [마이] my_analysis_click - 퀴즈 분석 메뉴 클릭 */
export interface MyAnalysisClickProps {}

/** [마이] my_star_click - 나의 별 메뉴 클릭 */
export interface MyStarClickProps {}

/** [마이] my_setting_push_click - 나의 별 메뉴 클릭 */
export interface MySettingPushClickProps {
  value: boolean
}

/** [마이] my_history_click - 퀴즈 기록 메뉴 클릭 */
export interface MyHistoryClickProps {}

// 친구 초대 이벤트
/** [친구 초대] invite_view - 친구 초대하기 시트 조회 */
export interface InviteViewProps {
  location: '마이 페이지' | '나의 별 페이지' | '별 부족 drawer'
}

/** [친구 초대] invite_share_click - 친구 초대하기 시트에서 버튼 클릭 */
export interface InviteShareClickProps {
  method: '복사' | '카카오톡' | '일반 공유'
}

/** [마이] quickmenu_click */
export interface QuickmenuClickProps {
  option: '내 컬렉션' | '퀴즈 분석' | '퀴즈 기록'
}

/** [친구 초대] share_click */
export interface ShareClickProps {
  method: '복사' | '카카오톡' | '일반 공유'
}

/* -------------------------------------------------------------------------- */
/*                            Amplitude 컨텍스트                              */
/* -------------------------------------------------------------------------- */

/**
 * 이벤트 타입 정의
 */
export type EventName =
  // 로그입/가입
  | 'onboard_complete_click'
  // GNB
  | 'explore_click'
  | 'library_click'
  | 'daily_click'
  // 데일리
  | 'daily_star_click'
  | 'daily_complete_click'
  | 'daily_setting_type_click'
  | 'daily_setting_range_click'
  | 'daily_setting_save_click'
  // 도서관
  | 'library_item_click'
  | 'library_quiz_edit_click'
  | 'library_share_click'
  | 'library_detail_p_click'
  | 'library_detail_review_click'
  | 'library_detail_note_click'
  | 'library_detail_download_click'
  | 'library_detail_delete_click'
  | 'library_detail_more_click'
  | 'library_detail_answer_click'
  // 탐험
  | 'explore_category_click'
  | 'explore_bookmark_click'
  | 'explore_share_click'
  | 'explore_detail_click'
  // 퀴즈 생성
  | 'generate_quiz_click'
  | 'generate_quiz_start_click'
  | 'generate_quiz_later_click'
  // 퀴즈
  | 'generate_new_click'
  | 'quiz_complete_view'
  | 'quiz_start_click'
  | 'quiz_setting_time_click'
  | 'quiz_setting_skip_click'
  | 'quiz_setting_save_click'
  | 'quiz_exit_click'
  // 마이
  | 'my_analysis_click'
  | 'my_star_click'
  | 'my_setting_push_click'
  | 'my_history_click'
  // 친구 초대
  | 'invite_view'
  | 'invite_share_click'
  // 퀴즈 시작 및 종료
  | 'quiz_start'
  // 마이 퀴마뉴
  | 'quickmenu_click'
  // 공유
  | 'share_click'

/**
 * 이벤트별 프로퍼티 타입 매핑
 */
export type EventPropsMap = {
  // 로그인/가입
  onboard_complete_click: OnboardCompleteClickProps
  // GNB
  explore_click: ExploreClickProps
  library_click: LibraryClickProps
  daily_click: DailyClickProps
  // 데일리
  daily_star_click: DailyStarClickProps
  daily_complete_click: DailyCompleteClickProps
  daily_setting_type_click: DailySettingTypeClickProps
  daily_setting_range_click: DailySettingRangeClickProps
  daily_setting_save_click: DailySettingSaveClickProps
  // 도서관
  library_item_click: LibraryItemClickProps
  library_quiz_edit_click: LibraryQuizEditClickProps
  library_share_click: LibraryShareClickProps
  library_detail_p_click: LibraryDetailPClickProps
  library_detail_review_click: LibraryDetailReviewClickProps
  library_detail_note_click: LibraryDetailNoteClickProps
  library_detail_download_click: LibraryDetailDownloadClickProps
  library_detail_delete_click: LibraryDetailDeleteClickProps
  library_detail_more_click: LibraryDetailMoreClickProps
  library_detail_answer_click: LibraryDetailAnswerClickProps
  // 탐험
  explore_category_click: ExploreCategoryClickProps
  explore_bookmark_click: ExploreBookmarkClickProps
  explore_share_click: ExploreShareClickProps
  explore_detail_click: ExploreDetailClickProps
  // 퀴즈 생성
  generate_quiz_click: GenerateQuizClickProps
  generate_quiz_start_click: GenerateQuizStartClickProps
  generate_quiz_later_click: GenerateQuizLaterClickProps
  // 퀴즈
  generate_new_click: GenerateNewClickProps
  quiz_complete_view: QuizCompleteViewProps
  quiz_start_click: QuizStartClickProps
  quiz_setting_time_click: QuizSettingTimeClickProps
  quiz_setting_skip_click: QuizSettingSkipClickProps
  quiz_setting_save_click: QuizSettingSaveClickProps
  quiz_exit_click: QuizExitClickProps
  quiz_pdf_download: QuizPdfDownloadProps
  // 마이
  my_analysis_click: MyAnalysisClickProps
  my_star_click: MyStarClickProps
  my_setting_push_click: MySettingPushClickProps
  my_history_click: MyHistoryClickProps
  // 친구 초대
  invite_view: InviteViewProps
  invite_share_click: InviteShareClickProps
  // 퀴즈 시작 및 종료
  quiz_start: QuizStartClickProps
  // 마이 퀴마뉴
  quickmenu_click: QuickmenuClickProps
  // 공유
  share_click: ShareClickProps
}

/**
 * Amplitude 컨텍스트 타입
 */
type AmplitudeContextType = {
  /**
   * 이벤트 추적 함수
   * @param eventName 이벤트 이름
   * @param eventProperties 이벤트 프로퍼티
   */
  trackEvent: <T extends EventName>(eventName: T, eventProperties?: EventPropsMap[T]) => void
}

/**
 * Amplitude 컨텍스트 생성
 */
const AmplitudeContext = createContext<AmplitudeContextType | null>(null)

/**
 * Amplitude 프로바이더 컴포넌트
 */
export const AmplitudeProvider = ({ children }: PropsWithChildren) => {
  // Amplitude 초기화
  useEffect(() => {
    if (!AMPLITUDE_API_KEY) {
      console.warn('Amplitude API Key가 없습니다.')
      return
    }

    init(AMPLITUDE_API_KEY, undefined, {
      logLevel: import.meta.env.DEV ? 0 : 3, // Debug: 0, Error: 3
    })
  }, [])

  // 컨텍스트 값 생성
  const contextValue = useMemo<AmplitudeContextType>(
    () => ({
      trackEvent: (eventName, eventProperties) => {
        if (!AMPLITUDE_API_KEY) {
          console.warn(`Amplitude API Key가 없어 이벤트 ${eventName}를 추적할 수 없습니다.`)
          return
        }

        track(eventName, eventProperties)

        if (import.meta.env.DEV) {
          console.log(`[픽토스 이벤트] ${eventName}`, eventProperties)
        }
      },
    }),
    [],
  )

  return <AmplitudeContext.Provider value={contextValue}>{children}</AmplitudeContext.Provider>
}

/**
 * Amplitude 컨텍스트 훅
 */
export const useAmplitude = () => {
  const context = useContext(AmplitudeContext)
  if (!context) {
    throw new Error('useAmplitude는 AmplitudeProvider 내부에서만 사용할 수 있습니다.')
  }
  return context
}
