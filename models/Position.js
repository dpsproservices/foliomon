const mongoose = require('mongoose');
const positionSchema = new mongoose.Schema({
    /*
    accountId: {
        type: String
    },
    positionDate: {
        type: Date
    },
    */
    shortQuantity: {
        type: Number
    },
    averagePrice: {
        type: Number
    },
    currentDayProfitLoss: {
        type: Number
    },
    currentDayProfitLossPercentage: {
        type: Number
    },
    longQuantity: {
        type: Number
    },
    settledLongQuantity: {
        type: Number
    },
    settledShortQuantity: {
        type: Number
    },
    agedQuantity: {
        type: Number
    },
    instrument: {
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
    },
    marketValue: {
        type: Number
    }
});
module.exports = mongoose.model('Position', positionSchema);