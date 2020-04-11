import React, { useEffect, useState } from 'react';
import * as Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { getPriceHistory } from '../../utils/api';

const Chart = ({ symbol }) => {
  const [isLoading, setIsLoading] = useState();
  const [results, setResults] = useState();

  useEffect(() => {
    const getStockData = async () => {
        try {
        setIsLoading(true);
        const req = { symbol, period: '1', periodType: 'day' };
        const res = await getPriceHistory(req);
        console.log(res.data);
        setResults(res.data);
        } catch (error) {
        console.log(error);
        setResults(null);
        } finally {
        setIsLoading(false);
        }
    };

    if (symbol) {
        getStockData();
    } else {
        setResults(null);
    }
  }, [symbol]);

  const ohlc = results && results.candles.map(o => [o.datetime, o.open, o.high, o.low, o.close]);
  const volumes = results && results.candles.map(o => [o.datetime, o.volume]);

  const options = {
    yAxis: [{
      labels: {
          align: 'left'
      },
      height: '80%',
      resize: {
          enabled: true
      }
    }, {
        labels: {
            align: 'left'
        },
        top: '80%',
        height: '20%',
        offset: 0
    }],
    title: {
      text: `${symbol} Stock Price`
    },
    series: [{
      type: 'ohlc',
      id: `${symbol}-ohlc`,
      name: `${symbol} Stock Price`,
      data: ohlc || []
    },
    {
      type: 'column',
      id: `${symbol}-vol`,
      name: `${symbol} Volume`,
      data: volumes || [],
      yAxis: 1
    }]
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} constructorType={'stockChart'} options={options} />
    </div>
  );
};

export default Chart;