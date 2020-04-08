const OrderService = require('../services/OrderService');

// GET /foliomon/orders/
// Get all accounts orders which this user can access from TD with access token
// Then save all the orders into the database, update them if they exist 
exports.initialize = async (req, res) => {
    try {
        console.log('orderController.initialize begin');

        var isOrdersDataAvailable = false;
        var orders = null;

        // Verify the orders are stored otherwise get them and store them
        try {
            orders = await OrderService.getDbOrders();
            isOrdersDataAvailable = true;
            res.status(200).send(orders);
        } catch (err) {
            console.log(`Error in orderController.initialize ${err}`);
            isOrdersDataAvailable = false;
        }

        if (!isOrdersDataAvailable) {
            console.log('orderController.initialize No orders data available. Getting from TD...');

            try {
                orders = await OrderService.getApiOrders();
                if (orders && orders.length > 0)
                    await OrderService.saveDbOrders(orders);

                res.status(200).send(orders);
            } catch (err) {
                console.log(`Error in orderController.initialize ${err}`);
                res.status(500).send({ error: `Error in orderController.initialize ${err}` })
            }

        }

        console.log('orderController.initialize end');
    } catch (err) {
        console.log(`Error in orderController.initialize: ${err}`);
        res.status(500).send('Internal Server Error during Orders Init request.');
    }
}

exports.getAllOrders = async (req, res) => {
    try {
        console.log('orderController.getAllOrders begin');

        var orders = null;

        try {
            orders = await OrderService.getApiOrders();
            res.status(200).send(orders);
        } catch (err) {
            console.log(`Error in getAllOrders ${err}`);
            res.status(500).send({ error: `Error in getAllOrders ${err}` })
        }

        console.log('orderController.getAllOrders end');
    } catch (err) {
        console.log(`Error in orderController.getAllOrders: ${err}`);
        res.status(500).send('Internal Server Error during Get All Orders request.');
    }
}

exports.getOrdersByAccountId = async (req, res) => {
    try {
        console.log('orderController.getOrdersByAccountId begin');

        var orders = null;
        const accountId = req.params.accountId;

        try {
            orders = await OrderService.getApiOrdersByAccountId(accountId);
            res.status(200).send(orders);
        } catch (err) {
            console.log(`Error in getOrdersByAccountId ${err}`);
            res.status(500).send({ error: `Error in getOrdersByAccountId ${err}` })
        }

        console.log('orderController.getOrdersByAccountId end');
    } catch (err) {
        console.log(`Error in orderController.getOrdersByAccountId: ${err}`);
        res.status(500).send('Internal Server Error during Get Orders By Account Id request.');
    }
}

exports.getOrderByAccountIdOrderId = async (req, res) => {
    try {
        console.log('orderController.getOrderByAccountIdOrderId begin');

        var orders = null;
        const accountId = req.params.accountId;
        const orderId = req.params.orderId;

        try {
            orders = await OrderService.getApiOrderByAccountIdOrderId(accountId, orderId);
            res.status(200).send(orders);
        } catch (err) {
            console.log(`Error in getOrderByAccountIdOrderId ${err}`);
            res.status(500).send({ error: `Error in getOrderByAccountIdOrderId ${err}` })
        }

        console.log('orderController.getOrderByAccountIdOrderId end');
    } catch (err) {
        console.log(`Error in orderController.getOrderByAccountIdOrderId: ${err}`);
        res.status(500).send('Internal Server Error during Get Order By Account Id Order Id request.');
    }
}