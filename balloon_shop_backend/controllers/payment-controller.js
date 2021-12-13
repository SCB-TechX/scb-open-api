const { StatusCodes } = require("http-status-codes")
const paymentService = require('../services/payment-service')

module.exports.createDeeplink = async (req, res) => {
    try {
        const deeplink = await paymentService.createDeeplink(req.user, req.body)
        res.status(StatusCodes.OK).send(deeplink)
    } catch (err) {
        throw err;
    }
}

module.exports.paymentConfirmation = async (req, res) => {
    try {
        const transaction = await paymentService.paymentConfirmation(req.body)
        res.status(StatusCodes.OK).send(transaction)
    } catch (err) {
        throw err;
    }
}