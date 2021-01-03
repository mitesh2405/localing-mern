import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'

// @description: Create new order
// @route: GET /api/orders
// @access: Private
const addorderItems = asyncHandler(async (req, res) => {
    const { orderItems, shippingaddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body
    if (orderItems && orderItems.length === 0) {
        res.status(400)
        throw new Error('No Order Items')
        return
    } else {
        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingaddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        })
        const createdOrder = await order.save()
        res.status(201).json(createdOrder)
    }
})

// @description: get Order by Id
// @route: GET /api/orders/:id
// @access: Private
const getorderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')
    if (order) {
        res.json(order)
    } else {
        res.status(404)
        throw new Error('Order Not Found')
    }

})

// @description: Update order to paid
// @route: GET /api/orders/:id/pay
// @access: Private
const updateOrderToPay = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
    if (order) {
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address
        }
        const updatedOrder = await order.save()
        res.json(updatedOrder)
    } else {
        res.status(404)
        throw new Error('Order Not Found')
    }

})

// @description: Update order to be delivered
// @route: GET /api/orders/:id/deliver
// @access: Private/Admin
const updateOrderTodelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
    if (order) {
        order.isDelivered = true
        order.deliveredAt = Date.now()
        const updatedOrder = await order.save()
        res.json(updatedOrder)
    } else {
        res.status(404)
        throw new Error('Order Not Found')
    }

})

// @description: Get Logged In User Orders
// @route: GET /api/orders/myorders
// @access: Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user })
    res.json(orders)
})

// @description: Get all Orders
// @route: GET /api/orders/
// @access: Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name')
    res.json(orders)
})

export {
    addorderItems,
    getorderById,
    updateOrderToPay,
    getMyOrders,
    getOrders,
    updateOrderTodelivered
}