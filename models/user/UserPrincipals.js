const mongoose = require('mongoose');
// User Principals
const userPrincipalsSchema = new mongoose.Schema({
    authToken: { type: String },
    userId: { type: String, required: true },
    userCdDomainId: { type: String },
    primaryAccountId: { type: String },
    lastLoginTime: { type: String },
    tokenExpirationTime: { type: String },
    loginTime: { type: String },
    accessLevel: { type: String },
    stalePassword: { type: Boolean, default: false },
    streamerInfo: {
        streamerBinaryUrl: String,
        streamerSocketUrl: String,
        token: String,
        tokenTimestamp: String,
        userGroup: String,
        accessLevel: String,
        acl: String,
        appId: String       
    },
    professionalStatus: {
        type: String,
        enum: [
            'PROFESSIONAL',
            'NON_PROFESSIONAL',
            'UNKNOWN_STATUS'
        ]
    },
    quotes: {
        isNyseDelayed: { type: Boolean, default: false },
        isNasdaqDelayed: { type: Boolean, default: false },
        isOpraDelayed: { type: Boolean, default: false },
        isAmexDelayed: { type: Boolean, default: false },
        isCmeDelayed: { type: Boolean, default: false },
        isIceDelayed: { type: Boolean, default: false },
        isForexDelayed: { type: Boolean, default: false }
    },
    streamerSubscriptionKeys: {
        keys: [{ key: String }]
    },
    accounts: [
    {
      accountId: String,
      description: String,
      displayName: String,
      accountCdDomainId: String,
      company: String,
      segment: String,
      surrogateIds: {},
      preferences: {
        expressTrading: { type: Boolean, default: false },
        directOptionsRouting: { type: Boolean, default: false },
        directEquityRouting: { type: Boolean, default: false },
        defaultEquityOrderLegInstruction: {
            type: String,
            enum: [
                'BUY',
                'SELL',
                'BUY_TO_COVER',
                'SELL_SHORT',
                'NONE'
            ]
        },
        defaultEquityOrderType: {
            type: String,
            enum: [
                'MARKET',
                'LIMIT',
                'STOP',
                'STOP_LIMIT',
                'TRAILING_STOP',
                'MARKET_ON_CLOSE',
                'NONE'
            ]
        },
        defaultEquityOrderPriceLinkType: {
            type: String,
            enum: [
                'VALUE',
                'PERCENT',
                'NONE'
            ]
        },
        defaultEquityOrderDuration: {
            type: String,
            enum: [
                'DAY',
                'GOOD_TILL_CANCEL',
                'NONE'
            ]
        },
        defaultEquityOrderMarketSession: {
            type: String,
            enum: [
                'AM',
                'PM',
                'NORMAL',
                'SEAMLESS',
                'NONE'
            ]
        },
        defaultEquityQuantity: { type: Number, default: 0 },
        mutualFundTaxLotMethod: {
            type: String,
            enum: [
                'FIFO',
                'LIFO',
                'HIGH_COST',
                'LOW_COST',
                'MINIMUM_TAX',
                'AVERAGE_COST',
                'NONE'
            ]
        },
        optionTaxLotMethod: {
            type: String,
            enum: [
                'FIFO',
                'LIFO',
                'HIGH_COST',
                'LOW_COST',
                'MINIMUM_TAX',
                'AVERAGE_COST',
                'NONE'
            ]
        },
        equityTaxLotMethod: {
            type: String,
            enum: [
                'FIFO',
                'LIFO',
                'HIGH_COST',
                'LOW_COST',
                'MINIMUM_TAX',
                'AVERAGE_COST',
                'NONE'
            ]
        },
        defaultAdvancedToolLaunch: {
            type: String,
            enum: [
                'TA',
                'N',
                'Y',
                'TOS',
                'NONE',
                'CC2'
            ]
        },
        authTokenTimeout: {
            type: String,
            enum: [
                'FIFTY_FIVE_MINUTES',
                'TWO_HOURS',
                'FOUR_HOURS',
                'EIGHT_HOURS'
            ]
        }
      },
      acl: { type: String },
      authorizations: {
        apex: { type: Boolean, default: false },
        levelTwoQuotes: { type: Boolean, default: false },
        stockTrading: { type: Boolean, default: false },
        marginTrading: { type: Boolean, default: false },
        streamingNews: { type: Boolean, default: false },
        optionTradingLevel: {
            type: String,
            enum: [
                'COVERED',
                'FULL',
                'LONG',
                'SPREAD',
                'NONE'
            ]
        },
        streamerAccess: { type: Boolean, default: false },
        advancedMargin: { type: Boolean, default: false },
        scottradeAccount: { type: Boolean, default: false }
      }
    }
  ]
}, { timestamps: true });
module.exports = mongoose.model('UserPrincipals', userPrincipalsSchema);