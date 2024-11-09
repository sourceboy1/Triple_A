import React, { useState } from 'react';
import UserOrders from './UserOrders';
import OrderDetails from './OrderDetails';

const UserOrderParent = () => {
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Function to handle viewing an order’s details
    const handleViewOrder = (orderId) => {
        // Implement the logic here to set the selected order by orderId
        setSelectedOrder(orderId);
    };

    const handleBackToOrders = () => {
        setSelectedOrder(null);
    };

    return (
        <div className="App">
            {selectedOrder ? (
                <OrderDetails orderId={selectedOrder} onBack={handleBackToOrders} />
            ) : (
                <UserOrders onViewOrder={handleViewOrder} /> // Passing handleViewOrder here
            )}
        </div>
    );
};

export default UserOrderParent;
