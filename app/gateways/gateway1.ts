import axios from 'axios'
import env from '#start/env'

import type {
  GatewayInterface,
  TransactionData,
  GatewayResponse,
} from '../interfaces/gateway_interface.ts'

export default class Gateway1 implements GatewayInterface {
  private token: string | null = null

  private baseUrl: string = env.get('GATEWAY1_URL') || ''
  private email: string = env.get('EMAIL_AUTHENTICATE') || ''
  private authToken: string = env.get('TOKEN_AUTHENTICATE') || ''

  private async authenticate(): Promise<void> {
    const response = await axios.post<{ token: string }>(`${this.baseUrl}/login`, {
      email: this.email,
      token: this.authToken,
    })

    this.token = response.data.token
  }

  async createTransaction(data: TransactionData): Promise<GatewayResponse> {
    if (!this.token) {
      await this.authenticate()
    }

    const response = await axios.post<{ id: string }>(`${this.baseUrl}/transactions`, data, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    })

    return {
      id: response.data.id,
    }
  }

  async refundTransaction(id: string): Promise<boolean> {
    if (!this.token) {
      await this.authenticate()
    }

    await axios.post(
      `${this.baseUrl}/transactions/${id}/charge_back`,
      {},
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }
    )

    return true
  }
}
