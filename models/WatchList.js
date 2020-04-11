const mongoose = require('mongoose');
// Watchlist:
const watchlistSchema = new mongoose.Schema({
    name: {
        type: String
    },
    watchlistId: {
        type: String
    },
    accountId: {
        type: String
    },
    status: {
        type: String,
        enum: [
            'UNCHANGED',
            'CREATED',
            'UPDATED',
            'DELETED'
        ]
    },
    watchlistItems: [
        {
            sequenceId: {
                type: Number
            },
            quantity: {
                type: Number
            },
            averagePrice: {
                type: Number
            },
            commission: {
                type: Number
            },
            purchasedDate: {
                type: String
            },
            instrument: {
                symbol: {
                    type: String
                },
                description: {
                    type: String
                },
                assetType: {
                    type: String,
                    enum: [
                        'EQUITY',
                        'OPTION',
                        'MUTUAL_FUND',
                        'FIXED_INCOME',
                        'INDEX'
                    ]
                }
            },
            status: {
                type: String,
                enum: [
                    'UNCHANGED',
                    'CREATED',
                    'UPDATED',
                    'DELETED'
                ]
            }
        }
    ]
});
module.exports = mongoose.model('Watchlist', watchlistSchema);