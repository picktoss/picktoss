import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { MarkdownProcessor, formatQAText, highlightAndTrimText } from '@/features/search/lib'
import { useSearch } from '@/features/search/model/use-search'

import { SearchBookmarkDocumentsDto, SearchDocumentsDto } from '@/entities/document/api'
import { useSearchDocument } from '@/entities/document/api/hooks'

import { BackButton } from '@/shared/components/buttons/back-button'
import { Header } from '@/shared/components/header'
import SearchQuizItem from '@/shared/components/items/search-quiz-item'
import Loading from '@/shared/components/ui/loading'
import { SearchInput } from '@/shared/components/ui/search-input'
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Text } from '@/shared/components/ui/text'
import { Link, useQueryParam } from '@/shared/lib/router'
import { StorageKey } from '@/shared/lib/storage'

type Tab = 'MY' | 'BOOKMARK'

const LibrarySearchPage = () => {
  const [activeTab, setTab] = useQueryParam('/library/search', 'tab')
  const {
    inputValue,
    setInputValue,
    queryKeyword,
    showRecentKeywords,
    setShowRecentKeywords,
    searchInputRef,
    handleClearKeyword,
    onSearchSubmit,
    RecentSearchKeywords,
  } = useSearch(StorageKey.libraryRecentSearchKeyword)

  // 쿼리를 사용하여 queryKeyword 변경 시 자동으로 검색 실행
  const { data: searchResultsData, isFetching } = useSearchDocument(
    { keyword: queryKeyword },
    {
      enabled: !!queryKeyword && !showRecentKeywords,
    },
  )
  const searchResultsMyDocs = searchResultsData?.documents ?? []
  const searchResultsBookmarks = searchResultsData?.bookmarkedDocuments ?? []

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    // onSearchSubmit 호출 시 URL이 업데이트되고 queryKeyword가 변경됨
    // 이에 따라 자동으로 useSearchDocumentsQuery가 실행됨
    onSearchSubmit()
  }

  const onChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  // 탭에 따라 결과 컨텐츠 설정
  const tabConfig: Record<Tab, { documents: SearchDocumentsDto[] | SearchBookmarkDocumentsDto[] }> = {
    MY: { documents: searchResultsMyDocs },
    BOOKMARK: { documents: searchResultsBookmarks },
  }

  const activeDocuments = tabConfig[activeTab].documents
  const hasResults = activeDocuments.length > 0

  return (
    <div className="h-screen bg-base-1 flex flex-col">
      <Header
        left={<BackButton className="mr-1" />}
        content={
          <>
            <form onSubmit={handleSubmit} tabIndex={-1} className="relative grow">
              <SearchInput
                autoFocus
                ref={searchInputRef}
                onFocus={() => setShowRecentKeywords(true)}
                value={inputValue}
                onChange={onChangeKeyword}
                clearKeyword={handleClearKeyword}
                placeholder="퀴즈 제목, 내용 검색"
              />
            </form>

            {/* input 클릭 시 나타날 최근 검색어 : 외부 영역 클릭 시 닫힘 */}
            {showRecentKeywords && <RecentSearchKeywords />}
          </>
        }
      />

      <HeaderOffsetLayout className="relative h-full">
        {isFetching && <Loading center />}

        {!isFetching && !showRecentKeywords && queryKeyword && (
          <>
            <Tabs value={activeTab} onValueChange={(tab) => setTab(tab as Tab)}>
              <TabsList className="bg-surface-1 rounded-none h-fit p-0">
                <TabsTrigger
                  className="typo-button-2 bg-surface-1 border-b border-divider data-[state=active]:border-b-2 data-[state=active]:border-black text-sub data-[state=active]:text-primary h-[48px] w-1/2 rounded-none"
                  value={'MY' as Tab}
                >
                  내 퀴즈
                </TabsTrigger>
                <TabsTrigger
                  className="typo-button-2 bg-surface-1 border-b border-divider data-[state=active]:border-b-2 data-[state=active]:border-black text-sub data-[state=active]:text-primary h-[48px] w-1/2 rounded-none"
                  value={'BOOKMARK' as Tab}
                >
                  북마크
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <TabContent tab={activeTab} documents={activeDocuments} keyword={queryKeyword} hasResults={hasResults} />
          </>
        )}
      </HeaderOffsetLayout>
    </div>
  )
}

interface TabContentProps {
  tab: Tab
  documents: SearchDocumentsDto[] | SearchBookmarkDocumentsDto[]
  keyword: string
  hasResults: boolean
}

const TabContent = ({ tab, documents, keyword, hasResults }: TabContentProps) => {
  if (!hasResults && keyword) {
    return (
      <div className="size-full flex-center flex-col gap-[8px] pb-[108px]">
        <Text typo="subtitle-1-bold">검색 결과가 없어요</Text>
        <Text typo="body-1-medium" color="sub">
          다른 키워드를 입력해보세요
        </Text>
      </div>
    )
  }

  return <LibrarySearchResults tab={tab} documents={documents} keyword={keyword} />
}

interface LibrarySearchResultsProps {
  tab: Tab
  documents: SearchDocumentsDto[] | SearchBookmarkDocumentsDto[]
  keyword: string
}

/** 내 문서에서 검색 결과가 있을 때 결과들을 보여주는 컴포넌트 */
const LibrarySearchResults = ({ tab, documents, keyword }: LibrarySearchResultsProps) => {
  function isSearchDocumentsDto(item: SearchDocumentsDto | SearchBookmarkDocumentsDto): item is SearchDocumentsDto {
    return 'content' in item && typeof item.content === 'string'
  }

  return (
    <div className="h-[calc(100%-48px)] flex flex-col px-[16px] pt-[16px] overflow-y-auto">
      <Text typo="body-1-medium">
        결과 <span className="text-accent">{documents.length}</span>
      </Text>

      <div className="h-fit flex flex-col pb-[16px]">
        {documents.map((searchItem, idx) => {
          return (
            <Link
              key={searchItem.id}
              to={tab === 'MY' ? '/library/:noteId' : '/explore/detail/:noteId'}
              params={[String(searchItem.id)]}
            >
              <SearchQuizItem
                documentTitle={highlightAndTrimText(searchItem.name ?? '', keyword ?? '', 'subtitle-2-bold')}
                documentEmoji={searchItem.emoji}
                matchingSentence={
                  isSearchDocumentsDto(searchItem) && searchItem.content.includes(keyword) ? (
                    <MarkdownProcessor markdownText={searchItem.content} keyword={keyword ?? ''} typo="body-1-bold" />
                  ) : (
                    highlightAndTrimText(formatQAText(searchItem.quizzes), keyword ?? '', 'body-1-bold')
                  )
                }
                quizCount={searchItem.totalQuizCount}
                isPublic={isSearchDocumentsDto(searchItem) ? searchItem.isPublic : true}
                playedCount={searchItem.tryCount}
                bookmarkCount={searchItem.bookmarkCount}
                lastItem={idx === documents.length - 1}
              />
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default withHOC(LibrarySearchPage, {})
