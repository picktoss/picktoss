import { IcControl } from '@/shared/assets/icon'
import { AlertDrawer } from '@/shared/components/drawers/alert-drawer'
import { Button } from '@/shared/components/ui/button'
import { Label } from '@/shared/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'
import { Text } from '@/shared/components/ui/text'
import { useQueryParam } from '@/shared/lib/router'

export const QuizSettingDrawer = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const [displayQuizType, setDisplayQuizType] = useQueryParam('/', 'displayQuizType')

  return (
    <AlertDrawer
      open={open}
      onOpenChange={onOpenChange}
      trigger={
        <button className="absolute top-4 right-4 p-2 rounded-[8px] border border-outline">
          <IcControl className="size-4 text-icon-secondary" />
        </button>
      }
      title="데일리 퀴즈 설정"
      hasClose
      height="lg"
      body={
        <div className="py-8">
          <form
            id="quiz-settings-form"
            onSubmit={(e) => {
              e.preventDefault()
              const value = (e.target as HTMLFormElement).quizType.value
              setDisplayQuizType(value)
              onOpenChange(false)
            }}
          >
            <div className="grid gap-2">
              <Text typo="subtitle-2-bold" color="secondary">
                문제 유형
              </Text>
              <div className="bg-surface-1 rounded-[12px] py-[10px] px-4">
                <RadioGroup name="quizType" defaultValue={displayQuizType}>
                  <Label className="flex items-center gap-3 w-full py-[10px]">
                    <RadioGroupItem value="ALL" />
                    <Text typo="subtitle-2-medium" color="primary">
                      전체
                    </Text>
                  </Label>
                  <Label className="flex items-center gap-3 w-full py-[10px]">
                    <RadioGroupItem value="MULTIPLE_CHOICE" />
                    <Text typo="subtitle-2-medium" color="primary">
                      객관식
                    </Text>
                  </Label>
                  <Label className="flex items-center gap-3 w-full py-[10px]">
                    <RadioGroupItem value="MIX_UP" />
                    <Text typo="subtitle-2-medium" color="primary">
                      O/X
                    </Text>
                  </Label>
                </RadioGroup>
              </div>
            </div>
          </form>
        </div>
      }
      footer={
        <div className="h-[114px] pt-[14px]">
          <Button type="submit" form="quiz-settings-form">
            적용하기
          </Button>
        </div>
      }
      contentClassName="bg-surface-2"
    />
  )
}
