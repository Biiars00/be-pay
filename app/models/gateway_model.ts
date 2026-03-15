import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'

import Transaction from './transaction_model.ts'

export default class Gateway extends BaseModel {
  public static table = 'gateways'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare isActive: boolean

  @column()
  declare priority: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Transaction, {
    foreignKey: 'gatewayId',
  })
  declare transactions: HasMany<typeof Transaction>
}
