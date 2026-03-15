import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Transaction from './transaction_model.ts'
import Product from './product_model.ts'

export default class TransactionProduct extends BaseModel {
  public static table = 'transaction_products'
  public static timestamps = false

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare transactionId: number

  @column()
  declare productId: number

  @column()
  declare quantity: number

  @belongsTo(() => Transaction, {
    foreignKey: 'transactionId',
  })
  declare transaction: BelongsTo<typeof Transaction>

  @belongsTo(() => Product, {
    foreignKey: 'productId',
  })
  declare product: BelongsTo<typeof Product>
}
