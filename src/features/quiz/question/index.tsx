import { Tag } from '@/shared/components/ui/tag'
import { Text } from '@/shared/components/ui/text'
import { cn } from '@/shared/lib/utils'

interface QuestionProps extends React.HTMLAttributes<HTMLDivElement> {
  quizNumber?: number
  content: string
  originName?: string
  className?: string
}

export const Question = ({ content, quizNumber, originName, ...props }: QuestionProps) => {
  return (
    <div
      className={cn('flex flex-col gap-2', quizNumber && 'items-start', originName && 'items-center', props.className)}
      {...props}
    >
      {quizNumber != null && (
        <Text typo="h4" color="accent">
          Q{quizNumber}.
        </Text>
      )}
      {originName != null && <Tag size="md">{originName}</Tag>}
      {content}
    </div>
  )
}
