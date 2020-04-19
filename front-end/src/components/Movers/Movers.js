import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMovers } from '../../utils/api';
import {
  colors,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tooltip,
  Box,
  Tabs,
  Tab,
  Select,
  FormControl,
  InputLabel,
  Paper
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  table: {
    //width: 300
  },
  title: {
    margin: theme.spacing(1)
  },
  upTick: {
    color: colors.green[400]
  },
  downTick: {
    color: colors.red[500]
  },
  tab: {
    minWidth: 80,
    width: 80
  },
  formControl: {
    float: 'right'
  }
}));

const Movers = () => {
  const [movers, setMovers] = useState();
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState("$COMPX");
  const classes = useStyles();

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleSelect = (event) => {
    setSelectedIndex(event.target.value);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const req = {
            index: selectedIndex,
            change: 'percent'
        };
        const res = await getMovers(req);
        console.log(res.data);
        setMovers(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [selectedIndex]);

  const getPriceClass = (direction) => {
    if (direction === 'up') {
      return classes.upTick;
    }
    if (direction === 'down') {
      return classes.downTick;
    }
    
    return '';
  };

  const moversUp = movers && movers.filter(m => m.direction === 'up');
  const moversDown = movers && movers.filter(m => m.direction === 'down');

  const renderMoverRows = (movers) => {
    return (movers && movers.map((row) => {   
      return (
        <TableRow key={row.symbol} className={classes.tableRow}>
        
        <TableCell component="th" scope="row">
          <Tooltip title={row.description} placement="right">
            <Link to={`/stocks/${row.symbol}`}>
              {row.symbol}
            </Link>
          </Tooltip>
        </TableCell>
        <TableCell align="right">{row.totalVolume}</TableCell>
        <TableCell align="right" className={getPriceClass(row.direction)}>{(row.change * 100).toFixed(2)}%</TableCell>
        <TableCell align="right" className={getPriceClass(row.direction)}>{row.last.toFixed(2)}</TableCell>
        </TableRow>
      );
    }));
  };

  const renderTable = (movers) => {
    return (
      <Table className={classes.table} aria-label="table" size="small">
        <TableHead>
          <TableRow>
            <TableCell>Symbol</TableCell>
            <TableCell align="right">Volume</TableCell>
            <TableCell align="right">Change</TableCell>
            <TableCell align="right">Last</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {renderMoverRows(movers)}
        </TableBody>
      </Table>
    );
  };

  return (
    <TableContainer component={Paper} elevation={4}>
      <Typography className={classes.title} variant="h6" id="tableTitle">
        Movers
      </Typography>

      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="select-index">Index</InputLabel>
        <Select
          native
          value={selectedIndex}
          onChange={handleSelect}
          inputProps={{
            name: 'select-index',
            id: 'select-index',
          }}
        >
          <option value="$COMPX">NASDAQ</option>
          <option value="$SPX.X">S &amp; P 500</option>
          <option value="$DJI">DJI</option>
        </Select>
      </FormControl>

      <Tabs
        value={selectedTab}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
        aria-label="tabs"
      >
        <Tab label="Up" classes={{ root: classes.tab }} />
        <Tab label="Down" classes={{ root: classes.tab }} />
      </Tabs>
      {selectedTab === 0 &&
        <Box>
          {renderTable(moversUp)}
        </Box>
      }
      {selectedTab === 1 &&
        <Box>
          {renderTable(moversDown)}
        </Box>
      }
    </TableContainer>
  );
};

export default Movers;