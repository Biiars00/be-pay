export interface PurchaseProduct {
  product_id: number
  quantity: number
}

export interface PurchaseData {
  name: string
  email: string
  cardNumber: string
  cvv: string
  products: PurchaseProduct[]
}
