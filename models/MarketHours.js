// Market Hours:
const marketHoursSchema = new mongoose.Schema({
    market: {
        type: String,
        required: true,
        enum: [
            'equity',
            'bond',
            'option',
            'forex',
            'future'
        ],        
        category: {
            type: String, 
            required: true,
            enum: [
                'EQ',
                'BON',
                'EQO',
                'IND',
                'forex'
            ]
        },
        date: {
            type: String,
            required: true
        },
        exchange: {
            type: String
        },
        isOpen: {
            type: boolean,
            required: true,
            default: false
        },
        marketType: {
            type: String,
            required: true,
            enum: [
                'BOND',
                'EQUITY',
                'ETF',
                'FOREX',
                'FUTURE',
                'FUTURE_OPTION',
                'INDEX',
                'INDICATOR',
                'MUTUAL_FUND',
                'OPTION',
                'UNKNOWN'
            ]
        },
        product: {
            type: String,
            required: true
        },
        productName: {
            type: String,
            required: true
        },
        sessionHours: {
            preMarket: [
                {
                    start: Date,
                    end: Date
                }
            ],
            regularMarket: [
                {
                    start: Date,
                    end: Date
                }
            ],
            postMarket: [
                {
                    start: Date,
                    end: Date
                }
            ]
        }
    }
}, { timestamps: true });
module.exports = mongoose.model('MarketHours', marketHoursSchema);