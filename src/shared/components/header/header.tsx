import { cn } from '@/shared/lib/utils'

import { Text } from '../ui/text'

interface HeaderProps {
  left?: React.ReactNode
  title?: React.ReactNode
  content?: React.ReactNode
}

export const Header = ({ left, title, content }: HeaderProps) => {
  return (
    <div className={cn('flex items-center h-[54px] relative', left ? 'pl-2 pr-4' : 'px-4')}>
      {left && left}
      {title && (
        <div className="center">
          <Text typo="subtitle-2-medium" color="primary">
            {title}
          </Text>
        </div>
      )}
      {content && <div className="flex-1">{content}</div>}
    </div>
  )
}
