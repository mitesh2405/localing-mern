import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

// @description: Fetch All Products
// @route: GET /api/products
// @access: Public
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = 8
    const page = Number(req.query.pageNumber) || 1
    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,
            $options: 'i'
        }
    } : {}
    const count = await Product.countDocuments({ ...keyword })
    const products = await Product.find({ ...keyword }).limit(pageSize).skip(pageSize * (page - 1))
    res.json({ products, page, pages: Math.ceil(count / pageSize) })
})


// @description: Fetch Single Product
// @route: GET /api/products/:id
// @access: Public
const getProductByID = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (product) {
        res.send(product)
    } else {
        res.status(404)
        throw new Error('Product Not Found')
    }
})

// @description: Delete a Product
// @route: DELETE /api/products/:id
// @access: Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (product) {
        await product.remove()
        res.json({
            message: "Product Removed"
        })
    } else {
        res.status(404)
        throw new Error('Product Not Found')
    }
})

// @description: Create a Product
// @route: POSt /api/products
// @access: Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: "Product Name",
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Product Brand',
        category: 'Product Category',
        countInStock: 0,
        numReviews: 0,
        description: 'Product Description'
    })
    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
})

// @description: Update a Product
// @route: PUT /api/products/:id
// @access: Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, description, image, brand, category, countInStock } = req.body
    const product = await Product.findById(req.params.id)
    if (product) {
        product.name = name
        product.price = price
        product.description = description
        product.image = image
        product.brand = brand
        product.category = category
        product.countInStock = countInStock
        const updatedProduct = await product.save()
        res.json(updatedProduct)
    } else {
        res.status(404)
        throw new Error("Product Not Found")
    }
})

// @description: Create New Review
// @route: PUT /api/products/:id/reviews
// @access: Private
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body
    const product = await Product.findById(req.params.id)
    if (product) {
        const alreadyreviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString())
        if (alreadyreviewed) {
            res.status(400)
            throw new Error('Product Already Reviewed')
        }
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        }
        product.reviews.push(review)
        product.numReviews = product.reviews.length
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length
        await product.save()
        res.status(201).json({ message: 'Review Added' })
    } else {
        res.status(404)
        throw new Error("Product Not Found")
    }
})

// @description: get Top Rated Products
// @route: PUT /api/products/top
// @access: Public
const getTopProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3)
    res.json(products)
})



export {
    getProducts,
    getProductByID,
    deleteProduct,
    createProduct,
    updateProduct,
    createProductReview,
    getTopProducts
}