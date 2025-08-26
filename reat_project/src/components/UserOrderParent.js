import React, { useState } from 'react';
import UserOrders from './UserOrders';
import OrderDetails from './OrderDetails';

const UserOrderParent = () => {
    const [selectedOrder, setSelectedOrder] = useState(null);

    // ✅ Called when user clicks "View" on an order
    const handleViewOrder = (orderId) => {
        setSelectedOrder(orderId);
    };

    // ✅ Called when user goes back from OrderDetails
    const handleBackToOrders = () => {
        setSelectedOrder(null);
    };

    return (
        <div className="user-orders-app">
            {selectedOrder ? (
                <OrderDetails orderId={selectedOrder} onBack={handleBackToOrders} />
            ) : (
                <UserOrders onViewOrder={handleViewOrder} />
            )}
        </div>
    );
};

export default UserOrderParent;
