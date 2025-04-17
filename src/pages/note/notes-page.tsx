import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { useNoteList } from '@/features/note/hooks/use-note-list'
import BookmarkedNotesContent from '@/features/note/ui/bookmarked-notes-content'
import EmptyBookmarkQuiz from '@/features/note/ui/empty-bookmark-quiz'
import EmptyMyNote from '@/features/note/ui/empty-my-note'
import MyNotesContent from '@/features/note/ui/my-notes-content'

import { IcAdd, IcBack, IcProfile } from '@/shared/assets/icon'
import { Header } from '@/shared/components/header'
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { TextButton } from '@/shared/components/ui/text-button'

const NotesPage = () => {
  const {
    activeTab,
    setTab,

    selectMode,
    changeSelectMode,

    myDocsCheckList,

    isLoading,
    myDocuments,
    bookmarkedDocuments,
  } = useNoteList()

  const isEmptyMyDocuments = !myDocuments || myDocuments.length === 0
  const isEmptyBookmarked = !bookmarkedDocuments || bookmarkedDocuments.length === 0

  type Tab = typeof activeTab

  const { toggleAll } = myDocsCheckList

  return (
    <>
      {/* selectMode에 따른 헤더 상태 */}
      {selectMode ? (
        <Header
          className="bg-surface-2 py-[9px] px-[8px]"
          left={
            <button onClick={() => changeSelectMode(false)} className="size-[40px] flex-center">
              <IcBack className="size-[24px] text-icon-primary" />
            </button>
          }
          content={<div className="center">퀴즈 선택</div>}
          right={
            <TextButton onClick={() => toggleAll()} variant={'primary'} size={'sm'}>
              전체 선택
            </TextButton>
          }
        />
      ) : (
        <Header
          className="bg-surface-2 py-[9px] px-[8px]"
          left={
            <button className="size-[40px] flex-center">
              <IcProfile className="size-[24px] text-icon-secondary" />
            </button>
          }
          right={
            <button className="size-[40px] flex-center">
              <IcAdd className="size-[24px] text-icon-secondary" />
            </button>
          }
          content={
            <div className="center">
              <Tabs value={activeTab} onValueChange={(tab) => setTab(tab as Tab)}>
                <TabsList>
                  <TabsTrigger
                    className="typo-button-2 text-secondary data-[state=active]:bg-inverse data-[state=active]:text-inverse rounded-full"
                    value={'MY' as Tab}
                  >
                    내 퀴즈
                  </TabsTrigger>
                  <TabsTrigger
                    className="typo-button-2 text-secondary data-[state=active]:bg-inverse data-[state=active]:text-inverse rounded-full"
                    value={'BOOKMARK' as Tab}
                  >
                    북마크
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          }
        />
      )}

      {/* 로딩과 tab에 따른 메인 영역 컨텐츠 */}
      <HeaderOffsetLayout className="size-full">
        {isLoading ? (
          <div className="size-full flex-center">is Loading...</div>
        ) : (
          <>
            {activeTab === 'MY' &&
              (isEmptyMyDocuments ? (
                <EmptyMyNote />
              ) : (
                <MyNotesContent
                  documents={myDocuments}
                  selectMode={selectMode}
                  changeSelectMode={changeSelectMode}
                  checkList={myDocsCheckList}
                />
              ))}

            {activeTab === 'BOOKMARK' &&
              (isEmptyBookmarked ? <EmptyBookmarkQuiz /> : <BookmarkedNotesContent documents={bookmarkedDocuments} />)}
          </>
        )}
      </HeaderOffsetLayout>
    </>
  )
}

export default withHOC(NotesPage, {
  activeTab: '도서관',
  navClassName: 'border-t border-divider',
  backgroundClassName: 'bg-surface-2',
})
