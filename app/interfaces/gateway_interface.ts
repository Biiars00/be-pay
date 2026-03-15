export interface TransactionData {
  amount: number
  name: string
  email: string
  cardNumber: string
  cvv: string
}

export interface GatewayResponse {
  id: string
}

export interface GatewayTransactionResult {
  success: boolean
  gateway: number
  result: {
    id: string
  }
}

export interface GatewayPaymentResult {
  gateway: number
  result: {
    id: string
  }
}

export interface GatewayInterface {
  createTransaction(data: TransactionData): Promise<GatewayResponse>
  refundTransaction(id: string): Promise<any>
}
