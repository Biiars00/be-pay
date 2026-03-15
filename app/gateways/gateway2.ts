import axios from 'axios'
import env from '#start/env'

import type {
  GatewayInterface,
  TransactionData,
  GatewayResponse,
} from '../interfaces/gateway_interface.ts'

export default class Gateway2 implements GatewayInterface {
  private baseUrl: string = env.get('GATEWAY2_URL') || ''
  private token: string = env.get('GATEWAY_AUTH_TOKEN') || ''
  private secret: string = env.get('GATEWAY_AUTH_SECRET') || ''

  async createTransaction(data: TransactionData): Promise<GatewayResponse> {
    const payload = {
      valor: data.amount,
      nome: data.name,
      email: data.email,
      numeroCartao: data.cardNumber,
      cvv: data.cvv,
    }

    const response = await axios.post<{ id: string }>(`${this.baseUrl}/transacoes`, payload, {
      headers: {
        'Gateway-Auth-Token': this.token,
        'Gateway-Auth-Secret': this.secret,
      },
    })

    return {
      id: response.data.id,
    }
  }

  async refundTransaction(id: string): Promise<boolean> {
    await axios.post(
      `${this.baseUrl}/transacoes/reembolso`,
      { id },
      {
        headers: {
          'Gateway-Auth-Token': this.token,
          'Gateway-Auth-Secret': this.secret,
        },
      }
    )

    return true
  }
}
