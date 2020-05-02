import React, { useEffect, useState } from 'react';
import { Typography, Button, ButtonGroup } from '@material-ui/core';
//import { makeStyles } from '@material-ui/core/styles';
import * as Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { getPriceHistory, getMinutePriceHistory, getDailyPriceHistory} from '../../utils/api';

// const useStyles = makeStyles(theme => ({
//   button: {
//     //float: 'right'
//   }
// }));

const Chart = React.memo(({ symbol }) => {
  const [isDay, setIsDay] = useState(true);
  const [priceSeriesType, setPriceSeriesType] = useState('candlestick');
  const [volumeSeriesType, setVolumeSeriesType] = useState('column');  
  const [results, setResults] = useState();
  //const classes = useStyles();

  useEffect(() => {
    const getStockData = async () => {
      try {
        
        /*
        const req = (isDay
          ? 
            { symbol, period: '10', periodType: 'day', frequency: '1', frequencyType: 'minute' }
          :
            { symbol, period: '20', periodType: 'year', frequency: '1', frequencyType: 'daily' }
        );
        const res = await getPriceHistory(req);
        */

        const res = (isDay
          ?
          await getMinutePriceHistory(symbol)
          :
          await getDailyPriceHistory(symbol)
        );

        console.log(res.data);
        setResults(res.data);
      } catch (error) {
        console.log(error);
        setResults(null);
      }
    };

    if (symbol) {
        getStockData();
    } else {
        setResults(null);
    }
  }, [symbol, isDay]);

  const handleClick = (event) => {
    if (['button-year', 'button-day'].includes(event.currentTarget.id)) {
      setIsDay(prev => !prev);
    }
    if (event.currentTarget.id === 'button-candle') {
      setPriceSeriesType('candlestick');
      setVolumeSeriesType('column');
    } else if (event.currentTarget.id === 'button-line') {
      setPriceSeriesType('line');
      setVolumeSeriesType('column');
    } else if (event.currentTarget.id === 'button-ohlc') {
      setPriceSeriesType('ohlc');
      setVolumeSeriesType('column');
    }   
  };

  const ohlc = results && results.candles.map(o => [o.datetime, o.open, o.high, o.low, o.close]);
  const line = results && results.candles.map(o => [o.datetime, o.close]);
  const volume = results && results.candles.map(o => [o.datetime, o.volume]);  

  let priceSeriesData = ohlc;
  let dataGrouping = {
      units: [
        [
          'week', // unit name
          [1] // allowed multiples
        ], [
          'month',
          [1, 2, 3, 4, 6]
        ]
      ]
  };

  if (priceSeriesType === 'ohlc') {
    priceSeriesData = ohlc;
    dataGrouping = {
      approximation: 'ohlc'
    };
  } else if (priceSeriesType === 'candlestick') {
    priceSeriesData = ohlc;
    dataGrouping = {
      approximation: 'ohlc'
    };
  } else if (priceSeriesType === 'line') {
    priceSeriesData = line;
    dataGrouping = {
      approximation: 'average'
    };
  }

  const series = [
    {
      type: priceSeriesType,
      id: `${symbol}-${priceSeriesType}`,
      name: `${symbol} Stock Price`,
      data: priceSeriesData || [],
      dataGrouping: dataGrouping,
      tooltip: {
        valueDecimals: 2
      }
    },
    {
      type: volumeSeriesType,
      id: `${symbol}-vol`,
      name: `${symbol} Volume`,
      data: volume || [],
      yAxis: 1
    }
  ];

  const rangeButtons = (isDay
    ?
      [
        {
          type: 'hour',
          count: 1,
          text: '1h'
        },
        {
          type: 'day',
          count: 1,
          text: '1d'
        },
        {
          type: 'day',
          count: 5,
          text: '5d'
        },
        {
          type: 'all',
          text: '10d'
        }
      ]
    :
      [
        {
          type: 'week',
          count: 1,
          text: '1w'
        },
        {
          type: 'month',
          count: 1,
          text: '1m'
        },
        {
          type: 'month',
          count: 3,
          text: '3m'
        },
        {
          type: 'month',
          count: 6,
          text: '6m'
        },
        {
          type: 'ytd',
          text: 'YTD'
        },
        {
          type: 'year',
          count: 1,
          text: '1y'
        },
        {
          type: 'year',
          count: 2,
          text: '2y'
        },
        {
          type: 'year',
          count: 5,
          text: '5y'
        },
        {
          type: 'year',
          count: 10,
          text: '10y'
        },
        {
          type: 'all',
          text: '20y'
        }
      ]
  );

  const yAxis = 
      [
        {
          labels: {
              align: 'left'
          },
          height: '80%',
          resize: {
              enabled: true
          }
        },
        {
          labels: {
              align: 'left'
          },
          top: '80%',
          height: '20%',
          offset: 0
        }
      ];

  const options = {
    time: {
      timezoneOffset: new Date().getTimezoneOffset()
    },
    yAxis,
    title: {
      text: `${symbol} Stock Price`
    },
    series,
    rangeSelector: {
      inputEnabled: false,
      buttons: rangeButtons
    }
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} constructorType={'stockChart'} options={options} />
      <ButtonGroup variant="text" color="secondary" size="small" aria-label="button-group">
        <Button
          id="button-year"
          disabled={!isDay}
          onClick={handleClick}
        >
          Year
        </Button>
        <Button
          id="button-day"
          disabled={isDay}
          onClick={handleClick}
        >
          Day
        </Button>
      </ButtonGroup>
      <ButtonGroup variant="text" color="secondary" size="small" aria-label="button-group">
        <Button
          id="button-candle"
          disabled={priceSeriesType === 'candlestick'}
          onClick={handleClick}
        >
          Candle
        </Button>
        <Button
          id="button-ohlc"
          disabled={priceSeriesType === 'ohlc'}
          onClick={handleClick}
        >
          OHLC
        </Button>        
        <Button
          id="button-line"
          disabled={priceSeriesType === 'line'}
          onClick={handleClick}
        >
          Line
        </Button>
      </ButtonGroup>
    </div>
  );
});

export default Chart;