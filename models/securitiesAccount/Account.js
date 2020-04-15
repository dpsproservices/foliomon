const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//The class <securitiesAccount> has the following subclasses: 
//CashAccount
//MarginAccount

// Account:
const accountSchema = new Schema({
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
    isClosingOnlyRestricted: {
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
            type: String
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
            type: String
        },
        closeTime: {
            type: String
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
        accruedInterest: {
            type: Number
        },
        availableFundsNonMarginableTrade: {
            type: Number
        },
        bondValue: {
            type: Number
        },
        buyingPower: {
            type: Number
        },
        cashBalance: {
            type: Number
        },
        cashAvailableForTrading: {
            type: Number
        },
        cashAvailableForWithdrawal: {
            type: Number
        },
        cashReceipts: {
            type: Number
        },
        dayTradingBuyingPower: {
            type: Number
        },
        dayTradingBuyingPowerCall: {
            type: Number
        },
        dayTradingEquityCall: {
            type: Number
        },
        equity: {
            type: Number
        },
        equityPercentage: {
            type: Number
        },
        liquidationValue: {
            type: Number
        },
        longMarginValue: {
            type: Number
        },
        longOptionMarketValue: {
            type: Number
        },
        longStockValue: {
            type: Number
        },
        maintenanceCall: {
            type: Number
        },
        maintenanceRequirement: {
            type: Number
        },
        margin: {
            type: Number
        },
        marginEquity: {
            type: Number
        },
        moneyMarketFund: {
            type: Number
        },
        mutualFundValue: {
            type: Number
        },
        regTCall: {
            type: Number
        },
        shortMarginValue: {
            type: Number
        },
        shortOptionMarketValue: {
            type: Number
        },
        shortStockValue: {
            type: Number
        },
        totalCash: {
            type: Number
        },
        isInCall: {
            type: Boolean,
            default: false
        },
        unsettledCash: {
            type: Number
        },
        cashDebitCallValue: {
            type: Number
        },        
        pendingDeposits: {
            type: Number
        },
        marginBalance: {
            type: Number
        },
        shortBalance: {
            type: Number
        },
        accountValue: {
            type: Number
        }
    },
    currentBalances: {
        accruedInterest: {
            type: Number
        },
        cashBalance: {
            type: Number
        },
        cashReceipts: {
            type: Number
        },
        longOptionMarketValue: {
            type: Number
        },
        liquidationValue: {
            type: Number
        },
        longMarketValue: {
            type: Number
        },
        moneyMarketFund: {
            type: Number
        },
        savings: {
            type: Number
        },
        shortMarketValue: {
            type: Number
        },
        pendingDeposits: {
            type: Number
        },
        availableFunds: {
            type: Number
        },
        availableFundsNonMarginableTrade: {
            type: Number
        },
        buyingPower: {
            type: Number
        },
        buyingPowerNonMarginableTrade: {
            type: Number
        },
        dayTradingBuyingPower: {
            type: Number
        },
        dayTradingBuyingPowerCall: {
            type: Number
        },
        equity: {
            type: Number
        },
        equityPercentage: {
            type: Number
        },
        longMarginValue: {
            type: Number
        },
        maintenanceCall: {
            type: Number
        },
        maintenanceRequirement: {
            type: Number
        },
        marginBalance: {
            type: Number
        },
        regTCall: {
            type: Number
        },
        shortBalance: {
            type: Number
        },
        shortMarginValue: {
            type: Number
        },
        shortOptionMarketValue: {
            type: Number
        },
        sma: {
            type: Number
        },
        mutualFundValue: {
            type: Number
        },
        bondValue: {
            type: Number
        },
        isInCall: {
            type: Boolean,
            default: false
        },
        stockBuyingPower: {
            type: Number
        },
        optionBuyingPower: {
            type: Number
        },
        cashAvailableForTrading: {
            type: Number
        },
        cashAvailableForWithdrawal: {
            type: Number
        },
        cashCall: {
            type: Number
        },
        longNonMarginableMarketValue: {
            type: Number
        },
        cashDebitCallValue: {
            type: Number
        },
        unsettledCash: {
            type: Number
        }          
    },
    projectedBalances: {
        accruedInterest: {
            type: Number
        },
        cashBalance: {
            type: Number
        },
        cashReceipts: {
            type: Number
        },
        longOptionMarketValue: {
            type: Number
        },
        liquidationValue: {
            type: Number
        },
        longMarketValue: {
            type: Number
        },
        moneyMarketFund: {
            type: Number
        },
        savings: {
            type: Number
        },
        shortMarketValue: {
            type: Number
        },
        pendingDeposits: {
            type: Number
        },
        cashAvailableForTrading: {
            type: Number
        },
        cashAvailableForWithdrawal: {
            type: Number
        },
        cashCall: {
            type: Number
        },
        longNonMarginableMarketValue: {
            type: Number
        },
        totalCash: {
            type: Number
        },
        availableFunds: {
            type: Number
        },
        availableFundsNonMarginableTrade: {
            type: Number
        },
        buyingPower: {
            type: Number
        },
        buyingPowerNonMarginableTrade: {
            type: Number
        },
        dayTradingBuyingPower: {
            type: Number
        },
        dayTradingBuyingPowerCall: {
            type: Number
        },
        equity: {
            type: Number
        },
        equityPercentage: {
            type: Number
        },
        longMarginValue: {
            type: Number
        },
        maintenanceCall: {
            type: Number
        },
        maintenanceRequirement: {
            type: Number
        },
        marginBalance: {
            type: Number
        },
        regTCall: {
            type: Number
        },
        shortBalance: {
            type: Number
        },
        shortMarginValue: {
            type: Number
        },
        shortOptionMarketValue: {
            type: Number
        },
        sma: {
            type: Number
        },
        mutualFundValue: {
            type: Number
        },
        bondValue: {
            type: Number
        },
        isInCall: {
            type: Boolean,
            default: false
        },
        stockBuyingPower: {
            type: Number
        },
        optionBuyingPower: {
            type: Number
        }
    }
}, { timestamps: true });
module.exports = mongoose.model('Account', accountSchema);