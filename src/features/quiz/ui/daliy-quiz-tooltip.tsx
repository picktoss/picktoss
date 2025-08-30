import { useTranslation } from 'react-i18next'

import { ImgStar } from '@/shared/assets/images'
import { Text } from '@/shared/components/ui/text'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/ui/tooltip'
import { useAmplitude } from '@/shared/hooks/use-amplitude-context'
import { useRouter } from '@/shared/lib/router'

interface DailyQuizTooltipProps {
  todaySolvedDailyQuizCount: number
  consecutiveSolvedDailyQuizDays: number
}

export const DailyQuizTooltip = ({
  todaySolvedDailyQuizCount,
  consecutiveSolvedDailyQuizDays,
}: DailyQuizTooltipProps) => {
  const { trackEvent } = useAmplitude()
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <Tooltip
      open={
        // 연속일이 0이상일 때 혹은 보상 횟수를 표시할 때
        (consecutiveSolvedDailyQuizDays && consecutiveSolvedDailyQuizDays > 0) ||
        !!(todaySolvedDailyQuizCount && 10 - todaySolvedDailyQuizCount < 10 && 10 - todaySolvedDailyQuizCount > 0)
      }
    >
      <TooltipTrigger asChild>
        <button
          onClick={() => {
            trackEvent('daily_star_click')
            router.push('/account/my-star')
          }}
          className="p-1.5 flex-center"
        >
          <ImgStar className="size-[28px]" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="left" color="inverse" arrowPosition="right">
        {todaySolvedDailyQuizCount && 10 - todaySolvedDailyQuizCount > 0 ? (
          <Text typo="body-2-medium">
            <span className="text-accent">
              {10 - todaySolvedDailyQuizCount}
              {t('daily.quiz_tooltip.question')}
            </span>{' '}
            <span>{t('daily.quiz_tooltip.solve_more_message')}!</span>
          </Text>
        ) : (
          <>
            {consecutiveSolvedDailyQuizDays && (
              <Text typo="body-2-medium">
                {t('daily.quiz_tooltip.consecutive_days_complete', { count: consecutiveSolvedDailyQuizDays })}
              </Text>
            )}
          </>
        )}
      </TooltipContent>
    </Tooltip>
  )
}
