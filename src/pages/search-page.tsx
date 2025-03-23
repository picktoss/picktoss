import { useState } from 'react'

import { useSearch } from '@/features/search/model/use-search'

import { useSearchIntegrated } from '@/entities/search/api/hooks'
import {
  CollectionSearchResult,
  DocumentSearchResult,
  IntegratedSearchResponse,
  QuizSearchResult,
} from '@/entities/search/api/index'
import { NoResults } from '@/entities/search/ui/no-results'

import { BackButton } from '@/shared/components/buttons/back-button'
import { Header } from '@/shared/components/header/header'
import { SearchInput } from '@/shared/components/ui/search-input'
import { Text } from '@/shared/components/ui/text'
import { StorageKey } from '@/shared/lib/storage'

export const SearchPage = () => {
  const [searchResults, setSearchResults] = useState<IntegratedSearchResponse | null>(null)

  const {
    inputValue,
    setInputValue,
    showRecentKeywords,
    setShowRecentKeywords,
    searchInputRef,
    handleClearKeyword,
    onSearchSubmit,
    RecentSearchKeywords,
  } = useSearch(StorageKey.integratedRecentSearchKeyword)

  const { mutate: searchMutate, isPending } = useSearchIntegrated({
    onSuccess: (data: IntegratedSearchResponse) => {
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
    (searchResults.documents?.length > 0 || searchResults.collections?.length > 0 || searchResults.quizzes?.length > 0)

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
                placeholder="노트, 퀴즈, 컬렉션 검색"
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
          <SearchResults
            documents={searchResults.documents}
            collections={searchResults.collections}
            quizzes={searchResults.quizzes}
          />
        )}
      </div>
    </div>
  )
}

interface SearchResultsProps {
  documents: IntegratedSearchResponse['documents']
  collections: IntegratedSearchResponse['collections']
  quizzes: IntegratedSearchResponse['quizzes']
}

const SearchResults = ({ documents, collections, quizzes }: SearchResultsProps) => (
  <div className="p-4">
    {documents.length > 0 && (
      <div className="mb-6">
        <Text typo="subtitle-2-medium" className="mb-2">
          문서 ({documents.length})
        </Text>
        {documents.map((document: DocumentSearchResult) => (
          <div key={document.documentId} className="p-3 rounded-lg bg-base-2 mb-2">
            <Text typo="subtitle-2-medium" className="line-clamp-1">
              {document.documentName}
            </Text>
            <Text typo="body-1-regular" color="sub" className="line-clamp-2 mt-1">
              {document.content}
            </Text>
          </div>
        ))}
      </div>
    )}
    {collections.length > 0 && (
      <div className="mb-6">
        <Text typo="subtitle-2-medium" className="mb-2">
          컬렉션 ({collections.length})
        </Text>
        {collections.map((collection: CollectionSearchResult) => (
          <div key={collection.id} className="p-3 rounded-lg bg-base-2 mb-2">
            <Text typo="subtitle-2-medium" className="line-clamp-1">
              {collection.name}
            </Text>
            <Text typo="body-1-regular" color="sub" className="line-clamp-2 mt-1">
              {collection.memberName}
            </Text>
          </div>
        ))}
      </div>
    )}
    {quizzes.length > 0 && (
      <div>
        <Text typo="subtitle-2-medium" className="mb-2">
          퀴즈 ({quizzes.length})
        </Text>
        {quizzes.map((quiz: QuizSearchResult) => (
          <div key={quiz.id} className="p-3 rounded-lg bg-base-2 mb-2">
            <Text typo="subtitle-2-medium" className="line-clamp-1">
              {quiz.question}
            </Text>
            <Text typo="body-1-regular" color="sub" className="line-clamp-2 mt-1">
              {quiz.answer}
            </Text>
          </div>
        ))}
      </div>
    )}
  </div>
)
