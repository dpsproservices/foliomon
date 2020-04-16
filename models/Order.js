const mongoose = require('mongoose');
// Order
const orderSchema = new mongoose.Schema({
    session: { 
        type: String,
        required: true,
        enum: [ 
            'NORMAL', 
            'AM', 
            'PM', 
            'SEAMLESS' 
        ]
    },
    duration: { 
        type: String,
        required: true,
        enum: [ 
            'DAY', 
            'GOOD_TILL_CANCEL', 
            'FILL_OR_KILL' 
        ] 
    },
    orderType: { 
        type: String,
        required: true,
        enum: [ 
            'MARKET', 
            'LIMIT', 
            'STOP', 
            'STOP_LIMIT', 
            'TRAILING_STOP', 
            'MARKET_ON_CLOSE', 
            'EXERCISE', 
            'TRAILING_STOP_LIMIT', 
            'NET_DEBIT', 
            'NET_CREDIT', 
            'NET_ZERO' 
        ] 
    },
    cancelTime: {
        date: {
            type: String
        },
        shortFormat: {
            type: Boolean,
            default: false
        }
    },
    complexOrderStrategyType: { 
        type: String,
        enum: [ 
            'NONE', 
            'COVERED', 
            'VERTICAL', 
            'BACK_RATIO', 
            'CALENDAR', 
            'DIAGONAL', 
            'STRADDLE', 
            'STRANGLE', 
            'COLLAR_SYNTHETIC', 
            'BUTTERFLY', 
            'CONDOR', 
            'IRON_CONDOR', 
            'VERTICAL_ROLL', 
            'COLLAR_WITH_STOCK', 
            'DOUBLE_DIAGONAL', 
            'UNBALANCED_BUTTERFLY', 
            'UNBALANCED_CONDOR', 
            'UNBALANCED_IRON_CONDOR', 
            'UNBALANCED_VERTICAL_ROLL', 
            'CUSTOM' 
        ] 
    },
    quantity: {
        type: Number,
        required: true
    },
    filledQuantity: {
        type: Number
    },
    remainingQuantity: {
        type: Number
    },
    requestedDestination: {
        type: String,
        enum: [
            'INET', 
            'ECN_ARCA', 
            'CBOE', 
            'AMEX', 
            'PHLX', 
            'ISE', 
            'BOX', 
            'NYSE', 
            'NASDAQ', 
            'BATS', 
            'C2', 
            'AUTO'
        ]
    },
    destinationLinkName: { 
        type: String
    },
    releaseTime: {
        type: String
    },
    stopPrice: {
        type: Number
    },
    stopPriceLinkBasis: {
        type: String,
        enum: [
            'MANUAL', 
            'BASE', 
            'TRIGGER', 
            'LAST', 
            'BID', 
            'ASK', 
            'ASK_BID', 
            'MARK', 
            'AVERAGE'
        ]
    },
    stopPriceLinkType: {
        type: String,
        enum: [
            'VALUE', 
            'PERCENT', 
            'TICK'
        ]
    },
    stopPriceOffset: { 
        type: Number
    },
    stopType: {
        type: String,
        enum: [
            'STANDARD', 
            'BID', 
            'ASK', 
            'LAST', 
            'MARK'
        ]
    },
    priceLinkBasis: { 
        type: String,
        enum: [ 
            'MANUAL', 
            'BASE', 
            'TRIGGER', 
            'LAST', 
            'BID', 
            'ASK', 
            'ASK_BID', 
            'MARK', 
            'AVERAGE' 
        ]
    },
    priceLinkType: {
        type: String, 
        enum: [
            'VALUE', 
            'PERCENT', 
            'TICK'
        ]
    },
    price: {
        type: Number
    },
    taxLotMethod: {
        type: String,
        enum: [
            'FIFO', 
            'LIFO', 
            'HIGH_COST', 
            'LOW_COST', 
            'AVERAGE_COST', 
            'SPECIFIC_LOT'
        ]
    },
    orderLegCollection: [
        {
            orderLegType: {
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
            legId: { 
                type: Number
            },
            instrument: {
                /* The type <Instrument> has the following subclasses [Option, MutualFund, CashEquivalent, Equity, FixedIncome] */
                //type: mongoose.Schema.Types.ObjectId,
                //ref: Instrument

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
                        'SAVINGS',
                        'MONEY_MARKET_FUND',
                        'VANILLA',
                        'BINARY',
                        'BARRIER',
                        'NOT_APPLICABLE',
                        'OPEN_END_NON_TAXABLE',
                        'OPEN_END_TAXABLE',
                        'NO_LOAD_NON_TAXABLE',
                        'NO_LOAD_TAXABLE'                        
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
            },
            instruction: {
                type: String,
                enum: [
                    'BUY', 
                    'SELL', 
                    'BUY_TO_COVER', 
                    'SELL_SHORT', 
                    'BUY_TO_OPEN', 
                    'BUY_TO_CLOSE', 
                    'SELL_TO_OPEN', 
                    'SELL_TO_CLOSE', 
                    'EXCHANGE'
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
            quantity: {
                type: Number
            },
            quantityType: {
                type: String,
                enum: [
                    'ALL_SHARES', 
                    'DOLLARS', 
                    'SHARES'
                ]
            }
        }
    ],
    activationPrice: {
        type: Number
    },
    specialInstruction: { 
        type: String,
        enum: [            
            'ALL_OR_NONE', 
            'DO_NOT_REDUCE', 
            'ALL_OR_NONE_DO_NOT_REDUCE'
        ]
    },
    orderStrategyType: {
        type: String,
        enum: [ 
            'SINGLE', 
            'OCO', 
            'TRIGGER'
        ]
    },
    orderId: {
        type: String,
        required: true
    },
    cancelable: {
        type: Boolean,
        default: false
    },
    editable: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        required: true,
        enum: [         
            'AWAITING_PARENT_ORDER', 
            'AWAITING_CONDITION', 
            'AWAITING_MANUAL_REVIEW', 
            'ACCEPTED', 
            'AWAITING_UR_OUT', 
            'PENDING_ACTIVATION', 
            'QUEUED', 
            'WORKING', 
            'REJECTED', 
            'PENDING_CANCEL', 
            'CANCELED', 
            'PENDING_REPLACE', 
            'REPLACED', 
            'FILLED', 
            'EXPIRED'
        ]
    },
    enteredTime: { 
        type: String 
    },
    closeTime: {
        type: String
    },
    tag: {
        type: String
    },
    accountId: {
        type: String,
        required: true
    },
    orderActivityCollection: [
        {
            /* The type <OrderActivity> has the following subclasses [Execution] */
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
            executionLegs: [
                {
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
                    },
                }
            ]        
        }
    ],
    replacingOrderCollection: {
        type: [{}]
    },
    childOrderStrategies: {
        type: [{}]
    },
    statusDescription: {
        type: String
    }
}, { timestamps: true });
module.exports = mongoose.model('Order', orderSchema);