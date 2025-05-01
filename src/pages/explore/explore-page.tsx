import { useEffect, useRef, useState } from 'react'
import Marquee from 'react-fast-marquee'

import { motion } from 'framer-motion'
import SwiperCore from 'swiper'
import { Mousewheel } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { Category } from '@/entities/category/api'
import { useGetCategories } from '@/entities/category/api/hooks'
import { GetAllQuizzesDto } from '@/entities/quiz/api'

import { IcChevronRight, IcLibrary, IcLogo, IcProfile, IcSearch } from '@/shared/assets/icon'
import { ExploreQuizCard } from '@/shared/components/cards/explore-quiz-card'
import { Header } from '@/shared/components/header'
import { Chip } from '@/shared/components/ui/chip'
import { Text } from '@/shared/components/ui/text'
import { Link, useQueryParam } from '@/shared/lib/router'
import { cn } from '@/shared/lib/utils'

const exampleQuestions = [
  { emoji: '🪶', question: '숏 전략은 매수하는 전략이다' },
  { emoji: '👠 ', question: '프로세스는 무엇인가요?' },
  { emoji: '🪶', question: '숏 전략은 매수하는 전략이다' },
  { emoji: '👠 ', question: '프로세스는 무엇인가요?' },
  { emoji: '🪶', question: '숏 전략은 매수하는 전략이다' },
]

const quizzes = [
  {
    id: 0,
    name: 'picktoss',
    question: '데킬라의 주 원료는 멕시코 할리스코 주에 서식하는 옥수수인가요?',
    answer: 'correct',
    explanation: '데킬라의 주 원료는 멕시코 할리스코 주에 서식하는 옥수수',
    quizType: 'MIX_UP',
  },
  {
    id: 1,
    name: 'picktoss',
    question: '데킬라의 주 원료는 멕시코 할리스코 주에 서식하는 옥수수인가요?',
    answer: 'correct',
    explanation: '데킬라의 주 원료는 멕시코 할리스코 주에 서식하는 옥수수',
    quizType: 'MIX_UP',
  },
  {
    id: 2,
    name: 'picktoss',
    question: '데킬라의 주 원료는 멕시코 할리스코 주에 서식하는 옥수수인가요?',
    answer: 'correct',
    explanation: '데킬라의 주 원료는 멕시코 할리스코 주에 서식하는 옥수수',
    quizType: 'MIX_UP',
  },
] as GetAllQuizzesDto[]

const ExplorePage = () => {
  const { data } = useGetCategories()

  return (
    <>
      <Header
        className={cn('transition-all duration-300 ease-in-out', 'bg-surface-2 py-[9px] px-[8px]')}
        left={
          <button className="size-[40px] flex-center">
            <IcProfile className="size-[24px]" />
          </button>
        }
        right={
          <Link to={'/explore/search'} className="size-[40px] flex-center">
            <IcSearch className="size-[24px]" />
          </Link>
        }
        content={
          <div className="center">
            <IcLogo className="w-[102px] h-[26px]" />
          </div>
        }
      />

      <HeaderOffsetLayout>
        <div
          className="py-[55px] flex flex-col gap-[10px] bg-[radial-gradient(closest-side,_var(--tw-gradient-stops))]"
          style={{
            backgroundImage: 'radial-gradient(circle, var(--color-gray-100) 0%, var(--color-gray-50) 40%)',
          }}
        >
          <Marquee gradient={false} speed={20} direction="left">
            {exampleQuestions.map((item, index) => (
              <QuestionBox key={index} emoji={item.emoji} question={item.question} className="mr-[8px]" />
            ))}
          </Marquee>
          <Marquee gradient={false} speed={20} direction="right">
            {exampleQuestions.map((item, index) => (
              <QuestionBox key={index} emoji={item.emoji} question={item.question} className="mr-[8px]" />
            ))}
          </Marquee>
          <Marquee gradient={false} speed={20} direction="left">
            {exampleQuestions.map((item, index) => (
              <QuestionBox key={index} emoji={item.emoji} question={item.question} className="mr-[8px]" />
            ))}
          </Marquee>
        </div>

        <div className="pt-[56px]">
          <Text as="h2" typo="h3" className="px-[16px] mb-[12px]">
            실시간 퀴즈
          </Text>

          <ScrollableChips categories={data} />

          <button
            type="button"
            className="self-stretch h-[48px] w-full min-w-28 px-[24px] py-[12px] mt-[8px] bg-transparent inline-flex justify-between items-center"
          >
            <div className="flex-1 flex items-center">
              <div className="flex items-center gap-2">
                <IcLibrary className="size-[20px] text-icon-accent" />
                <Text typo="body-1-bold" color="secondary" className="w-fit shrink-0">
                  공개할 수 있는 퀴즈가{' '}
                  <Text as="span" typo="body-1-bold" color="accent">
                    3개
                  </Text>{' '}
                  있어요
                </Text>
              </div>
            </div>
            <IcChevronRight className="size-[16px] text-icon-secondary" />
          </button>

          <VerticalSwipeList />
          {/* <div className="sticky top-[calc(var(--header-height-safe)+46px)] w-full h-[calc(100vh-184px)] p-[16px] pt-[48px] flex flex-col items-center gap-[10px] overflow-hidden">
            <VerticalSwipeList />
          </div> */}
        </div>
      </HeaderOffsetLayout>
    </>
  )
}

export default withHOC(ExplorePage, {
  activeTab: '탐험',
  navClassName: 'border-t border-divider',
  backgroundClassName: 'bg-surface-2 h-fit',
})

function QuestionBox({
  emoji,
  question,
  className,
}: {
  emoji: string
  question: string
  className?: HTMLElement['className']
}) {
  return (
    <div
      className={cn('px-2.5 py-1.5 bg-base-1 rounded-lg inline-flex justify-center items-center gap-2.5', className)}
    >
      <div className="flex items-center gap-1">
        <Text typo="body-2-medium" color="secondary" className="leading-none">
          {emoji} {question}
        </Text>
      </div>
    </div>
  )
}

function ScrollableChips({ categories }: { categories?: Category[] }) {
  const [params, setParams] = useQueryParam('/explore')
  const activeCategory = params.category

  const setCategory = (categoryId: number) => {
    setParams({ ...params, category: categoryId })
  }

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault() // ✅ preventDefault 이제 가능
        el.scrollLeft += e.deltaY
      }
    }

    el.addEventListener('wheel', handleWheel, { passive: false }) // ✅ 핵심

    return () => {
      el.removeEventListener('wheel', handleWheel)
    }
  }, [])

  return (
    <div
      ref={scrollRef}
      className="sticky top-[var(--header-height-safe)] bg-base-2 flex gap-[6px] overflow-x-auto scrollbar-hide px-[8px] py-[8px]"
    >
      {/* 전체 */}
      <Chip
        variant={activeCategory === 0 ? 'selected' : 'darken'}
        left={activeCategory === 0 ? '💫' : undefined}
        onClick={() => setCategory(0)}
        className={cn('ml-[16px]')}
      >
        전체
      </Chip>

      {/* Chip 요소들 */}
      {categories &&
        categories.map((category, index) => (
          <Chip
            key={index}
            variant={category.id === activeCategory ? 'selected' : 'darken'}
            left={category.id === activeCategory ? category.emoji : undefined}
            onClick={() => setCategory(category.id)}
          >
            {category.name}
          </Chip>
        ))}
    </div>
  )
}

function VerticalSwipeList() {
  const [activeIndex, setActiveIndex] = useState(0)
  const swiperRef = useRef<SwiperCore>(null)
  const startYRef = useRef<number>(0)

  useEffect(() => {
    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        startYRef.current = event.touches[0].clientY
      }
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (startYRef.current !== null && event.touches.length > 0) {
        const currentY = event.touches[0].clientY
        const scrollingUp = currentY < startYRef.current
        const swiperTopOffset = swiperRef.current?.el?.getBoundingClientRect().top ?? 0
        updateSwiperLock(swiperTopOffset, scrollingUp)
      }
    }

    const handleWheel = (event: WheelEvent) => {
      const swiperTopOffset = swiperRef.current?.el?.getBoundingClientRect().top ?? 0
      const scrollingUp = event.deltaY < 0
      updateSwiperLock(swiperTopOffset, scrollingUp)
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: false })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [activeIndex])

  const updateSwiperLock = (swiperTopOffset: number, scrollingUp: boolean) => {
    if (!swiperRef.current) return

    const safeAreaInsetTop = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-top') || '0',
    )
    const isBeyond = swiperTopOffset > 150 + safeAreaInsetTop
    const isAtTop = activeIndex === 0

    if (isBeyond) {
      swiperRef.current.mousewheel.disable()
      swiperRef.current.allowTouchMove = false
    } else {
      if (isAtTop && scrollingUp) {
        swiperRef.current.mousewheel.disable()
        swiperRef.current.allowTouchMove = false
      } else {
        swiperRef.current.mousewheel.enable()
        swiperRef.current.allowTouchMove = true
      }
    }
  }

  return (
    <motion.div
      onPan={(_, info) => {
        const swiperTopOffset = swiperRef.current?.el?.getBoundingClientRect().top ?? 0
        const scrollingUp = info.delta.y < 0
        updateSwiperLock(swiperTopOffset, scrollingUp)
      }}
      className="sticky top-[calc(var(--header-height-safe)+46px)] w-full h-[calc(100vh-184px)] p-[16px] pt-[48px] flex flex-col items-center gap-[10px] overflow-hidden"
    >
      <Swiper
        direction="vertical"
        slidesPerView={1}
        spaceBetween={0.01}
        mousewheel={{
          forceToAxis: true,
          enabled: false, // 초기에 비활성화
        }}
        modules={[Mousewheel]}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        style={{ height: '500px', width: '100%', display: 'flex', justifyContent: 'center' }}
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <SwiperSlide key={index}>
            <ExploreQuizCard
              index={index}
              activeIndex={activeIndex}
              header={
                <ExploreQuizCard.Header
                  owner={'picktoss'}
                  isBookmarked={false}
                  onClickShare={() => {}}
                  onClickBookmark={() => {}}
                />
              }
              content={
                <ExploreQuizCard.Content
                  emoji={'🪶'}
                  title={'인지주의 심리학 관련 퀴즈 모음'}
                  category={'IT·개발'}
                  playedCount={345}
                  bookmarkCount={28}
                />
              }
              quizzes={
                <ExploreQuizCard.Quizzes
                  quizzes={quizzes}
                  totalQuizCount={quizzes.length}
                  onClickViewAllBtn={() => {}}
                />
              }
              footer={<ExploreQuizCard.Footer onClickStartQuiz={() => {}} />}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.div>
  )
}
