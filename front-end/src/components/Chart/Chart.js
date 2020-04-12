import React, { useEffect, useState } from 'react';
import { Typography, Button, ButtonGroup } from '@material-ui/core';
//import { makeStyles } from '@material-ui/core/styles';
import * as Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { getPriceHistory } from '../../utils/api';

// const useStyles = makeStyles(theme => ({
//   button: {
//     //float: 'right'
//   }
// }));

const Chart = ({ symbol }) => {
  const [isDay, setIsDay] = useState(false);
  const [isCandle, setIsCandle] = useState(true);
  const [results, setResults] = useState();
  //const classes = useStyles();

  useEffect(() => {
    const getStockData = async () => {
      try {
        const req = (isDay
          ? 
            { symbol, period: '5', periodType: 'day', frequency: '1', frequencyType: 'minute' }
          :
            { symbol, period: '5', periodType: 'year', frequency: '1', frequencyType: 'daily' }
        );
        const res = await getPriceHistory(req);
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
    if (['button-candle', 'button-line'].includes(event.currentTarget.id)) {
      setIsCandle(prev => !prev);
    }
  };

  const ohlc = results && results.candles.map(o => [o.datetime, o.open, o.high, o.low, o.close]);
  const volumes = results && results.candles.map(o => [o.datetime, o.volume]);
  const line = results && results.candles.map(o => [o.datetime, o.close]);

  const series = (isCandle
    ?
      [{
        type: 'ohlc',
        id: `${symbol}-ohlc`,
        name: `${symbol} Stock Price`,
        data: ohlc || [],
        dataGrouping: {
          approximation: 'ohlc'
        }
      },
      {
        type: 'column',
        id: `${symbol}-vol`,
        name: `${symbol} Volume`,
        data: volumes || [],
        yAxis: 1
      }]
    :
      [{
        type: 'line',
        id: `${symbol}-line`,
        name: `${symbol} Stock Price`,
        data: line || [],
        dataGrouping: {
          approximation: 'average'
        },
        tooltip: {
          valueDecimals: 2
        }
      }]
  );

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
          type: 'all',
          text: '5d'
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
          type: 'all',
          text: '5y'
        }
      ]
  );

  const yAxis = (isCandle
    ?
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
      ]
    :
      [
        {
          labels: {
              align: 'left'
          },
          height: '80%',
          resize: {
              enabled: true
          }
        }
      ]
    );

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
          disabled={isCandle}
          onClick={handleClick}
        >
          Candle
        </Button>
        <Button
          id="button-line"
          disabled={!isCandle}
          onClick={handleClick}
        >
          Line
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default Chart;