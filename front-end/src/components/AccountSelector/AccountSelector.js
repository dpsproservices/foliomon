import React, { useEffect, useState } from 'react';
import {
  Select,
  MenuItem
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { getAccounts } from '../../utils/api';
import { bindActionCreators } from 'redux';
import { setSelectedAccount } from '../../modules/account/actions';
import { connect } from 'react-redux';

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ setSelectedAccount }, dispatch);
};

const useStyles = makeStyles(theme => ({
  select: {
    margin: theme.spacing(1),
    minWidth: 120,
    '&::before': {
      borderColor: '#FFF'
    },
    '&::after': {
      borderColor: '#FFF'
    },
    '&:hover:not(.Mui-disabled):before': {
      borderColor: '#FFF'
    }
  },
  label: {
    color: '#FFF'
  },
  icon: {
    fill: '#FFF'
  },
  selector: {
    color: '#FFF'
  }
}));  
const AccountSelector = ({ setSelectedAccount }) => {
  const [accounts, setAccounts] = useState();
  const [activeAccount, setActiveAccount] = useState('');
  const classes = useStyles();

  const handleChange = (event) => {
    setActiveAccount(event.target.value);
    setSelectedAccount(event.target.value);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await getAccounts();
        console.log(res.data);

        const accountData = res.data && res.data.map(a => a.securitiesAccount);
        setAccounts(accountData);

        if (accountData && accountData.length > 0) {
          setSelectedAccount(accountData[0].accountId);
          setActiveAccount(accountData[0].accountId);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getData(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div>
      <span className={classes.label} id="account-select-label">Account:</span>
      <Select
        className={classes.select}
        labelId="account-select-label"
        id="account-select"
        value={activeAccount}
        onChange={handleChange}
        classes={{
          root: classes.selector,
          icon: classes.icon
        }}
      >
        <MenuItem key="item-0" value="" ><em>Select</em></MenuItem>
        {accounts && accounts.map(a => <MenuItem value={a.accountId} key={a.accountId}>{a.accountId}</MenuItem>)}
      </Select>
    </div>
  );
}

export default connect(null, mapDispatchToProps)(AccountSelector);
