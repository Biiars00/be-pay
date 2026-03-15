/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  payment: {
    store: typeof routes['payment.store']
  }
}
