// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './Addresses.css';

// const Addresses = ({ token, userId }) => {
//     const [addresses, setAddresses] = useState({
//         billing_address: '',
//         shipping_address: ''
//     });
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [editMode, setEditMode] = useState(false);

//     const fetchAddresses = async () => {
//         try {
//             const response = await axios.get(`http://localhost:8000/api/addresses/`, {
//                 headers: {
//                     'Authorization': `Token ${token}`,
//                 },
//             });
//             setAddresses({
//                 billing_address: response.data.billing_address || '',
//                 shipping_address: response.data.shipping_address || ''
//             });
//         } catch (error) {
//             console.error('Fetch error:', error.response || error.message);
//             setError('Error fetching addresses.');
//         } finally {
//             setLoading(false);
//         }
//     };
    

//     useEffect(() => {
//         fetchAddresses();
//     }, [token]);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setAddresses((prevAddresses) => ({
//             ...prevAddresses,
//             [name]: value,
//         }));
//     };

//     const handleSubmit = async () => {
//         try {
//             await axios.put(
//                 'http://localhost:8000/api/addresses/',
//                 {
//                     billing_address: addresses.billing_address,
//                     shipping_address: addresses.shipping_address
//                 },
//                 {
//                     headers: {
//                         Authorization: `Token ${token}`,
//                     },
//                 }
//             );
//             setEditMode(false);
//             await fetchAddresses(); // Now this will work
//         } catch (error) {
//             setError('Error updating addresses. Please try again.');
//         }
//     };

//     if (loading) return <p>Loading...</p>;
//     if (error) return <p>{error}</p>;

//     return (
//         <div className="addresses-container">
//             <h2>Address Details</h2>
//             {editMode ? (
//                 <div className="address-section">
//                     <div className="address-box">
//                         <h3>Billing Address</h3>
//                         <textarea
//                             name="billing_address"
//                             value={addresses.billing_address}
//                             onChange={handleInputChange}
//                         />
//                     </div>
//                     <div className="address-box">
//                         <h3>Shipping Address</h3>
//                         <textarea
//                             name="shipping_address"
//                             value={addresses.shipping_address}
//                             onChange={handleInputChange}
//                         />
//                     </div>
//                     <button onClick={handleSubmit}>Save</button>
//                 </div>
//             ) : (
//                 <div className="address-section">
//                     <div className="address-box">
//                         <h3>Billing Address</h3>
//                         <p>{addresses.billing_address || 'No billing address provided.'}</p>
//                     </div>
//                     <div className="address-box">
//                         <h3>Shipping Address</h3>
//                         <p>{addresses.shipping_address || 'No shipping address provided.'}</p>
//                     </div>
//                     <button onClick={() => setEditMode(true)}>Edit</button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Addresses;
