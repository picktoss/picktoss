import { useState } from 'react'

import { toast } from 'sonner'

import { useCreateDocument } from '@/entities/document/api/hooks'

import { ImgMultiple, ImgStar } from '@/shared/assets/images'
import { Button } from '@/shared/components/ui/button'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/shared/components/ui/drawer'
import { Slider } from '@/shared/components/ui/slider'
import { Text } from '@/shared/components/ui/text'
import { cn } from '@/shared/lib/utils'

import { calculateAvailableQuizCount } from '../../lib'
import { MAXIMUM_QUIZ_COUNT, MIN_LENGTH, useCreateNoteContext } from '../../model/create-note-context'

export const CreateNoteDrawer = () => {
  const { quizType, setQuizType, documentName, star, setStar, content, form } = useCreateNoteContext()
  const [open, setOpen] = useState(false)

  const maxQuizCount = calculateAvailableQuizCount(content.textLength)
  const DOCUMENT_MIN_QUIZ_COUNT = maxQuizCount < 5 ? maxQuizCount : 5
  const DOCUMENT_MAX_QUIZ_COUNT = Math.min(maxQuizCount, MAXIMUM_QUIZ_COUNT)

  const { mutateAsync: createDocument, isPending } = useCreateDocument()

  const handleCreateDocument = async () => {
    if (!documentName.trim()) {
      toast.error('문서 이름을 입력해주세요.')
      return
    }

    if (content.textLength < MIN_LENGTH) {
      toast.error(`최소 ${MIN_LENGTH}자 이상 입력해주세요.`)
      return
    }

    const contentBlob = new Blob([form.getValues('content.markdown')], { type: 'text/markdown' })

    const { id } = await createDocument({
      file: contentBlob,
      documentName: form.getValues('documentName'),
      directoryId: String(form.getValues('directoryId')),
      star: form.getValues('star'),
      quizType: form.getValues('quizType'),
      documentType: form.getValues('documentType') || 'TEXT',
    })
  }

  return (
    <Drawer open={open || isPending} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="primary" size="sm" type="submit" disabled={!form.formState.isValid}>
          {form.formState.isLoading ? '생성 중...' : '만들기'}
        </Button>
      </DrawerTrigger>
      <DrawerContent height="lg">
        <DrawerHeader>
          <DrawerTitle>만들 유형과 문제 수를 선택해주세요</DrawerTitle>
        </DrawerHeader>

        <div className="py-10 flex gap-3">
          <button
            className={cn(
              'flex-1 p-4 aspect-[16/12] rounded-[16px] border border-outline flex-center flex-col  gap-1',
              'hover:bg-info hover:border-blue-300',
              quizType === 'MULTIPLE_CHOICE' && 'bg-info border-blue-300',
            )}
            onClick={() => setQuizType('MULTIPLE_CHOICE')}
          >
            <ImgMultiple className="size-[64px]" />
            <Text typo="subtitle-1-bold" color="primary">
              객관식
            </Text>
          </button>
          <button
            className={cn(
              'flex-1 p-4 aspect-[16/12] rounded-[16px] border border-outline flex-center flex-col gap-1',
              'hover:bg-info hover:border-blue-300',
              quizType === 'MIX_UP' && 'bg-info border-blue-300',
            )}
            onClick={() => setQuizType('MIX_UP')}
          >
            <ImgMultiple className="size-[64px]" />
            <Text typo="subtitle-1-bold" color="primary">
              O/X
            </Text>
          </button>
        </div>

        <div className="py-5 grid gap-[32px]">
          <div className="grid gap-1 text-center">
            <Text typo="body-2-medium" color="sub">
              만들 문제 수
            </Text>
            <Text typo="h2" color="accent">
              {star} 문제
            </Text>
          </div>
          <div className="relative">
            <Slider
              value={[Number(star)]}
              step={1}
              onValueChange={(value: number[]) => setStar(String(value[0]))}
              min={DOCUMENT_MIN_QUIZ_COUNT}
              max={DOCUMENT_MAX_QUIZ_COUNT}
            />
            <Text typo="body-2-medium" color="sub" className="absolute top-5 left-0">
              {DOCUMENT_MIN_QUIZ_COUNT} 문제
            </Text>
            <Text typo="body-2-medium" color="sub" className="absolute top-5 right-0">
              {DOCUMENT_MAX_QUIZ_COUNT} 문제
            </Text>
          </div>

          <div className="absolute bottom-0 w-[calc(100%-32px)] pb-12">
            <Text typo="body-1-medium" color="sub" className="pt-[14px] pb-3 text-center">
              현재 가진 별: {10}개
            </Text>
            <Button variant="special" onClick={() => handleCreateDocument()}>
              <div className="flex-center gap-1">
                <span>만들기</span>

                <div className="py-px px-2 flex items-center gap-[4.3px] rounded-full bg-[#D3DCE433]/80">
                  <ImgStar className="size-[16px]" />
                  <Text typo="body-1-medium" color="white">
                    {10}
                  </Text>
                </div>
              </div>
            </Button>
          </div>
        </div>
      </DrawerContent>
      <div></div>
    </Drawer>
  )
}
