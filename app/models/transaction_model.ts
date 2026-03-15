import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, belongsTo } from '@adonisjs/lucid/orm'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'

import TransactionProduct from './transaction_product_model.ts'
import Gateway from './gateway_model.ts'

type TransactionStatus = 'success' | 'failed' | 'pending'

export default class Transaction extends BaseModel {
  public static table = 'transactions'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare clientName: string

  @column()
  declare clientEmail: string

  @column()
  declare gatewayId: number | null

  @column()
  declare externalId: string | null

  @column()
  declare amount: number

  @column()
  declare status: TransactionStatus

  @column()
  declare cardLastNumbers: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => TransactionProduct, {
    foreignKey: 'transactionId',
  })
  declare transactionProducts: HasMany<typeof TransactionProduct>

  @belongsTo(() => Gateway, {
    foreignKey: 'gatewayId',
  })
  declare gateway: BelongsTo<typeof Gateway>
}
