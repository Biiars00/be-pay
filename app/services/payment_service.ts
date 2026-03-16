import Product from '../models/product_model.ts'
import GatewayService from './gateway_service.ts'
import TransactionRepository from '../repositories/transaction_repository.ts'

import type { PurchaseProduct, PurchaseData } from '../interfaces/payment_interface.ts'
import type { GatewayPaymentResult } from '../interfaces/gateway_interface.ts'

export default class PaymentService {
  constructor(
    private gatewayService = new GatewayService(),
    private transactionRepository = new TransactionRepository()
  ) {}

  async purchase(data: PurchaseData) {
    const totalAmount = await this.calculateTotal(data.products)

    const paymentResult = await this.processGatewayPayment(data, totalAmount)

    const transaction = await this.createTransactionRecord(data, paymentResult, totalAmount)

    await this.attachProductsToTransaction(transaction.id, data.products)

    return transaction
  }

  private async calculateTotal(products: PurchaseProduct[]): Promise<number> {
    let total = 0

    for (const item of products) {
      const product = await Product.find(item.product_id)

      if (!product) {
        throw new Error(`Product ${item.product_id} not found`)
      }

      total += product.amount * item.quantity
    }

    return total
  }

  private async processGatewayPayment(
    data: PurchaseData,
    amount: number
  ): Promise<GatewayPaymentResult> {
    try {
      return this.gatewayService.collectPayment({
        amount,
        name: data.name,
        email: data.email,
        cardNumber: data.cardNumber,
        cvv: data.cvv,
      })
    } catch (error) {
      throw new Error(`Payment processing failed: ${error.message}`)
    }
  }

  private async createTransactionRecord(
    data: PurchaseData,
    payment: GatewayPaymentResult,
    amount: number
  ) {
    try {
      return this.transactionRepository.create({
        clientName: data.name,
        clientEmail: data.email,
        gatewayId: payment.gateway,
        externalId: payment.result.id,
        amount,
        status: 'success',
        cardLastNumbers: data.cardNumber.slice(-4),
      })
    } catch (error) {
      throw new Error(`Failed to create transaction record: ${error.message}`)
    }
  }

  private async attachProductsToTransaction(transactionId: number, products: PurchaseProduct[]) {
    try {
      return this.transactionRepository.attachProducts(transactionId, products)
    } catch (error) {
      throw new Error(`Failed to attach products to transaction: ${error.message}`)
    }
  }
}
