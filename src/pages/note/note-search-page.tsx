const NoteSearchPage = () => {
  // const {
  //   initialKeyword,
  //   keyword,
  //   setKeyword,
  //   isSearchFocused,
  //   setIsSearchFocused,
  //   searchInputRef,
  //   searchContainerRef,
  //   handleDeleteKeyword,
  //   handleUpdateKeyword,
  //   handleSubmit,
  // } = useSearch()
  // const { data, isPending } = useQuery(queries.document.search({ keyword: initialKeyword }))
  // const searchResults = [...(data?.documents ?? []), ...(data?.quizzes ?? [])] as Partial<
  //   Document.SearchedDocument & Document.SearchedQuiz
  // >[]
  // const onChangeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
  //   setKeyword(e.target.value)
  // }
  // const onDeleteKeyword = () => {
  //   handleDeleteKeyword('/document/search')
  // }
  // const onUpdateKeyword = (keyword: string) => {
  //   handleUpdateKeyword(keyword, `?keyword=${keyword}`)
  // }
  // const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   handleSubmit(e, `?keyword=${keyword}`)
  // }
  // return (
  //   <div>
  //     <SearchHeader
  //       keyword={keyword}
  //       onChangeKeyword={onChangeKeyword}
  //       handleDeleteKeyword={onDeleteKeyword}
  //       handleSubmit={onSubmit}
  //       handleUpdateKeyword={onUpdateKeyword}
  //       searchContainerRef={searchContainerRef}
  //       searchInputRef={searchInputRef}
  //       isSearchFocused={isSearchFocused}
  //       setIsSearchFocused={setIsSearchFocused}
  //     />
  //     {!isSearchFocused &&
  //       (isPending ? (
  //         <Loading center />
  //       ) : // 검색 결과 X
  //       !data || searchResults.length === 0 ? (
  //         <NoResults className="h-[calc(100dvh-56px)]" />
  //       ) : (
  //         // 검색 결과 O : 검색 결과 리스트
  //         data &&
  //         searchResults.length > 0 && (
  //           <div className="h-[calc(100dvh-56px)] overflow-y-auto text-text1-medium">
  //             <DocumentQuizSearchList
  //               length={searchResults.length}
  //               searchResults={searchResults}
  //               keyword={initialKeyword}
  //             />
  //           </div>
  //         )
  //       ))}
  //   </div>
  // )
}

export default NoteSearchPage
