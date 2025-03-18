import { IcFile, IcNote, IcNotion } from '@/shared/assets/icon'
import { cn } from '@/shared/lib/utils'

interface Props {
  // type: Document.ItemInList['documentType']
  // type: 'FILE' | 'TEXT' | 'NOTION'
  type: 'TEXT' | 'FILE'
  containerClassName?: HTMLElement['className']
  iconClassName?: HTMLElement['className']
}

export const NoteIcon = ({ type, containerClassName, iconClassName }: Props) => {
  if (type === 'TEXT') {
    return (
      <div className={cn('flex-center size-[36px] shrink-0 rounded-full bg-orange text-inverse', containerClassName)}>
        <IcNote className={cn('size-[20px]', iconClassName)} />
      </div>
    )
  }

  if (type === 'FILE') {
    return (
      <div className={cn('flex-center size-[36px] shrink-0 rounded-full bg-blue text-inverse', containerClassName)}>
        <IcFile className={cn('size-[20px]', iconClassName)} />
      </div>
    )
  }

  if (type === 'NOTION') {
    return (
      <div
        className={cn(
          'flex-center size-[36px] shrink-0 rounded-full border border-border-divider bg-surface-1 text-primary',
          containerClassName,
        )}
      >
        <IcNotion className={cn('size-[20px]', iconClassName)} />
      </div>
    )
  }

  // default
  return (
    <div
      className={cn(
        'flex-center size-[36px] shrink-0 rounded-full bg-fill-secondary-orange text-text-primary-inverse',
        containerClassName,
      )}
    >
      <IcNote className={cn('size-[20px]', iconClassName)} />
    </div>
  )
}
