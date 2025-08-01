import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { useNoteList } from '@/features/note/hooks/use-note-list'
import BookmarkedNotesContent from '@/features/note/ui/bookmarked-notes-content'
import MyNotesContent from '@/features/note/ui/my-notes-content'

import { IcAdd, IcBack, IcSearch } from '@/shared/assets/icon'
import { Header } from '@/shared/components/header'
import { Text } from '@/shared/components/ui/text'
import { TextButton } from '@/shared/components/ui/text-button'
import { useAmplitude } from '@/shared/hooks/use-amplitude-context'
import { Link, useRouter } from '@/shared/lib/router'

const LibraryPage = () => {
  const { trackEvent } = useAmplitude()
  const router = useRouter()

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

  const handleTabChange = (tab: Tab) => {
    setTab(tab)
  }

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
          className="bg-surface-2 px-2"
          right={
            <button
              onClick={() => {
                router.push('/note/create', { search: { documentType: 'FILE' } })
                trackEvent('generate_new_click', {
                  format: '파일 버튼',
                  location: '도서관 페이지',
                })
              }}
              className="size-[40px] flex-center"
            >
              <IcAdd className="size-[24px]" />
            </button>
          }
          content={
            <div className="w-[calc(100%-40px)] px-[8px]">
              <Link
                to={'/library/search'}
                className="h-[40px] flex-1 bg-base-3 py-[8px] px-[10px] flex items-center gap-[4px] rounded-full"
              >
                <IcSearch className="size-[20px] text-icon-secondary" />
                <Text typo="subtitle-2-medium" color="caption">
                  퀴즈 제목, 내용 검색
                </Text>
              </Link>
            </div>
          }
        />
      )}

      {/* tab에 따른 메인 영역 컨텐츠 */}
      <HeaderOffsetLayout className="size-full">
        {activeTab === 'MY' && (
          <MyNotesContent
            activeTab={activeTab}
            onTabChange={handleTabChange}
            isLoading={isLoading}
            isEmptyMyDocuments={isEmptyMyDocuments}
            documents={myDocuments}
            selectMode={selectMode}
            changeSelectMode={changeSelectMode}
            checkList={myDocsCheckList}
          />
        )}

        {activeTab === 'BOOKMARK' && (
          <BookmarkedNotesContent
            activeTab={activeTab}
            onTabChange={handleTabChange}
            isLoading={isLoading}
            isEmptyBookmarked={isEmptyBookmarked}
            documents={bookmarkedDocuments}
          />
        )}
      </HeaderOffsetLayout>
    </>
  )
}

export default withHOC(LibraryPage, {
  activeTab: '도서관',
  navClassName: 'border-t border-divider',
  backgroundClassName: 'bg-surface-2',
})
