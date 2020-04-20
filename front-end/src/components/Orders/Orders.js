import React, { useEffect, useState } from 'react';
import { getOrders } from '../../utils/api';

const Orders = () => {
   const [orders, setOrdersData] = useState();

  useEffect(() => {
    const getOrdersData = async () => {
      try {
        const res = await getOrders();
        console.log(res.data);
        setOrdersData(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    getOrdersData();
  }, []);

  return (
    <div>
      <ul>
      {orders && orders.map(o => <li key={o.orderId}>{o.orderType} {o.quantity} @ {o.price}, Status: {o.status}</li>)}
      </ul>
    </div>
  );
}

export default Orders;
