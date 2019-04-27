const mongoose = require('mongoose');

//The class <securitiesAccount> has the following subclasses: 
//CashAccount
//MarginAccount

// Account:
const accountSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: [
            'CASH',
            'MARGIN'
        ]
    },
    accountId: {
        type: String
    },
    roundTrips: {
        type: Number
    },
    isDayTrader: {
        type: Boolean,
        default: false
    },
    isClosingOnlyReStricted: {
        type: Boolean,
        default: false
    },
    positions: [{
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
    }],
    orderStrategies: [{
        session: {
            type: String,
            enum: [
                'NORMAL',
                'AM',
                'PM',
                'SEAMLESS'
            ]
        },
        duration: {
            type: String,
            enum: [
                'DAY',
                'GOOD_TILL_CANCEL',
                'FILL_OR_KILL'
            ]
        },
        orderType: {
            type: String,
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
            properties: {
                date: {
                    type: String
                },
                shortFormat: {
                    type: Boolean,
                    default: false
                }
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
            type: Number
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
            type: Date
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
        orderLegCollection: [{
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
        }],
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
            type: Number
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
            type: Date
        },
        closeTime: {
            type: Date
        },
        tag: {
            type: String
        },
        accountId: {
            type: Number
        },
        orderActivityCollection: [{
            activityType: {
                type: String,
                enum: [
                    'EXECUTION',
                    'ORDER_ACTION'
                ]
            }
        }],
        replacingOrderCollection: {
            type: [{}]
        },
        childOrderStrategies: {
            type: [{}]
        },
        statusDescription: {
            type: String
        }
    }],
    initialBalances: {
        accruedInterest: Number,
        availableFundsNonMarginableTrade: Number,
        bondValue: Number,
        buyingPower: Number,
        cashBalance: Number,
        cashAvailableForTrading: Number,
        cashReceipts: Number,
        dayTradingBuyingPower: Number,
        dayTradingBuyingPowerCall: Number,
        dayTradingEquityCall: Number,
        equity: Number,
        equityPercentage: Number,
        liquidationValue: Number,
        longMarginValue: Number,
        longOptionMarketValue: Number,
        longStockValue: Number,
        maintenanceCall: Number,
        maintenanceRequirement: Number,
        margin: Number,
        marginEquity: Number,
        moneyMarketFund: Number,
        mutualFundValue: Number,
        regTCall: Number,
        shortMarginValue: Number,
        shortOptionMarketValue: Number,
        shortStockValue: Number,
        totalCash: Number,
        isInCall: Boolean,
        unsettledCash: Number,
        pendingDeposits: Number,
        marginBalance: Number,
        shortBalance: Number,
        accountValue: Number
    },
    currentBalances: {
        accruedInterest: Number,
        cashBalance: Number,
        cashReceipts: Number,
        longOptionMarketValue: Number,
        liquidationValue: Number,
        longMarketValue: Number,
        moneyMarketFund: Number,
        savings: Number,
        shortMarketValue: Number,
        pendingDeposits: Number,
        availableFunds: Number,
        availableFundsNonMarginableTrade: Number,
        buyingPower: Number,
        buyingPowerNonMarginableTrade: Number,
        dayTradingBuyingPower: Number,
        dayTradingBuyingPowerCall: Number,
        equity: Number,
        equityPercentage: Number,
        longMarginValue: Number,
        maintenanceCall: Number,
        maintenanceRequirement: Number,
        marginBalance: Number,
        regTCall: Number,
        shortBalance: Number,
        shortMarginValue: Number,
        shortOptionMarketValue: Number,
        sma: Number,
        mutualFundValue: Number,
        bondValue: Number,
        isInCall: Boolean,
        stockBuyingPower: Number,
        optionBuyingPower: Number
    },
    projectedBalances: {
        accruedInterest: Number,
        cashBalance: Number,
        cashReceipts: Number,
        longOptionMarketValue: Number,
        liquidationValue: Number,
        longMarketValue: Number,
        moneyMarketFund: Number,
        savings: Number,
        shortMarketValue: Number,
        pendingDeposits: Number,
        availableFunds: Number,
        availableFundsNonMarginableTrade: Number,
        buyingPower: Number,
        buyingPowerNonMarginableTrade: Number,
        dayTradingBuyingPower: Number,
        dayTradingBuyingPowerCall: Number,
        equity: Number,
        equityPercentage: Number,
        longMarginValue: Number,
        maintenanceCall: Number,
        maintenanceRequirement: Number,
        marginBalance: Number,
        regTCall: Number,
        shortBalance: Number,
        shortMarginValue: Number,
        shortOptionMarketValue: Number,
        sma: Number,
        mutualFundValue: Number,
        bondValue: Number,
        isInCall: Boolean,
        stockBuyingPower: Number,
        optionBuyingPower: Number
    },
    updateDate: Date
});
module.exports = mongoose.model('Account', accountSchema);