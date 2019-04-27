const mongoose = require('mongoose');
//The class <Instrument> has the following subclasses: 
//-Option
//-MutualFund
//-CashEquivalent
//-Equity
//-FixedIncome

// Equity
const equitySchema = new mongoose.Schema({
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
    }
});
module.exports = mongoose.model('Equity', equitySchema);