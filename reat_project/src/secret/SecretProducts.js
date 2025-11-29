import React, { useEffect, useState } from "react";
import Api from "../Api";
import "./SecretProducts.css";

const SECRET_PATH = "/x9a7-secret-ops/";

export default function SecretProducts() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [imei, setImei] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [addedModalOpen, setAddedModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [confirming, setConfirming] = useState(false);

  // Format price as ₦1,000.00
  const formatPrice = (value) => {
    if (!value) return "₦0.00";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(value);
  };

  // Load products
  const loadProducts = async () => {
    try {
      const res = await Api.get(`${SECRET_PATH}records/`);
      setProducts(res.data.records);
    } catch (err) {
      console.error("Failed to load products", err);
    }
  };

  // Add new product
  const addProduct = async () => {
    if (!name || !imei) return alert("Name and IMEI/Serial required");
    try {
      await Api.post(`${SECRET_PATH}add/`, {
        name,
        imei_or_serial: imei,
        price,
        description,
      });
      setName(""); setImei(""); setPrice(""); setDescription("");
      setAddedModalOpen(true); // Show product added popup
      loadProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to add product");
    }
  };

  // Open confirmation modal for sold
  const openModal = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  // Confirm sold
  const confirmSold = async () => {
    if (!selectedProduct) return;
    setConfirming(true);
    try {
      await Api.post(`${SECRET_PATH}mark-sold/${selectedProduct.id}/`);
      setModalOpen(false);
      setConfirming(false);
      setSelectedProduct(null);
      loadProducts();
    } catch (err) {
      console.error(err);
      setConfirming(false);
      alert("Failed to mark as sold");
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="secret-dashboard">
      <h1>Secret Product Dashboard</h1>

      {/* Add Form */}
      <div className="add-product-form">
        <h2>Add Secret Product</h2>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="IMEI/Serial" value={imei} onChange={(e) => setImei(e.target.value)} />
        <input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button onClick={addProduct}>Add Product</button>
      </div>

      <hr />

      {/* Search */}
      <div className="search-box">
        <input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Product List */}
      <h2>All Secret Products</h2>
      <div className="product-list">
        {filteredProducts.map((p) => (
          <div key={p.id} className={`product-card ${p.is_sold ? "sold" : ""}`}>
            <h3>{p.name}</h3>
            <p>IMEI/Serial: {p.imei_or_serial}</p>
            <p>Price: {formatPrice(p.price)}</p>
            <p>Description: {p.description || "No description"}</p>
            <p>
              Sold On:{" "}
              {p.date_sold
                ? new Date(p.date_sold).toLocaleString("en-US", {
                    timeZone: "Africa/Lagos",
                    hour12: true,
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })
                : "Not sold"}
            </p>

            {!p.is_sold && (
              <button
                className="sold-btn"
                onClick={() => openModal(p)}
                disabled={confirming && selectedProduct?.id === p.id}
              >
                {confirming && selectedProduct?.id === p.id ? "Processing..." : "Mark as Sold"}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Sold Confirmation Modal */}
      {modalOpen && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Sale</h3>
            <p>Are you sure you want to mark "{selectedProduct.name}" as sold?</p>
            <div className="modal-buttons">
              <button onClick={() => setModalOpen(false)} disabled={confirming}>Cancel</button>
              <button onClick={confirmSold} disabled={confirming}>
                {confirming ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Added Modal */}
      {addedModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Product Added</h3>
            <p>The product has been added successfully!</p>
            <button onClick={() => setAddedModalOpen(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}
