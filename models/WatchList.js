const mongoose = require('mongoose');
// Watchlist:
const watchlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    watchlistId: {
        type: String,
        required: true
    },
    accountId: {
        type: String,
        required: true
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
                type: Number,
                required: true
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
                    type: String,
                    required: true
                },
                description: {
                    type: String
                },
                assetType: {
                    type: String,
                    required: true,
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