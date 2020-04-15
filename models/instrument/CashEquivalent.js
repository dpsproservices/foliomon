const mongoose = require('mongoose');
//The class <Instrument> has the following subclasses: 
//-Option
//-MutualFund
//-CashEquivalent
//-Equity
//-FixedIncome

// CashEquivalent
const cashEquivalentSchema = new mongoose.Schema({
    assetType: {
        type: String,
        enum: [
            'EQUITY',
            'OPTION',
            'INDEX',
            'MUTUAL_FUND',
            'CASH_EQUIVALENT',
            'FIXED_INCOME',
            'CURRENCY'
        ]
    },
    cusip: {
        type: String
    },
    symbol: {
        type: String
    },
    description: {
        type: String
    },
    type: {
        type: String,
        enum: [
            'SAVINGS',
            'MONEY_MARKET_FUND'
        ]
    }
}, { timestamps: true });
module.exports = mongoose.model('CashEquivalent', cashEquivalentSchema);