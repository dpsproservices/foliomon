const mongoose = require('mongoose');
//MarginAccount:
const marginAccountSchema = new mongoose.Schema({
    "type": {
        "type": "string",
        "enum": [
            "CASH",
            "MARGIN"
        ]
    },
    "accountId": {
        "type": "string"
    },
    "roundTrips": {
        "type": "integer",
        "format": "int32"
    },
    "isDayTrader": {
        "type": "boolean",
        "default": false
    },
    "isClosingOnlyRestricted": {
        "type": "boolean",
        "default": false
    },
    "positions": {
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
                "shortQuantity": {
                    "type": "number",
                    "format": "double"
                },
                "averagePrice": {
                    "type": "number",
                    "format": "double"
                },
                "currentDayProfitLoss": {
                    "type": "number",
                    "format": "double"
                },
                "currentDayProfitLossPercentage": {
                    "type": "number",
                    "format": "double"
                },
                "longQuantity": {
                    "type": "number",
                    "format": "double"
                },
                "settledLongQuantity": {
                    "type": "number",
                    "format": "double"
                },
                "settledShortQuantity": {
                    "type": "number",
                    "format": "double"
                },
                "agedQuantity": {
                    "type": "number",
                    "format": "double"
                },
                "instrument": {
                    "type": "object",
                    "discriminator": "assetType",
                    "properties": {
                        "assetType": {
                            "type": "string",
                            "enum": [
                                "EQUITY",
                                "OPTION",
                                "INDEX",
                                "MUTUAL_FUND",
                                "CASH_EQUIVALENT",
                                "FIXED_INCOME",
                                "CURRENCY"
                            ]
                        },
                        "cusip": {
                            "type": "string"
                        },
                        "symbol": {
                            "type": "string"
                        },
                        "description": {
                            "type": "string"
                        }
                    }
                },
                "marketValue": {
                    "type": "number",
                    "format": "double"
                }
            }
        }
    },
    "orderStrategies": {
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
                "session": {
                    "type": "string",
                    "enum": [
                        "NORMAL",
                        "AM",
                        "PM",
                        "SEAMLESS"
                    ]
                },
                "duration": {
                    "type": "string",
                    "enum": [
                        "DAY",
                        "GOOD_TILL_CANCEL",
                        "FILL_OR_KILL"
                    ]
                },
                "orderType": {
                    "type": "string",
                    "enum": [
                        "MARKET",
                        "LIMIT",
                        "STOP",
                        "STOP_LIMIT",
                        "TRAILING_STOP",
                        "MARKET_ON_CLOSE",
                        "EXERCISE",
                        "TRAILING_STOP_LIMIT",
                        "NET_DEBIT",
                        "NET_CREDIT",
                        "NET_ZERO"
                    ]
                },
                "cancelTime": {
                    "type": "object",
                    "properties": {
                        "date": {
                            "type": "string"
                        },
                        "shortFormat": {
                            "type": "boolean",
                            "default": false
                        }
                    }
                },
                "complexOrderStrategyType": {
                    "type": "string",
                    "enum": [
                        "NONE",
                        "COVERED",
                        "VERTICAL",
                        "BACK_RATIO",
                        "CALENDAR",
                        "DIAGONAL",
                        "STRADDLE",
                        "STRANGLE",
                        "COLLAR_SYNTHETIC",
                        "BUTTERFLY",
                        "CONDOR",
                        "IRON_CONDOR",
                        "VERTICAL_ROLL",
                        "COLLAR_WITH_STOCK",
                        "DOUBLE_DIAGONAL",
                        "UNBALANCED_BUTTERFLY",
                        "UNBALANCED_CONDOR",
                        "UNBALANCED_IRON_CONDOR",
                        "UNBALANCED_VERTICAL_ROLL",
                        "CUSTOM"
                    ]
                },
                "quantity": {
                    "type": "number",
                    "format": "double"
                },
                "filledQuantity": {
                    "type": "number",
                    "format": "double"
                },
                "remainingQuantity": {
                    "type": "number",
                    "format": "double"
                },
                "requestedDestination": {
                    "type": "string",
                    "enum": [
                        "INET",
                        "ECN_ARCA",
                        "CBOE",
                        "AMEX",
                        "PHLX",
                        "ISE",
                        "BOX",
                        "NYSE",
                        "NASDAQ",
                        "BATS",
                        "C2",
                        "AUTO"
                    ]
                },
                "destinationLinkName": {
                    "type": "string"
                },
                "releaseTime": {
                    "type": "string",
                    "format": "date-time"
                },
                "stopPrice": {
                    "type": "number",
                    "format": "double"
                },
                "stopPriceLinkBasis": {
                    "type": "string",
                    "enum": [
                        "MANUAL",
                        "BASE",
                        "TRIGGER",
                        "LAST",
                        "BID",
                        "ASK",
                        "ASK_BID",
                        "MARK",
                        "AVERAGE"
                    ]
                },
                "stopPriceLinkType": {
                    "type": "string",
                    "enum": [
                        "VALUE",
                        "PERCENT",
                        "TICK"
                    ]
                },
                "stopPriceOffset": {
                    "type": "number",
                    "format": "double"
                },
                "stopType": {
                    "type": "string",
                    "enum": [
                        "STANDARD",
                        "BID",
                        "ASK",
                        "LAST",
                        "MARK"
                    ]
                },
                "priceLinkBasis": {
                    "type": "string",
                    "enum": [
                        "MANUAL",
                        "BASE",
                        "TRIGGER",
                        "LAST",
                        "BID",
                        "ASK",
                        "ASK_BID",
                        "MARK",
                        "AVERAGE"
                    ]
                },
                "priceLinkType": {
                    "type": "string",
                    "enum": [
                        "VALUE",
                        "PERCENT",
                        "TICK"
                    ]
                },
                "price": {
                    "type": "number",
                    "format": "double"
                },
                "taxLotMethod": {
                    "type": "string",
                    "enum": [
                        "FIFO",
                        "LIFO",
                        "HIGH_COST",
                        "LOW_COST",
                        "AVERAGE_COST",
                        "SPECIFIC_LOT"
                    ]
                },
                "orderLegCollection": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "orderLegType": {
                                "type": "string",
                                "enum": [
                                    "EQUITY",
                                    "OPTION",
                                    "INDEX",
                                    "MUTUAL_FUND",
                                    "CASH_EQUIVALENT",
                                    "FIXED_INCOME",
                                    "CURRENCY"
                                ]
                            },
                            "legId": {
                                "type": "integer",
                                "format": "int64"
                            },
                            "instrument": {
                                "type": "object",
                                "discriminator": "assetType",
                                "properties": {
                                    "assetType": {
                                        "type": "string",
                                        "enum": [
                                            "EQUITY",
                                            "OPTION",
                                            "INDEX",
                                            "MUTUAL_FUND",
                                            "CASH_EQUIVALENT",
                                            "FIXED_INCOME",
                                            "CURRENCY"
                                        ]
                                    },
                                    "cusip": {
                                        "type": "string"
                                    },
                                    "symbol": {
                                        "type": "string"
                                    },
                                    "description": {
                                        "type": "string"
                                    }
                                }
                            },
                            "instruction": {
                                "type": "string",
                                "enum": [
                                    "BUY",
                                    "SELL",
                                    "BUY_TO_COVER",
                                    "SELL_SHORT",
                                    "BUY_TO_OPEN",
                                    "BUY_TO_CLOSE",
                                    "SELL_TO_OPEN",
                                    "SELL_TO_CLOSE",
                                    "EXCHANGE"
                                ]
                            },
                            "positionEffect": {
                                "type": "string",
                                "enum": [
                                    "OPENING",
                                    "CLOSING",
                                    "AUTOMATIC"
                                ]
                            },
                            "quantity": {
                                "type": "number",
                                "format": "double"
                            },
                            "quantityType": {
                                "type": "string",
                                "enum": [
                                    "ALL_SHARES",
                                    "DOLLARS",
                                    "SHARES"
                                ]
                            }
                        }
                    }
                },
                "activationPrice": {
                    "type": "number",
                    "format": "double"
                },
                "specialInstruction": {
                    "type": "string",
                    "enum": [
                        "ALL_OR_NONE",
                        "DO_NOT_REDUCE",
                        "ALL_OR_NONE_DO_NOT_REDUCE"
                    ]
                },
                "orderStrategyType": {
                    "type": "string",
                    "enum": [
                        "SINGLE",
                        "OCO",
                        "TRIGGER"
                    ]
                },
                "orderId": {
                    "type": "integer",
                    "format": "int64"
                },
                "cancelable": {
                    "type": "boolean",
                    "default": false
                },
                "editable": {
                    "type": "boolean",
                    "default": false
                },
                "status": {
                    "type": "string",
                    "enum": [
                        "AWAITING_PARENT_ORDER",
                        "AWAITING_CONDITION",
                        "AWAITING_MANUAL_REVIEW",
                        "ACCEPTED",
                        "AWAITING_UR_OUT",
                        "PENDING_ACTIVATION",
                        "QUEUED",
                        "WORKING",
                        "REJECTED",
                        "PENDING_CANCEL",
                        "CANCELED",
                        "PENDING_REPLACE",
                        "REPLACED",
                        "FILLED",
                        "EXPIRED"
                    ]
                },
                "enteredTime": {
                    "type": "string",
                    "format": "date-time"
                },
                "closeTime": {
                    "type": "string",
                    "format": "date-time"
                },
                "tag": {
                    "type": "string"
                },
                "accountId": {
                    "type": "integer",
                    "format": "int64"
                },
                "orderActivityCollection": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "discriminator": "activityType",
                        "properties": {
                            "activityType": {
                                "type": "string",
                                "enum": [
                                    "EXECUTION",
                                    "ORDER_ACTION"
                                ]
                            }
                        }
                    }
                },
                "replacingOrderCollection": {
                    "type": "array"
                },
                "childOrderStrategies": {
                    "type": "array"
                },
                "statusDescription": {
                    "type": "string"
                }
            }
        }
    },
    "initialBalances": {
        "type": "object",
        "properties": {
            "accruedInterest": {
                "type": "number",
                "format": "double"
            },
            "availableFundsNonMarginableTrade": {
                "type": "number",
                "format": "double"
            },
            "bondValue": {
                "type": "number",
                "format": "double"
            },
            "buyingPower": {
                "type": "number",
                "format": "double"
            },
            "cashBalance": {
                "type": "number",
                "format": "double"
            },
            "cashAvailableForTrading": {
                "type": "number",
                "format": "double"
            },
            "cashReceipts": {
                "type": "number",
                "format": "double"
            },
            "dayTradingBuyingPower": {
                "type": "number",
                "format": "double"
            },
            "dayTradingBuyingPowerCall": {
                "type": "number",
                "format": "double"
            },
            "dayTradingEquityCall": {
                "type": "number",
                "format": "double"
            },
            "equity": {
                "type": "number",
                "format": "double"
            },
            "equityPercentage": {
                "type": "number",
                "format": "double"
            },
            "liquidationValue": {
                "type": "number",
                "format": "double"
            },
            "longMarginValue": {
                "type": "number",
                "format": "double"
            },
            "longOptionMarketValue": {
                "type": "number",
                "format": "double"
            },
            "longStockValue": {
                "type": "number",
                "format": "double"
            },
            "maintenanceCall": {
                "type": "number",
                "format": "double"
            },
            "maintenanceRequirement": {
                "type": "number",
                "format": "double"
            },
            "margin": {
                "type": "number",
                "format": "double"
            },
            "marginEquity": {
                "type": "number",
                "format": "double"
            },
            "moneyMarketFund": {
                "type": "number",
                "format": "double"
            },
            "mutualFundValue": {
                "type": "number",
                "format": "double"
            },
            "regTCall": {
                "type": "number",
                "format": "double"
            },
            "shortMarginValue": {
                "type": "number",
                "format": "double"
            },
            "shortOptionMarketValue": {
                "type": "number",
                "format": "double"
            },
            "shortStockValue": {
                "type": "number",
                "format": "double"
            },
            "totalCash": {
                "type": "number",
                "format": "double"
            },
            "isInCall": {
                "type": "boolean",
                "default": false
            },
            "unsettledCash": {
                "type": "number",
                "format": "double"
            },
            "pendingDeposits": {
                "type": "number",
                "format": "double"
            },
            "marginBalance": {
                "type": "number",
                "format": "double"
            },
            "shortBalance": {
                "type": "number",
                "format": "double"
            },
            "accountValue": {
                "type": "number",
                "format": "double"
            }
        }
    },
    "currentBalances": {
        "type": "object",
        "properties": {
            "accruedInterest": {
                "type": "number",
                "format": "double"
            },
            "cashBalance": {
                "type": "number",
                "format": "double"
            },
            "cashReceipts": {
                "type": "number",
                "format": "double"
            },
            "longOptionMarketValue": {
                "type": "number",
                "format": "double"
            },
            "liquidationValue": {
                "type": "number",
                "format": "double"
            },
            "longMarketValue": {
                "type": "number",
                "format": "double"
            },
            "moneyMarketFund": {
                "type": "number",
                "format": "double"
            },
            "savings": {
                "type": "number",
                "format": "double"
            },
            "shortMarketValue": {
                "type": "number",
                "format": "double"
            },
            "pendingDeposits": {
                "type": "number",
                "format": "double"
            },
            "availableFunds": {
                "type": "number",
                "format": "double"
            },
            "availableFundsNonMarginableTrade": {
                "type": "number",
                "format": "double"
            },
            "buyingPower": {
                "type": "number",
                "format": "double"
            },
            "buyingPowerNonMarginableTrade": {
                "type": "number",
                "format": "double"
            },
            "dayTradingBuyingPower": {
                "type": "number",
                "format": "double"
            },
            "dayTradingBuyingPowerCall": {
                "type": "number",
                "format": "double"
            },
            "equity": {
                "type": "number",
                "format": "double"
            },
            "equityPercentage": {
                "type": "number",
                "format": "double"
            },
            "longMarginValue": {
                "type": "number",
                "format": "double"
            },
            "maintenanceCall": {
                "type": "number",
                "format": "double"
            },
            "maintenanceRequirement": {
                "type": "number",
                "format": "double"
            },
            "marginBalance": {
                "type": "number",
                "format": "double"
            },
            "regTCall": {
                "type": "number",
                "format": "double"
            },
            "shortBalance": {
                "type": "number",
                "format": "double"
            },
            "shortMarginValue": {
                "type": "number",
                "format": "double"
            },
            "shortOptionMarketValue": {
                "type": "number",
                "format": "double"
            },
            "sma": {
                "type": "number",
                "format": "double"
            },
            "mutualFundValue": {
                "type": "number",
                "format": "double"
            },
            "bondValue": {
                "type": "number",
                "format": "double"
            },
            "isInCall": {
                "type": "boolean",
                "default": false
            },
            "stockBuyingPower": {
                "type": "number",
                "format": "double"
            },
            "optionBuyingPower": {
                "type": "number",
                "format": "double"
            }
        }
    },
    "projectedBalances": {
        "type": "object",
        "properties": {
            "accruedInterest": {
                "type": "number",
                "format": "double"
            },
            "cashBalance": {
                "type": "number",
                "format": "double"
            },
            "cashReceipts": {
                "type": "number",
                "format": "double"
            },
            "longOptionMarketValue": {
                "type": "number",
                "format": "double"
            },
            "liquidationValue": {
                "type": "number",
                "format": "double"
            },
            "longMarketValue": {
                "type": "number",
                "format": "double"
            },
            "moneyMarketFund": {
                "type": "number",
                "format": "double"
            },
            "savings": {
                "type": "number",
                "format": "double"
            },
            "shortMarketValue": {
                "type": "number",
                "format": "double"
            },
            "pendingDeposits": {
                "type": "number",
                "format": "double"
            },
            "availableFunds": {
                "type": "number",
                "format": "double"
            },
            "availableFundsNonMarginableTrade": {
                "type": "number",
                "format": "double"
            },
            "buyingPower": {
                "type": "number",
                "format": "double"
            },
            "buyingPowerNonMarginableTrade": {
                "type": "number",
                "format": "double"
            },
            "dayTradingBuyingPower": {
                "type": "number",
                "format": "double"
            },
            "dayTradingBuyingPowerCall": {
                "type": "number",
                "format": "double"
            },
            "equity": {
                "type": "number",
                "format": "double"
            },
            "equityPercentage": {
                "type": "number",
                "format": "double"
            },
            "longMarginValue": {
                "type": "number",
                "format": "double"
            },
            "maintenanceCall": {
                "type": "number",
                "format": "double"
            },
            "maintenanceRequirement": {
                "type": "number",
                "format": "double"
            },
            "marginBalance": {
                "type": "number",
                "format": "double"
            },
            "regTCall": {
                "type": "number",
                "format": "double"
            },
            "shortBalance": {
                "type": "number",
                "format": "double"
            },
            "shortMarginValue": {
                "type": "number",
                "format": "double"
            },
            "shortOptionMarketValue": {
                "type": "number",
                "format": "double"
            },
            "sma": {
                "type": "number",
                "format": "double"
            },
            "mutualFundValue": {
                "type": "number",
                "format": "double"
            },
            "bondValue": {
                "type": "number",
                "format": "double"
            },
            "isInCall": {
                "type": "boolean",
                "default": false
            },
            "stockBuyingPower": {
                "type": "number",
                "format": "double"
            },
            "optionBuyingPower": {
                "type": "number",
                "format": "double"
            }
        }
    }
}, { timestamps: true });
module.exports = mongoose.model('MarginAccount', marginAccountSchema);