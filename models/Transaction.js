const mongoose = require('mongoose');
//Transaction:
const transactionSchema = new mongoose.Schema(
{
    type: {
        type: String,
        required: true,
        enum: [
            'TRADE',
            'RECEIVE_AND_DELIVER',
            'DIVIDEND_OR_INTEREST',
            'ACH_RECEIPT',
            'ACH_DISBURSEMENT',
            'CASH_RECEIPT',
            'CASH_DISBURSEMENT',
            'ELECTRONIC_FUND',
            'WIRE_OUT',
            'WIRE_IN',
            'JOURNAL',
            'MEMORANDUM',
            'MARGIN_CALL',
            'MONEY_MARKET',
            'SMA_ADJUSTMENT'
        ]
    },
    clearingReferenceNumber: {
        type: String
    },
    subAccount: {
        type: String
    },
    settlementDate: {
        type: String
    },
    orderId: {
        type: String
    },
    sma: {
        type: Number
    },
    requirementReallocationAmount: {
        type: Number
    },
    dayTradeBuyingPowerEffect: {
        type: Number
    },
    netAmount: {
        type: Number
    },
    transactionDate: {
        type: String
    },
    orderDate: {
        type: String
    },
    transactionSubType: {
        type: String
    },
    transactionId: {
        type: Number
    },
    cashBalanceEffectFlag: {
        type: Boolean,
        default: false
    },
    description: {
        type: String
    },
    achStatus: {
        type: String,
        enum: [
            'Approved',
            'Rejected',
            'Cancel',
            'Error'
        ]
    },
    accruedInterest: {
        type: Number
    },
    fees: {
        additionalProperties: {
            type: Number
        }
        
    },
    transactionItem: {
        accountId: {
            type: Number
        },
        amount: {
            type: Number
        },
        price: {
            type: Number
        },
        cost: {
            type: Number
        },
        parentOrderKey: {
            type: Number
        },
        parentChildIndicator: {
            type: String
        },
        instruction: {
            type: String,
            enum: [
                'BUY',
                'SELL'
            ]
        },
        positionEffect: {
            type: String,
            enum: [
                'OPENING',
                'CLOSING',
                'AUTOMATIC'
            ]
        },
        instrument: {
            symbol: {
                type: String
            },
            underlyingSymbol: {
                type: String
            },
            optionExpirationDate: {
                type: String
            },
            optionStrikePrice: {
                type: Number
            },
            putCall: {
                type: String,
                enum: [
                    'PUT',
                    'CALL'
                ]
            },
            cusip: {
                type: String
            },
            description: {
                type: String
            },
            assetType: {
                type: String,
                enum: [
                    'EQUITY',
                    'MUTUAL_FUND',
                    'OPTION',
                    'FIXED_INCOME',
                    'CASH_EQUIVALENT'
                ]
            },
            bondMaturityDate: {
                type: String
            },
            bondInterestRate: {
                type: Number
            }
        }
    }
}, { timestamps: true });
module.exports = mongoose.model('Transaction', transactionSchema);