import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export const useInstallPWA = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setInstallPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener)
    }
  }, [])

  const handleInstallClick = async () => {
    if (installPrompt) {
      try {
        await installPrompt.prompt()
        const result = await installPrompt.userChoice

        if (result.outcome === 'accepted') {
          console.log('앱 설치 승인')
        } else {
          console.log('앱 설치 거부')
        }

        setIsInstallable(false)
      } catch (error) {
        // 추가 폴백 메커니즘
        console.error('설치 중 오류 발생', error)

        alert(
          '앱 설치 과정에서 오류가 발생했습니다. 다시 시도해주세요. 문제가 반복될 경우 브라우저의 ⋮ (더보기) 버튼 혹은 공유 버튼을 클릭 후 "홈 화면에 추가" 옵션을 클릭하시면 앱 설치가 가능합니다.',
        )
        // 안드로이드 대응 (play store 앱 설치 링크로 이동하는 코드 - 추후 앱 등록 시 사용)
        // if (/Android/i.test(navigator.userAgent)) {
        //   window.location.href =
        //     'intent:#Intent;action=android.intent.action.VIEW;' + `package=${getPackageName()};end`
        // }
      }
    }
  }

  // 패키지명 동적 추출
  // const getPackageName = () => {
  //   const manifest = document.querySelector('link[rel="manifest"]')
  //   return manifest ? new URL(manifest.getAttribute('href') || '').searchParams.get('package') : ''
  // }

  return { isInstallable, handleInstallClick }
}
