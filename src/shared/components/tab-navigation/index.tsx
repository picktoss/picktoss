import { IcDaily, IcExplore, IcLibrary } from '@/shared/assets/icon'
import { Text } from '@/shared/components/ui/text'
import { usePWA } from '@/shared/hooks/use-pwa'
import { RoutePath } from '@/shared/lib/router'
import { useRouter } from '@/shared/lib/router'
import { cn } from '@/shared/lib/utils'

const navItems = [
  {
    label: '데일리',
    to: RoutePath.root,
    icon: <IcDaily />,
  },
  {
    label: '탐험',
    to: RoutePath.explore,
    icon: <IcExplore />,
  },
  {
    label: '도서관',
    to: RoutePath.library,
    icon: <IcLibrary />,
  },
] as const

interface TabNavigationProps {
  activeTab: (typeof navItems)[number]['label']
  className?: HTMLElement['className']
}

export const TabNavigation = ({ activeTab = '데일리', className }: TabNavigationProps) => {
  return (
    <div className={cn('h-tab-navigation bg-surface-2 fixed bottom-0 w-full max-w-xl', className)}>
      <div className="mx-auto flex max-w-[500px] justify-between px-[52px] pt-2.5">
        {navItems.map((item) => (
          <NavItem key={item.label} {...item} active={item.label === activeTab} />
        ))}
      </div>
    </div>
  )
}

interface NavItemProps {
  label: string
  to: (typeof navItems)[number]['to']
  icon: React.ReactNode
  active?: boolean
}

const NavItem = ({ to, icon, label, active = false }: NavItemProps) => {
  const router = useRouter()
  const { isPWA } = usePWA()

  const handleNavigation = () => {
    if (isPWA) {
      router.replace(to)
    } else {
      router.push(to)
    }
  }

  return (
    <button
      onClick={handleNavigation}
      className={cn(
        'flex-center text-icon-sub h-[46px] w-[48px] flex-col gap-1 [&_svg]:size-6',
        active && 'text-primary',
      )}
    >
      {icon}
      <Text typo="body-2-medium" color={active ? 'primary' : 'sub'}>
        {label}
      </Text>
    </button>
  )
}
