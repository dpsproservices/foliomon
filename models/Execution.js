const mongoose = require('mongoose');
//The class <OrderActivity> has the following subclasses: 
// Execution
const executionSchema = new mongoose.Schema({
    accountId: {
        type: String
    },
    tradeDate: {
        type: Date
    },
    activityType: {
        type: String,
        eNum: [
            'EXECUTION',
            'ORDER_ACTION'
        ]
    },
    executionType: {
        type: String,
        eNum: [
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
                    type: Number,
                },
                quantity: {
                    type: Number,

                },
                mismarkedQuantity: {
                    type: Number,

                },
                price: {
                    type: Number,

                },
                time: {
                    type: Date
                }
            }
        }]
    }
});
module.exports = mongoose.model('Execution', executionSchema);