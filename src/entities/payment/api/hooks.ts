import { useMutation } from "@tanstack/react-query"
import { verifyPayment, createPayments, cancelPayments } from "./index"
import { PAYMENT_KEYS } from "./config"

export const useVerifyPayment = () => {
  return useMutation({
    mutationKey: PAYMENT_KEYS.verifyPayment,
    mutationFn: ({ data }: { data: Parameters<typeof verifyPayment>[0]["data"] }) => verifyPayment({ data }),
  })
}

export const useCreatePayments = () => {
  return useMutation({
    mutationKey: PAYMENT_KEYS.createPayments,
    mutationFn: ({ data }: { data: Parameters<typeof createPayments>[0]["data"] }) => createPayments({ data }),
  })
}

export const useCancelPayments = () => {
  return useMutation({
    mutationKey: PAYMENT_KEYS.cancelPayments,
    mutationFn: () => cancelPayments(),
  })
}
