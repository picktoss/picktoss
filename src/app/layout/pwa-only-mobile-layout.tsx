import { isMobile } from 'react-device-detect'
import { Outlet } from 'react-router'

import { Button } from '@/shared/components/ui/button'
import { usePWA } from '@/shared/hooks/use-pwa'
import { useRouter } from '@/shared/lib/router'

export const PWAOnlyMobileLayout = () => {
  const router = useRouter()
  const { isPWA } = usePWA()

  if (isMobile && !isPWA) {
    return (
      <div className="center">
        <div>모바일 픽토스는 앱에서 만날 수 있어요</div>
        <Button onClick={() => router.replace('/collection')}>컬렉션으로 이동하기</Button>
        <Button onClick={() => router.replace('/install-guide')}>지금 앱에서 전부 이용하기</Button>
      </div>
    )
  }

  return <Outlet />
}
