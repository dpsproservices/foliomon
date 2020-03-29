import React, { useEffect, useState } from 'react';
import { getAllAccounts } from '../../utils/api';

const Orders = () => {
   const [accounts, setAccounts] = useState();

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await getAllAccounts();
        console.log(res.data);
        setAccounts(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    getOrders();
  }, []);

  return (
    <div>
      <ul>
      {accounts && accounts.map(o => <li>o</li>)}
      </ul>
    </div>
  );
}

export default Orders;
