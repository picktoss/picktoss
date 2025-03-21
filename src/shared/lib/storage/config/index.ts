/**
 * 애플리케이션의 모든 스토리지 키를 상수로 정의
 *
 * 로컬스토리지, 세션스토리지 등 스토리지 사용 시 키를 하드코딩하는 대신 이 객체를 참조
 * 코드 전체에서 스토리지 키 일관성을 유지하고 변경 시 단일 지점에서 관리
 *
 * @example
 * // 다음과 같이 사용
 * storage.set(StorageKey.token, 'my-token')
 * storage.get(StorageKey.recentSearches)
 */
export const StorageKey = {
  /** 최근 전체 검색 키워드 */
  integratedRecentSearchKeyword: 'integratedRecentSearchKeyword',
} as const

/**
 * 각 스토리지 키에 대한 값 타입을 정의
 *
 * 각 키마다 저장되는 데이터의 타입을 명확히 정의
 * 타입 안전성을 보장하기 위해 사용
 */
export interface StorageSchema {
  [StorageKey.integratedRecentSearchKeyword]: string[]
}
