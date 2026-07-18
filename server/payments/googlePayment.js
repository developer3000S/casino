var express = require("express")
var bodyParser = require('body-parser')
var googlePayment = express.Router()
var jsonParser = bodyParser.json()

googlePayment.post("/api/google", jsonParser, (req, res, next) => {
    const { amount, products, description } = req.body

    if (!amount) {
        return res.json({ type: "google", result: "error", payload: 'no_money' })
    }

    // Mock successful Google Pay payment processing
    const mockPayload = {
        id: "ch_mock_gpay_" + Math.random().toString(36).substr(2, 9),
        amount: Math.round(amount * 100), // in cents
        created: Math.floor(Date.now() / 1000),
        description: description || "Mock Google Pay Payment",
        currency: "usd",
        payment_details: {
            type: "google_pay",
            products: products || []
        }
    }

    res.json({
        type: "google",
        result: "success",
        payload: mockPayload
    })
})

module.exports = googlePayment
