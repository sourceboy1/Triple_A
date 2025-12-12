import React, { useEffect, useState } from "react";
import Api from "../Api";
import "./SecretProducts.css";

const SECRET_PATH = "/x9a7-secret-ops/";
const ITEMS_PER_PAGE = 20;

export default function SecretProducts() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [imei, setImei] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [addedModalOpen, setAddedModalOpen] = useState(false);
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [confirming, setConfirming] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  const formatPrice = (value) => {
    if (!value && value !== 0) return "₦0.00";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(value);
  };

  const loadProducts = async () => {
    try {
      const res = await Api.get(`${SECRET_PATH}records/`);

      // Records now include cleaned_imei from backend (if available)
      const sorted = res.data.records.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );

      setProducts(sorted);
    } catch (err) {
      console.error("Failed to load products", err);
    }
  };

  // IMEI input: remove all whitespace every time
  const onImeiChange = (value) => {
    const cleaned = value.replace(/\s+/g, ""); // removes all spaces
    setImei(cleaned);
  };

  const addProduct = async () => {
    const cleanName = (name || "").trim();
    const cleanImei = (imei || "").replace(/\s+/g, "");

    if (!cleanName || !cleanImei) {
      return alert("Name and IMEI/Serial required (no spaces allowed)");
    }

    try {
      // check duplicate through API
      const check = await Api.post(`${SECRET_PATH}check-imei/`, {
        imei_or_serial: cleanImei,
      });

      if (check.data.exists) {
        setDuplicateModalOpen(true);
        return;
      }

      await Api.post(`${SECRET_PATH}add/`, {
        name: cleanName,
        imei_or_serial: cleanImei,
        price,
        description,
      });

      // reset fields
      setName("");
      setImei("");
      setPrice("");
      setDescription("");

      setAddedModalOpen(true);
      await loadProducts();

      // After loading new items, jump to first page so user sees the new product if it matches search
      setCurrentPage(1);
    } catch (err) {
      console.error(err);

      if (err.response?.data?.error === "duplicate") {
        setDuplicateModalOpen(true);
      } else {
        alert("Failed to add product");
      }
    }
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const confirmSold = async () => {
    if (!selectedProduct) return;
    setConfirming(true);

    try {
      await Api.post(`${SECRET_PATH}mark-sold/${selectedProduct.id}/`);
      setModalOpen(false);
      setConfirming(false);
      setSelectedProduct(null);
      await loadProducts();
    } catch (err) {
      console.error(err);
      setConfirming(false);
      alert("Failed to mark as sold");
    }
  };

  // SEARCH FIX — uses cleaned IMEI if available
  const filteredProducts = products
    .filter((p) => {
      const search = (searchTerm || "").toLowerCase().replace(/\s+/g, ""); // remove spaces from search

      const nameMatch = (p.name || "").toString().toLowerCase().includes(search);

      // backend provides cleaned_imei — safe to use when present
      const imeiSource =
        p.cleaned_imei !== undefined ? p.cleaned_imei : (p.imei_or_serial || "");

      const imeiMatch = imeiSource
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "")
        .includes(search);

      return nameMatch || imeiMatch;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  // reset page to 1 when search term changes or product set changes (so UI doesn't show empty page)
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, products.length]);

  useEffect(() => {
    loadProducts();
  }, []);

  // Pagination calculations
  const totalItems = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pageItems = filteredProducts.slice(startIndex, endIndex);

  const goToPage = (page) => {
    const p = Math.max(1, Math.min(totalPages, page));
    setCurrentPage(p);
    // scroll into view so user sees top of list (optional)
    const top = document.querySelector(".product-list");
    if (top) top.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const prevPage = () => goToPage(currentPage - 1);
  const nextPage = () => goToPage(currentPage + 1);

  // generate pages array (simple). If many pages you could compact with ellipses later.
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="secret-dashboard">
      <h1>Secret Product Dashboard</h1>

      {/* Add Product Form */}
      <div className="add-product-form">
        <h2>Add Secret Product</h2>

        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />

        <input placeholder="IMEI/Serial" value={imei} onChange={(e) => onImeiChange(e.target.value)} />

        <input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />

        <input
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button onClick={addProduct}>Add Product</button>
      </div>

      <hr />

      {/* Search */}
      <div className="search-box">
        <input
          placeholder="Search products by name or IMEI..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Product List */}
      <h2>All Secret Products</h2>

      <div className="list-meta">
        <div>
          Showing {totalItems === 0 ? 0 : startIndex + 1} - {Math.min(endIndex, totalItems)} of {totalItems}
        </div>
      </div>

      <div className="product-list">
        {pageItems.map((p) => (
          <div key={p.id} className={`product-card ${p.is_sold ? "sold" : ""}`}>
            <h3>{p.name}</h3>
            <p className="imei"><strong>IMEI/Serial:</strong> {p.imei_or_serial}</p>
            <p className="price"><strong>Price:</strong> {formatPrice(p.price)}</p>
            <p className="desc">{p.description || "No description"}</p>

            <p className="sold-on">
              <strong>Sold On:</strong>{" "}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-wrap">
          <button className="page-btn" onClick={prevPage} disabled={currentPage === 1}>
            Prev
          </button>

          <div className="page-numbers">
            {pages.map((pg) => (
              <button
                key={pg}
                className={`page-btn ${pg === currentPage ? "active" : ""}`}
                onClick={() => goToPage(pg)}
              >
                {pg}
              </button>
            ))}
          </div>

          <button className="page-btn" onClick={nextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}

      {/* Sold Confirmation Modal */}
      {modalOpen && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Sale</h3>
            <p>Are you sure you want to mark "{selectedProduct.name}" as sold?</p>
            <div className="modal-buttons">
              <button onClick={() => setModalOpen(false)} disabled={confirming}>
                Cancel
              </button>
              <button onClick={confirmSold} disabled={confirming}>
                {confirming ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Duplicate IMEI Modal */}
      {duplicateModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Duplicate IMEI</h3>
            <p>This IMEI/Serial number already exists in the system.</p>
            <button onClick={() => setDuplicateModalOpen(false)}>OK</button>
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
