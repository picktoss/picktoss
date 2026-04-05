import { ImgMegaphoneEmpty } from '@/shared/assets/images'
import { buttonVariants } from '@/shared/components/ui/button'
import { Text } from '@/shared/components/ui/text'
import { cn } from '@/shared/lib/utils'
import { useTranslation } from '@/shared/locales/use-translation'

const ServiceClosedPage = () => {
  const { t } = useTranslation()

  return (
    <div className="flex-center size-full flex-col gap-8 bg-surface-2">
      <div className="flex-center flex-col">
        <ImgMegaphoneEmpty className="size-24" />

        <div className="mt-4 flex flex-col items-center gap-2">
          <Text typo="subtitle-1-bold" className="text-center">
            {t('etc.service_ended.title')}
          </Text>
          <Text typo="body-1-medium" color="sub" className="text-center">
            {t('etc.service_ended.message1')} <br />
            {t('etc.service_ended.message2')}
          </Text>
        </div>
      </div>

      <a
        href="https://picktoss.framer.website/"
        target="_blank"
        rel="noopener noreferrer"
        className={cn(buttonVariants({ variant: 'primary', size: 'sm', className: 'w-fit' }))}
      >
        {t('etc.service_ended.introduction_button')}
      </a>
    </div>
  )
}

export default ServiceClosedPage
