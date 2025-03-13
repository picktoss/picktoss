import { useMutation } from "@tanstack/react-query"
import { saveFcmToken, sendFcmMessage } from "./index"
import { FCM_KEYS } from "./config"

export const useSaveFcmToken = () => {
  return useMutation({
    mutationKey: FCM_KEYS.postToken,
    mutationFn: ({ data }: { data: Parameters<typeof saveFcmToken>[0]["data"] }) => saveFcmToken({ data }),
  })
}

export const useSendFcmMessage = () => {
  return useMutation({
    mutationKey: FCM_KEYS.postSendMessage,
    mutationFn: ({ data }: { data: Parameters<typeof sendFcmMessage>[0]["data"] }) => sendFcmMessage({ data }),
  })
}
