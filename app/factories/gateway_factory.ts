import Gateway1 from '../gateways/gateway1.ts'
import Gateway2 from '../gateways/gateway2.ts'

import type { GatewayInterface } from '../interfaces/gateway_interface.ts'

export default class GatewayFactory {
  static create(name: string): GatewayInterface {
    switch (name) {
      case 'gateway1':
        return new Gateway1()

      case 'gateway2':
        return new Gateway2()

      default:
        throw new Error(`Gateway ${name} not supported`)
    }
  }
}
