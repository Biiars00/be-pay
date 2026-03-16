import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import PaymentService from '../services/payment_service.ts'
import { PaymentValidator } from '../validators/payment_validator.ts'

export default class PaymentController {
  private paymentService = new PaymentService()

  async store({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(PaymentValidator)

      const transaction = await this.paymentService.purchase(payload)

      return response.created(transaction)
    } catch (error) {
      logger.error('Failed to create payment', error)
      return response.badRequest({ error: error.message })
    }
  }
}
