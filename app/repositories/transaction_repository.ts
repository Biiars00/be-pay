import Transaction from '../models/transaction_model.ts'
import TransactionProduct from '../models/transaction_product_model.ts'

type TransactionStatus = 'success' | 'failed' | 'pending'

interface CreateTransactionDTO {
  clientName: string
  clientEmail: string
  gatewayId: number | null
  externalId: string | null
  amount: number
  status: TransactionStatus
  cardLastNumbers: string
}

interface TransactionProductDTO {
  product_id: number
  quantity: number
}

export default class TransactionRepository {
  async create(data: CreateTransactionDTO) {
    return Transaction.create(data)
  }

  async attachProducts(transactionId: number, products: TransactionProductDTO[]) {
    const records = products.map((product) => ({
      transactionId,
      productId: product.product_id,
      quantity: product.quantity,
    }))

    return TransactionProduct.createMany(records)
  }
}
