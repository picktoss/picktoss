import { createContext, useCallback, useContext, useEffect, useState } from 'react'

import { toast } from 'sonner'

import { DOCUMENT_CONSTRAINTS, MAXIMUM_QUIZ_COUNT } from '@/features/note/config'
import { calculateAvailableQuizCount, extractPlainText, generateMarkdownFromFile } from '@/features/note/lib'
import { CreateDocumentSchema, FileInfo, FileInfoSchema, isValidFileType } from '@/features/note/model/schema'

import { GetAllDirectoriesResponse } from '@/entities/directory/api'
import { CreateDocumentRequest } from '@/entities/document/api'
import { useCreateDocument } from '@/entities/document/api/hooks'

import { IcWarningFilled } from '@/shared/assets/icon'

export type DocumentType = CreateDocumentRequest['documentType'] | null
export type QuizType = CreateDocumentRequest['quizType']

export interface CreateNoteState {
  directoryId: number
  documentType: DocumentType
  documentName: string
  quizType: QuizType
  star: string
  content: {
    markdown: string
    textLength: number
  }
  emoji: string
}

export interface CreateNoteContextValues extends CreateNoteState {
  directories: GetAllDirectoriesResponse['directories']

  // Setter functions
  setDirectoryId: (directoryId: number) => void
  setDocumentType: (documentType: DocumentType) => void
  setDocumentName: (documentName: string) => void
  setQuizType: (quizType: QuizType) => void
  setStar: (star: string) => void
  setContent: (content: { markdown: string; textLength: number }) => void
  setEmoji: (emoji: string) => void

  // Keyboard visibility state
  isKeyboardVisible: boolean
  setIsKeyboardVisible: (isKeyboardVisible: boolean) => void

  isPending: boolean
  handleCreateDocument: () => Promise<void>
  checkButtonActivate: () => boolean

  // upload file
  fileInfo: FileInfo | null
  isProcessing: boolean
  setIsProcessing: (value: boolean) => void
  changeFileInfo: (e: React.ChangeEvent<HTMLInputElement>) => void

  // 유효성 에러 메세지 설정 함수
  setValidationError: (errorMessage: string | null) => void

  DOCUMENT_MIN_QUIZ_COUNT: number
  DOCUMENT_MAX_QUIZ_COUNT: number
}

export const CreateNoteContext = createContext<CreateNoteContextValues | null>(null)

export const CreateNoteProvider = ({
  directories,
  children,
}: {
  directories: GetAllDirectoriesResponse['directories']
  children: React.ReactNode
}) => {
  // 기본 상태 정의
  const [directoryId, setDirectoryId] = useState<number>(directories[0].id)
  const [documentType, setDocumentType] = useState<DocumentType>(null)
  const [documentName, setDocumentName] = useState<string>('')
  const [quizType, setQuizType] = useState<QuizType>('MULTIPLE_CHOICE')
  const [star, setStar] = useState<string>('5')
  const [content, setContent] = useState<{ markdown: string; textLength: number }>({
    markdown: '',
    textLength: 0,
  })
  const [emoji, setEmoji] = useState<string>('📝')
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // 유효성 검사 에러 상태
  const [validationError, setValidationError] = useState<string | null>(null)

  // 키보드 가시성 상태
  const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false)

  const { mutateAsync: createDocument, isPending } = useCreateDocument()

  // 문서 길이에 따라 생성 가능한 문제 수
  const maxQuizCount = calculateAvailableQuizCount(content.textLength)
  const DOCUMENT_MIN_QUIZ_COUNT = maxQuizCount < 5 ? maxQuizCount : 5
  const DOCUMENT_MAX_QUIZ_COUNT = Math.min(maxQuizCount, MAXIMUM_QUIZ_COUNT)

  // 기본 문제 수 : 최댓값
  useEffect(() => {
    setStar(String(DOCUMENT_MAX_QUIZ_COUNT))
  }, [DOCUMENT_MAX_QUIZ_COUNT])

  // validation error가 설정될 때마다 토스트 생성
  useEffect(() => {
    if (validationError) {
      toast.error(validationError, {
        icon: <IcWarningFilled className="size-4 text-icon-critical" />,
      })
      setValidationError(null)
    }
  }, [validationError])

  /** 만들기 버튼 활성화 조건 체크 함수 */
  const checkButtonActivate = () => {
    const isContentValid =
      content.textLength >= DOCUMENT_CONSTRAINTS.CONTENT.MIN && content.textLength <= DOCUMENT_CONSTRAINTS.CONTENT.MAX
    const isNameValid = documentName.trim().length > 0
    const isTypeValid = documentType !== null
    return isContentValid && isNameValid && isTypeValid
  }

  /** fileInfo 유효성 검사 함수 */
  const validateFileInfo = (info: unknown) => {
    const result = FileInfoSchema.safeParse(info)
    if (!result.success) {
      setValidationError(result.error.errors[0]?.message ?? 'file validation error')
      return false
    }
    setValidationError(null)
    return true
  }

  /** file이 변경되면 fileInfo상태를 설정하는 함수 */
  const changeFileInfo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsProcessing(true)

    if (fileInfo) {
      setFileInfo(null)
      setValidationError(null)
    }

    const file = e.target.files?.[0] ?? null

    if (!file) {
      setIsProcessing(false)
      setValidationError('파일이 존재하지 않습니다.')
      return
    }
    if (!isValidFileType(file)) {
      setValidationError('PDF, DOCX, TXT 파일만 업로드할 수 있습니다.')
    }

    try {
      const markdownString = await generateMarkdownFromFile(file)
      const markdownText = await extractPlainText(markdownString)

      const newFileInfo = {
        name: file.name,
        size: file.size,
        content: markdownString,
        charCount: markdownText.length,
      }
      if (!validateFileInfo(newFileInfo)) {
        return
      }

      setFileInfo(newFileInfo)
    } catch (err) {
      console.error('파일 처리 중 오류 발생:', err)
      setValidationError('파일 처리 중 문제가 발생했습니다.')
    } finally {
      setIsProcessing(false)
    }
  }

  /** 노트 생성 유효성 검사 함수 */
  const checkIsValid = useCallback(() => {
    const blob = new Blob([content.markdown], { type: 'text/markdown' })
    const file = new File([blob], `${documentName}.md`, { type: 'text/markdown' })

    const createDocumentData = {
      directoryId: String(directoryId),
      documentName,
      file,
      quizType,
      star,
      documentType: documentType ?? 'TEXT',
    }

    console.log(createDocumentData)

    const result = CreateDocumentSchema.safeParse(createDocumentData)
    if (!result.success) {
      setValidationError(result.error.errors[0]?.message ?? 'create validation error')
      return false
    }

    setValidationError(null)
    return true
  }, [directoryId, documentName, content.markdown, quizType, star, documentType])

  const handleCreateDocument = async () => {
    if (directoryId == null) {
      setValidationError('폴더 선택은 필수입니다')
      return
    }

    if (!checkIsValid()) {
      return
    }

    const blob = new Blob([content.markdown], { type: 'text/markdown' })
    const file = new File([blob], `${documentName}.md`, { type: 'text/markdown' })

    const createDocumentData = {
      directoryId: String(directoryId),
      documentName,
      file,
      quizType,
      star,
      documentType: documentType ?? 'TEXT',
    }

    createDocument(createDocumentData, {
      onSuccess: ({ id }) => {
        toast.success(`문서가 생성되었습니다. / id: ${id}`)
      },
      onError: (error) => {
        toast.error('문서 생성에 실패했습니다. / errorMessage: ' + error.message, {
          icon: <IcWarningFilled className="size-4 text-icon-critical" />,
        })
      },
    })
  }

  return (
    <CreateNoteContext.Provider
      value={{
        directories,
        directoryId,
        documentType,
        documentName,
        quizType,
        star,
        content,
        emoji,
        isKeyboardVisible,

        setDirectoryId,
        setDocumentType,
        setDocumentName,
        setQuizType,
        setStar,
        setContent,
        setEmoji,
        setIsKeyboardVisible,

        fileInfo,
        changeFileInfo,
        isProcessing,
        setIsProcessing,

        checkButtonActivate,
        handleCreateDocument,
        isPending,
        setValidationError,

        DOCUMENT_MIN_QUIZ_COUNT,
        DOCUMENT_MAX_QUIZ_COUNT,
      }}
    >
      {children}
    </CreateNoteContext.Provider>
  )
}

export const useCreateNoteContext = () => {
  const context = useContext(CreateNoteContext)
  if (!context) {
    throw new Error('useCreateNoteContext must be used within a CreateNoteProvider')
  }
  return context
}
