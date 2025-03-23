import { useState } from 'react'

import { useSearch } from '@/features/search/model/use-search'
import { MarkdownProcessor, highlightAndTrimText } from '@/features/search/utils'

import { DocumentSearchResult, QuizSearchResult } from '@/entities/search/api'
import { useSearchDocuments } from '@/entities/search/api/hooks'
import { NoResults } from '@/entities/search/ui/no-results'

import { BackButton } from '@/shared/components/buttons/back-button'
import { Header } from '@/shared/components/header/header'
import SearchQuizNoteItem from '@/shared/components/items/search-quiz-note-item'
import { SearchInput } from '@/shared/components/ui/search-input'
import { Text } from '@/shared/components/ui/text'
import { StorageKey } from '@/shared/lib/storage'

const NoteSearchPage = () => {
  const [searchResults, setSearchResults] = useState<{
    documents?: DocumentSearchResult[]
    quizzes?: QuizSearchResult[]
  } | null>(null)

  const {
    inputValue,
    setInputValue,
    showRecentKeywords,
    setShowRecentKeywords,
    searchInputRef,
    handleClearKeyword,
    onSearchSubmit,
    RecentSearchKeywords,
  } = useSearch(StorageKey.quizNoteRecentSearchKeyword)

  const { mutate: searchMutate, isPending } = useSearchDocuments({
    onSuccess: (data) => {
      setSearchResults(data)
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!inputValue.trim()) return
    searchMutate(inputValue)
    onSearchSubmit()
  }

  const onChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const hasSearchResults =
    searchResults &&
    ((searchResults.documents && searchResults.documents.length > 0) ||
      (searchResults.quizzes && searchResults.quizzes.length > 0))

  return (
    <div className="size-full bg-surface-1">
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
                placeholder="노트명 노트, 퀴즈 검색"
              />
            </form>

            {/* input 클릭 시 나타날 최근 검색어 : 외부 영역 클릭 시 닫힘 */}
            {showRecentKeywords && <RecentSearchKeywords />}
          </>
        }
      />

      <div className="flex-1 overflow-auto">
        {!showRecentKeywords && !isPending && !hasSearchResults && <NoResults />}
        {!showRecentKeywords && !isPending && hasSearchResults && (
          <DocumentQuizSearchResults
            documents={searchResults?.documents || []}
            quizzes={searchResults?.quizzes || []}
            keyword={inputValue.trim()}
          />
        )}
      </div>
    </div>
  )
}

export default NoteSearchPage

interface DocumentQuizSearchResultsProps {
  documents: DocumentSearchResult[]
  quizzes: QuizSearchResult[]
  keyword: string
}

/** 검색 결과가 있을 때 퀴즈와 노트 결과들을 보여주는 컴포넌트 */
const DocumentQuizSearchResults = ({ documents, quizzes, keyword }: DocumentQuizSearchResultsProps) => {
  const allResults = [...documents, ...quizzes]

  return (
    <div className="h-[calc(100dvh-56px)] px-[16px] overflow-y-auto text-text1-medium">
      <div className="flex flex-col p-[16px]">
        <Text typo="body-1-medium">
          퀴즈 노트 <span className="text-accent">{allResults.length}</span>
        </Text>

        <div className="flex flex-col">
          {allResults.map((searchItem, idx) => {
            const isQuizType = 'question' in searchItem && 'answer' in searchItem
            const isNoteType = 'content' in searchItem

            return (
              <SearchQuizNoteItem
                key={idx}
                documentId={searchItem.documentId || null}
                documentTitle={highlightAndTrimText(searchItem.documentName ?? '', keyword ?? '')}
                matchingSentence={
                  // 문서 결과
                  isNoteType ? (
                    <MarkdownProcessor markdownText={searchItem.content} keyword={keyword ?? ''} />
                  ) : (
                    // 퀴즈 결과
                    isQuizType &&
                    highlightAndTrimText(
                      `Q.${searchItem.question ?? '...'} A.${
                        (searchItem.answer === 'correct'
                          ? 'O'
                          : searchItem.answer === 'incorrect'
                            ? 'X'
                            : searchItem.answer) ?? '...'
                      }`,
                      keyword ?? '',
                    )
                  )
                }
                resultType={isQuizType ? 'quiz' : 'document'}
                quizCount={25} // todo: searchItem.-- 데이터 값으로 수정
                charCount={15430} // todo: searchItem.-- 데이터 값으로 수정
                relativeDirectory={
                  isNoteType
                    ? searchItem.directory.name === '기본 폴더'
                      ? '전체 노트'
                      : searchItem.directory.name
                    : (searchItem.directoryName ?? '')
                }
                directoryEmoji="🎯" // todo: searchItem.-- 데이터 값으로 수정
                lastItem={idx === allResults.length - 1}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
