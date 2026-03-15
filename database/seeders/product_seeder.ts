import Product from '../../app/models/product_model.ts'

export default class ProductSeeder {
  async run() {
    await Product.createMany([
      {
        name: 'Notebook',
        amount: 350000,
      },
      {
        name: 'Mouse',
        amount: 5000,
      },
      {
        name: 'Teclado',
        amount: 12000,
      },
    ])
  }
}
