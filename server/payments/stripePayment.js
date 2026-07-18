var express = require("express")
var bodyParser = require('body-parser')
var stripePayment = express.Router()
var jsonParser = bodyParser.json()

stripePayment.post("/api/stripe", jsonParser, (req, res, next) => {
    const { amount, products, description, email, phone, city, country } = req.body

    if (!amount) {
        return res.json({ type: "stripe", result: "error", payload: 'no_money' })
    }

    // Mock successful stripe charge
    const mockPayload = {
        id: "ch_mock_" + Math.random().toString(36).substr(2, 9),
        customer: "cus_mock_" + Math.random().toString(36).substr(2, 9),
        created: Math.floor(Date.now() / 1000),
        amount: Math.round(amount * 100), // Stripe uses cents
        payment_details: {
            payment_type: "card",
            country: country || "US",
            city: city || "New York",
            email: email || "user@example.com",
            phone: phone || "+1234567890",
            products: products || []
        },
        status: "succeeded",
        description: description || "Mock Stripe Payment"
    }

    res.json({
        type: "stripe",
        result: "success",
        payload: mockPayload
    })
})

module.exports = stripePayment
