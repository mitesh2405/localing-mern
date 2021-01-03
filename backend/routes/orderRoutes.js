import express from 'express'
import { protect, admin } from '../middleware/authMiddleware.js'
import { addorderItems, getorderById, updateOrderToPay, getMyOrders, getOrders, updateOrderTodelivered } from '../controllers/orderController.js'
const router = express.Router()

router.route('/').post(protect, addorderItems).get(protect, admin, getOrders)
router.route('/myorders').get(protect, getMyOrders)
router.route('/:id').get(protect, getorderById)
router.route('/:id/pay').put(protect, updateOrderToPay)
router.route('/:id/deliver').put(protect, admin, updateOrderTodelivered)

export default router