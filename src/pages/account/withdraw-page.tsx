import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import WithdrawForm from '@/features/withdraw/ui/withdraw-form'

import { BackButton } from '@/shared/components/buttons/back-button'
import { Header } from '@/shared/components/header'
import { Text } from '@/shared/components/ui/text'

const WithdrawPage = () => {
  return (
    <>
      <Header left={<BackButton />} title="회원탈퇴" />

      <HeaderOffsetLayout className="overflow-x-hidden w-full flex flex-col">
        <div className="px-[16px]">
          <Text typo="h4" className="pb-[8px] pt-[20px]">
            픽토스님이 떠나시는 이유를 알려주세요
          </Text>
          <Text typo="body-1-medium" color="sub">
            주신 의견을 통해 더 나은 서비스를 만들 수 있도록 노력할게요
          </Text>
        </div>

        <WithdrawForm />
      </HeaderOffsetLayout>
    </>
  )
}

export default withHOC(WithdrawPage, {})
