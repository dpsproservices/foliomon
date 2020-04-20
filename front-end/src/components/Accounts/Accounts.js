import React, { useEffect, useState } from 'react';
import { getAccounts } from '../../utils/api';

const Accounts = () => {
  const [accounts, setAccountsData] = useState();

  useEffect(() => {
    const getAccountsData = async () => {
      try {
        const res = await getAccounts();
        console.log(res.data);
        setAccountsData(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    getAccountsData();
  }, []);

  return (
    <div>
      <ul>
      {accounts && accounts.map(o => <li>o</li>)}
      </ul>
    </div>
  );
}

export default Accounts;
