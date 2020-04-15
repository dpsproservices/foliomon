const mongoose = require('mongoose');
//The class <OrderActivity> has the following subclasses: 
// Execution
const executionSchema = new mongoose.Schema({
    accountId: {
        type: String
    },
    tradeDate: {
        type: String
    },
    activityType: {
        type: String,
        enum: [
            'EXECUTION',
            'ORDER_ACTION'
        ]
    },
    executionType: {
        type: String,
        enum: [
            'FILL'
        ]
    },
    quantity: {
        type: Number
    },
    orderRemainingQuantity: {
        type: Number
    },
    executionLegs: {
        items: [{
            properties: {
                legId: {
                    type: Number
                },
                quantity: {
                    type: Number
                },
                mismarkedQuantity: {
                    type: Number
                },
                price: {
                    type: Number
                },
                time: {
                    type: String
                }
            }
        }]
    }
}, { timestamps: true });
module.exports = mongoose.model('Execution', executionSchema);