import router from '@adonisjs/core/services/router'

const PaymentController = () => import('../app/controllers/payment_controller.ts')

router.post('/purchase', [PaymentController, 'store'])
