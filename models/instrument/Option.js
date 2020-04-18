const mongoose = require('mongoose');
//The class <Instrument> has the following subclasses: 
//-Option
//-MutualFund
//-CashEquivalent
//-Equity
//-FixedIncome

// Option
const optionSchema = new mongoose.Schema({
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
            'VANILLA',
            'BINARY',
            'BARRIER'
        ]
    },
    putCall: {
        type: String,
        enum: [
            'PUT',
            'CALL'
        ]
    },
    underlyingSymbol: {
        type: String
    },
    optionMultiplier: {
        type: Number
    },
    optionDeliverables: {
        items: [{
            properties: {
                symbol: {
                    type: String
                },
                deliverableUnits: {
                    type: Number
                },
                currencyType: {
                    type: String,
                    enum: [
                        'USD',
                        'CAD',
                        'EUR',
                        'JPY'
                    ]
                },
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
                }
            }
        }]
    }
}, { timestamps: true });
module.exports = mongoose.model('Option', optionSchema);