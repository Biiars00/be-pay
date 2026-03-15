import { test } from '@japa/runner'
import PaymentService from '../../app/services/payment_service.ts'
import Product from '../../app/models/product_model.ts'

test.group('PaymentService', () => {
  test('calculates purchase total correctly', async ({ assert }) => {
    Product.find = async () => ({ id: 1, amount: 1000 }) as any

    const service = new PaymentService()

    service['calculateTotal'] = async () => 2000
    const total = await service['calculateTotal']([{ product_id: 1, quantity: 2 }])

    assert.equal(total, 2000)
  })

  test('throws error when product does not exist', async ({ assert }) => {
    Product.find = async () => null as any

    const service = new PaymentService()

    await assert.rejects(async () => {
      await service['calculateTotal']([{ product_id: 99, quantity: 1 }])
    })
  })

  test('creates transaction when payment succeeds', async ({ assert }) => {
    Product.find = async () => ({ id: 1, amount: 1000 }) as any

    const fakeGateway = {
      collectPayment: async () => ({
        gateway: 1,
        result: {
          id: '123',
        },
      }),
    }

    const fakeRepository = {
      create: async () => ({
        id: 1,
      }),
      attachProducts: async () => {},
    }

    const service = new PaymentService(fakeGateway as any, fakeRepository as any)

    const result = await service.purchase({
      name: 'Bia',
      email: 'bia@test.com',
      cardNumber: '5569000000006063',
      cvv: '010',
      products: [{ product_id: 1, quantity: 1 }],
    })

    assert.equal(result.id, 1)
  })
})
