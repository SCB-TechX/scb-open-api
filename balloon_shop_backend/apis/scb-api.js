const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const ApiResponseCodes = require('../constants/api-response-codes')

const RESOURCE_OWNER_ID = 'test_from_balloon_shop_backend'

module.exports.tokenV1 = async () => {
    try {
        const uuid = uuidv4()
        const response = await axios.post(
            process.env.SCB_API_ENDPOINT + '/v1/oauth/token',
            {
                applicationKey: process.env.SCB_API_KEY,
                applicationSecret: process.env.SCB_API_SECRET
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': 'EN',
                    'resourceOwnerId': RESOURCE_OWNER_ID,
                    'requestUId': uuid
                }
            })
        return response.data
    } catch (err) {
        throw { responseCode: ApiResponseCodes.REQUEST_SCB_TOKEN_FAIL }
    }
}

module.exports.createPaymentDeeplink = async (accessToken, req) => {
    try {
        const uuid = uuidv4()
        const response = await axios.post(
            process.env.SCB_API_ENDPOINT + '/v3/deeplink/transactions',
            {
                transactionType: 'PURCHASE',
                transactionSubType: ['BP'],
                sessionValidityPeriod: 600,
                billPayment: {
                    paymentAmount: req.amount,
                    accountTo: process.env.SCB_BILLER_ID,
                    ref1: req.product,
                    ref2: req.transactionRef,
                    ref3: process.env.SCB_BILLER_REF3_PREFIX
                },
                merchantMetaData: {
                    callbackUrl: 'io.scbtechx.balloonShop://result',
                    merchantInfo: {
                        name: 'Balloon Shop'
                    }
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken,
                    'Accept-Language': 'EN',
                    'resourceOwnerId': req.user._id.toString(),
                    'requestUId': uuid,
                    'channel': 'scbeasy'
                }
            })
        return response.data;
    } catch (err) {
        console.log(err.response.data)
        throw { responseCode: ApiResponseCodes.REQUEST_SCB_CREATE_DEEPLINK_FAIL }
    }
}

module.exports.createPaymentQr = async (accessToken, req) => {
    try {
        const uuid = uuidv4()
        const response = await axios.post(
            process.env.SCB_API_ENDPOINT + '/v1/payment/qrcode/create',
            {
                qrType: "PPCS",
                ppType: "BILLERID",
                ppId: process.env.SCB_BILLER_ID,
                amount: req.amount,
                ref1: req.product,
                ref2: req.transactionRef,
                ref3: process.env.SCB_BILLER_REF3_PREFIX,
                merchantId: process.env.SCB_MERCHANT_ID,
                terminalId: process.env.SCB_MERCHANT_TERMINAL_ID,
                invoice: 'INVOICE',
                csExtExpiryTime: 60
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken,
                    'Accept-Language': 'EN',
                    'resourceOwnerId': req.user._id.toString(),
                    'requestUId': uuid,
                }
            })
        return response.data;
    } catch (err) {
        console.log(err.response.data)
        throw { responseCode: ApiResponseCodes.REQUEST_SCB_CREATE_QR_FAIL }
    }
}