import React, { useEffect, useState } from 'react';
import { getAllOrders } from '../../utils/api';

const Orders = () => {
   const [orders, setOrders] = useState();

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await getAllOrders();
        console.log(res.data);
        setOrders(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    getOrders();
  }, []);

  return (
    <div>
      <ul>
      {orders && orders.map(o => <li>{o.orderType} {o.quantity} @ {o.price}, Status: {o.status}</li>)}
      </ul>
    </div>
  );
}

export default Orders;
