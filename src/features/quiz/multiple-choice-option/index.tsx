import * as React from 'react'

import { type VariantProps, cva } from 'class-variance-authority'
import { CheckIcon, XIcon } from 'lucide-react'

import { cn } from '@/shared/lib/utils'

const multipleChoiceOptionVariants = cva(
  'relative flex items-center cursor-pointer gap-3 typo-subtitle-2-medium text-secondary bg-base-1 border-outline rounded-[16px] border py-3 px-[10px] transition-all',
  {
    variants: {
      state: {
        default: 'hover:bg-active',
        correct: 'bg-correct border-correct text-correct',
        incorrect: 'bg-disabled text-disabled',
        disabled: 'text-disabled bg-disabled',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  },
)

export interface MultipleChoiceOptionProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof multipleChoiceOptionVariants> {
  index: number
  content: string
  selectable?: boolean
}

export const MultipleChoiceOption = ({
  className,
  state,
  index,
  content,
  selectable = true,
  ...props
}: MultipleChoiceOptionProps) => {
  return (
    <div className={cn(multipleChoiceOptionVariants({ state, className }), !selectable && 'cursor-default')} {...props}>
      {(state === 'default' || state === 'disabled') && (
        <div
          className={cn(
            'flex items-center justify-center rounded-full bg-gray-100 text-gray-900 size-[32px]',
            state === 'disabled' && 'text-disabled bg-base-3',
          )}
        >
          <span className="typo-button-3">{String.fromCharCode(65 + index)}</span>
        </div>
      )}
      {state === 'correct' && (
        <div className="flex items-center justify-center rounded-full bg-green-500 text-white size-[32px]">
          <CheckIcon className="size-5" />
        </div>
      )}
      {state === 'incorrect' && (
        <div className="flex items-center justify-center rounded-full bg-red-500 text-white size-[32px]">
          <XIcon className="size-5" />
        </div>
      )}
      <span className="typo-body-1-medium flex-1">{content}</span>
    </div>
  )
}
