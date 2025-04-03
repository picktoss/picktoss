import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { CreateNoteProvider, useCreateNoteContext } from '@/features/note/model/create-note-context'
import { CreateNoteDrawer } from '@/features/note/ui/create-note-drawer'
import { DirectorySelector } from '@/features/note/ui/directory-selector'
import { EmojiTitleInput } from '@/features/note/ui/emoji-title-input'
import { NoteCreateMarkdown } from '@/features/note/ui/note-create-markdown'
import NoteCreatePageFile from '@/features/note/ui/note-create-page-file'
import { SelectDocumentType } from '@/features/note/ui/select-document-type'

import { useGetAllDirectories } from '@/entities/directory/api/hooks'

import { BackButton } from '@/shared/components/buttons/back-button'
import { Header } from '@/shared/components/header/header'

const NoteCreatePage = () => {
  const { data: directories, isLoading: isDirectoryLoading } = useGetAllDirectories()

  if (!directories || isDirectoryLoading) {
    return <div className="center">Loading...</div>
  }

  return (
    <CreateNoteProvider directories={directories}>
      <div className="h-full max-w-xl mx-auto relative">
        <Header
          className="z-50"
          left={<BackButton type="close" />}
          content={
            <>
              <DirectorySelector />
              <div className="ml-auto w-fit">
                <CreateNoteDrawer />
              </div>
            </>
          }
        />

        <HeaderOffsetLayout className="h-full">
          <NoteCreateContent />
        </HeaderOffsetLayout>
      </div>
    </CreateNoteProvider>
  )
}

const NoteCreateContent = () => {
  const { documentType } = useCreateNoteContext()

  return (
    <>
      {!documentType && <SelectDocumentType />}

      {documentType && (
        <div className="h-[calc(var(--viewport-height,100vh)_-_(var(--header-height-safe)))] flex flex-col">
          <EmojiTitleInput />

          {documentType === 'TEXT' && <NoteCreateMarkdown />}
          {documentType === 'FILE' && <NoteCreatePageFile />}
        </div>
      )}
    </>
  )
}

export default withHOC(NoteCreatePage, {
  backgroundColor: 'bg-surface-1',
})
