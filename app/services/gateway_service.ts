import logger from '@adonisjs/core/services/logger'

import Gateway from '../models/gateway_model.ts'
import GatewayFactory from '../factories/gateway_factory.ts'
import type { TransactionData } from '../interfaces/gateway_interface.ts'
import type { GatewayTransactionResult } from '../interfaces/gateway_interface.ts'

export default class GatewayService {
  async collectPayment(data: TransactionData): Promise<GatewayTransactionResult> {
    const gateways = await this.getActiveGateways()

    for (const gateway of gateways) {
      try {
        const gatewayClient = GatewayFactory.create(gateway.name)

        const result = await gatewayClient.createTransaction(data)

        return {
          success: true,
          gateway: gateway.id,
          result,
        }
      } catch (error) {
        logger.error(`Gateway ${gateway.name} falhou`, error)
        continue
      }
    }

    throw new Error('Todos os gateways falharam')
  }

  private async getActiveGateways() {
    return Gateway.query().where('is_active', true).orderBy('priority', 'asc')
  }
}
