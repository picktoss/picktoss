import { cn } from '@/shared/lib/utils'

const FixedBottom = ({ children, className }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        'fixed bottom-0 right-1/2 translate-x-1/2 z-50 h-fit w-full max-w-xl bg-white px-[16px] pt-[14px] pb-[24px] items-start',
        className,
      )}
    >
      {children}
    </div>
  )
}

export default FixedBottom
