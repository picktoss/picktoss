import { client } from '@/shared/lib/axios/client'

import { FCM_ENDPOINTS } from './config'

// Fcm token 저장 요청
interface SaveFcmTokenRequest {
  fcmToken: string
}

export const saveFcmToken = async ({ data }: { data: SaveFcmTokenRequest }): Promise<void> => {
  const response = await client.post<void>(FCM_ENDPOINTS.postToken(), data)
  return response.data
}

// Fcm token 여부 조회
interface GetFcmTokenResponse {
  isToken: boolean
}

export const getFcmToken = async (): Promise<GetFcmTokenResponse> => {
  const response = await client.get<GetFcmTokenResponse>(FCM_ENDPOINTS.getToken)
  return response.data
}
