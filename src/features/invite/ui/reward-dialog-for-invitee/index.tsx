import { useRewardForInviteCode } from '@/entities/auth/api/hooks'

import { ImgStar } from '@/shared/assets/images'
import { Button } from '@/shared/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/components/ui/dialog'
import { Text } from '@/shared/components/ui/text'
import { removeLocalStorageItem } from '@/shared/lib/storage/lib'

const RewardDialogForInvitee = ({
  open,
  onOpenChange,
  inviteCode,
  userName,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  inviteCode: string
  userName: string
}) => {
  const isSpecial = inviteCode === 'KONKUK' || inviteCode === 'SANGMYUNG'

  const { mutate: rewardForInviteCode } = useRewardForInviteCode()

  const handleReward = () => {
    rewardForInviteCode(
      { data: { inviteCode } },
      {
        onSuccess: () => {
          removeLocalStorageItem('inviteCode')
          removeLocalStorageItem('checkRewardDialog')
          onOpenChange(false)
        },
        onError: (error) => {
          console.error('보상 지급 실패:', error)
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {isSpecial ? (
        <RewardDialogContentForSpecial userName={userName} handleReward={handleReward} />
      ) : (
        <RewardDialogContentForInvitee userName={userName} handleReward={handleReward} />
      )}
    </Dialog>
  )
}

export default RewardDialogForInvitee

const RewardDialogContentForInvitee = ({ userName, handleReward }: { userName: string; handleReward: () => void }) => {
  return (
    <DialogContent
      onPointerDownOutside={(e) => e.preventDefault()}
      className="pt-[32px] px-[24px] pb-[20px] w-[308px] flex flex-col gap-[32px]"
    >
      <div className="w-full flex flex-col gap-[16px]">
        <div className="w-full flex-center">
          <div className="relative size-[120px]">
            <ImgStar className="size-[120px]" />

            <div className="absolute bottom-[11px] right-[4px] bg-inverse text-inverse px-[8px] py-[2px] rounded-full">
              x50
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[8px]">
          <DialogTitle className="typo-h4 text-center">추가 별 지급</DialogTitle>
          <DialogDescription className="typo-subtitle-2-medium text-sub text-center">
            초대장을 받으신 {userName}님께 <br />별{' '}
            <Text as={'span'} typo="subtitle-2-medium" color="accent">
              50개
            </Text>
            를 추가로 드려요
          </DialogDescription>
        </div>
      </div>

      <Button onClick={handleReward} className="w-full">
        받기
      </Button>
    </DialogContent>
  )
}

const RewardDialogContentForSpecial = ({ userName, handleReward }: { userName: string; handleReward: () => void }) => {
  return (
    <DialogContent
      onPointerDownOutside={(e) => e.preventDefault()}
      className="pt-[32px] px-[24px] pb-[20px] w-[308px] flex flex-col gap-[32px]"
    >
      <div className="w-full flex flex-col gap-[16px]">
        <div className="w-full flex-center">
          <div className="relative size-[120px]">
            <ImgStar className="size-[120px]" />

            <div className="absolute bottom-[11px] right-[4px] bg-inverse text-inverse px-[8px] py-[2px] rounded-full">
              x1000
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[8px]">
          <DialogTitle className="typo-h4 text-center">환영해요, {userName}님!</DialogTitle>
          <DialogDescription className="typo-subtitle-2-medium text-sub text-center">
            특별 가입 혜택인 <br />별{' '}
            <Text as={'span'} typo="subtitle-2-medium" color="accent">
              1000개
            </Text>
            가 도착했어요
          </DialogDescription>
        </div>
      </div>

      <Button onClick={handleReward} className="w-full">
        받기
      </Button>
    </DialogContent>
  )
}
