const mongoose = require('mongoose');
//The class <Instrument> has the following subclasses: 
//-Option
//-MutualFund
//-CashEquivalent
//-Equity
//-FixedIncome

// FixedIncome 
const fixedIncomeSchema = new mongoose.Schema({
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
    maturityDate: {
        type: Date
    },
    variableRate: {
        type: Number
    },
    factor: {
        type: Number
    }
});
module.exports = mongoose.model('FixedIncome', fixedIncomeSchema);