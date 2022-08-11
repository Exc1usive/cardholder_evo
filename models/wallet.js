const mongoose = require('mongoose')

const walletSchema = new mongoose.Schema({
    cash: [{
        currencyName: String,
        amount: Number,
    }],
    cards: [{
        pan: String,
        expire_date: String,
        cvv: Number,
        payment_system: String,
        card_type: String,
        card_holder: String,
        currencyName: String,
        amount: Number,
        name: String
    }]
});

const Wallet = mongoose.model("Wallet", walletSchema);

module.exports = Wallet;