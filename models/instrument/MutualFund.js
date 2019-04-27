const mongoose = require('mongoose');
//The class <Instrument> has the following subclasses: 
//-Option
//-MutualFund
//-CashEquivalent
//-Equity
//-FixedIncome

//MutualFund:
const mutualFundSchema = new mongoose.Schema({
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
            'NOT_APPLICABLE',
            'OPEN_END_NON_TAXABLE',
            'OPEN_END_TAXABLE',
            'NO_LOAD_NON_TAXABLE',
            'NO_LOAD_TAXABLE'
        ]
    }
});
module.exports = mongoose.model('MutualFund', mutualFundSchema);