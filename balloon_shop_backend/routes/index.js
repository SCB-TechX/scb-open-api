const express = require('express')
const router = express.Router()

const authenticateJwt = require('../middlewares/auth-jwt-middleware')

const authController = require('../controllers/auth-controller')
const paymentController = require('../controllers/payment-controller')
const productController = require('../controllers/product-controller')

const asyncWrap = fn =>
    function asyncUtilWrap(req, res, next, ...args) {
        const fnReturn = fn(req, res, next, ...args)
        return Promise.resolve(fnReturn).catch(next)
    }

router.post('/token', asyncWrap(authController.token))

router.post('/payment/deeplink', authenticateJwt, asyncWrap(paymentController.createDeeplink))
router.post('/payment/qr', authenticateJwt, asyncWrap(paymentController.createQr))
router.post('/payment/confirmation', asyncWrap(paymentController.paymentConfirmation))

router.get('/products', authenticateJwt, asyncWrap(productController.getProducts))
// router.post('/products', asyncWrap(productController.createProduct))
// router.delete('/products/:id', asyncWrap(productController.deleteProduct))

module.exports = router