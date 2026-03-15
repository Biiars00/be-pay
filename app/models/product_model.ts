import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'

import TransactionProduct from './transaction_product_model.ts'

export default class Product extends BaseModel {
  public static table = 'products'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare amount: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => TransactionProduct, {
    foreignKey: 'productId',
  })
  declare transactionProducts: HasMany<typeof TransactionProduct>
}
