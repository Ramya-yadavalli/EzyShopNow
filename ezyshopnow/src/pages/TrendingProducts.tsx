
import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Image as ImageIcon,
  Star,
} from "lucide-react";

const API_URL = "https://localhost:7084/api/TrendingProducts";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  discount?: number;
  rating: number;
  reviews: number;
  imagePath: string;
  badge?: string;
}

type PopupMode = "add" | "edit" | "delete" | null;

const emptyProduct: Omit<Product, "id"> = {
  name: "",
  category: "",
  price: 0,
  originalPrice: 0,
  discount: 0,
  rating: 0,
  reviews: 0,
  imagePath: "",
  badge: "",
};

// Assumes this component is inside src/components.
const categoryImages = import.meta.glob<string>(
  "../assets/trendingproducts/*",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

function getImageUrl(imagePath: string): string {
  if (!imagePath) return "";

  const fileName = imagePath
    .replace(/\\/g, "/")
    .split("/")
    .pop()
    ?.toLowerCase();

  if (!fileName) return "";

  const match = Object.entries(categoryImages).find(([path]) => {
    return path.split("/").pop()?.toLowerCase() === fileName;
  });

  return match?.[1] || "";
}

export default function TrendingProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [popupMode, setPopupMode] = useState<PopupMode>(null);
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [formData, setFormData] =
    useState<Omit<Product, "id">>({ ...emptyProduct });

  // Fetch products
  async function fetchProducts() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch products (${response.status})`
        );
      }

      const data: Product[] = await response.json();
      setProducts(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchProducts();
  }, []);

  // Open add popup
  function openAddPopup() {
    setSelectedProduct(null);
    setFormData({ ...emptyProduct });
    setError("");
    setPopupMode("add");
  }

  // Open edit popup
  function openEditPopup(product: Product) {
    setSelectedProduct(product);

    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount ?? 0,
      rating: product.rating,
      reviews: product.reviews,
      imagePath: product.imagePath,
      badge: product.badge ?? "",
    });

    setError("");
    setPopupMode("edit");
  }

  // Open delete confirmation
  function openDeletePopup(product: Product) {
    setSelectedProduct(product);
    setError("");
    setPopupMode("delete");
  }

  function closePopup() {
    setPopupMode(null);
    setSelectedProduct(null);
    setError("");
  }

  // Update form fields
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    const numericFields = [
      "price",
      "originalPrice",
      "discount",
      "rating",
      "reviews",
    ];

    setFormData((previous) => ({
      ...previous,
      [name]: numericFields.includes(name)
        ? value === ""
          ? 0
          : Number(value)
        : value,
    }));
  }

  // Add or update product. Update ID is sent in the body, not URL.
  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.category.trim() ||
      !formData.imagePath.trim()
    ) {
      setError(
        "Please enter the product name, category, and image path."
      );
      return;
    }

    if (!getImageUrl(formData.imagePath)) {
      setError(
        "Image not found in src/assets/trendingproducts. Check the filename and extension."
      );
      return;
    }

    if (popupMode === "edit" && !selectedProduct) {
      setError("No product selected for updating.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const isEdit = popupMode === "edit";

      const payload: Product | Omit<Product, "id"> = {
        ...(isEdit && selectedProduct
          ? { id: selectedProduct.id }
          : {}),
        ...formData,
        name: formData.name.trim(),
        category: formData.category.trim(),
        imagePath: formData.imagePath.trim(),
        badge: formData.badge?.trim() || "",
      };

      const method = isEdit ? "PUT" : "POST";

      console.log("API URL:", API_URL);
      console.log("Method:", method);
      console.log("Payload:", payload);

      const response = await fetch(API_URL, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          `Unable to ${isEdit ? "update" : "add"} product (${response.status}). ${message}`
        );
      }

      closePopup();
      await fetchProducts();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to save product.";

      setError(message);
      console.error("Save product error:", err);
    } finally {
      setSaving(false);
    }
  }

  // Delete product
  async function handleDelete() {
    if (!selectedProduct) return;

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `${API_URL}/${selectedProduct.id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          message || `Unable to delete product (${response.status})`
        );
      }

      closePopup();
      await fetchProducts();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete product."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="trending-products">
      <style>{`
        .trending-products {
          width: 100%;
          box-sizing: border-box;
          padding: 65px 5% 45px 75px;
          background: #fff;
          color: #293b2d;
          font-family: Arial, sans-serif;
        }

        .trending-products * {
          box-sizing: border-box;
        }

        .trending-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 30px;
        }

        .trending-header h2 {
          margin: 0;
          font-family: Georgia, serif;
          font-size: clamp(28px, 3vw, 40px);
          font-weight: 400;
        }

        .trending-add-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 42px;
          height: 42px;
          padding: 0;
          border: none;
          border-radius: 100%;
          background: #fff;
          color: #293b2d;
          cursor: pointer;
        }

        .trending-add-btn:hover {
          color: #71836b;
        }

        .trending-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 24px;
        }

        .trending-card {
          position: relative;
          min-width: 0;
          overflow: hidden;
          border-radius: 6px;
          background: #fff;
        }

        .trending-image-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 4.5;
          overflow: hidden;
          border-radius: 6px;
          background: #f2f3ef;
        }

        .trending-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

       

        .trending-image-placeholder {
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          justify-content: center;
          color: #7b887b;
        }

        .trending-badge {
          position: absolute;
          z-index: 2;
          top: 10px;
          left: 10px;
          padding: 6px 10px;
          border-radius: 3px;
          background: #293b2d;
          color: #fff;
          font-size: 11px;
          text-transform: uppercase;
        }

        .trending-actions {
          position: absolute;
          z-index: 3;
          top: 10px;
          right: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .trending-action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          padding: 0;
          border: none;
          border-radius: 100%;
          background: #fff;
          color: #293b2d;
          cursor: pointer;
          transition: color 0.2s ease, transform 0.2s ease;
        }

        .trending-action-btn:hover {
          color: #71836b;
          transform: scale(1.06);
        }

        .trending-action-btn.delete {
          color: #b42318;
        }

        .trending-action-btn.delete:hover {
          color: #e04438;
        }

        .trending-details {
          padding: 14px 4px 10px;
        }

        .trending-name {
          margin: 0 0 10px;
          color: #293b2d;
          font-family: Georgia, serif;
          font-size: 19px;
          font-weight: 400;
          line-height: 1.4;
        }

        .trending-rating {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-bottom: 12px;
          color: #c48a20;
          font-size: 13px;
        }

        .trending-review-count {
          color: #777;
        }

        .trending-price {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 9px;
        }

        .trending-current-price {
          color: #293b2d;
          font-size: 17px;
          font-weight: 600;
        }

        .trending-original-price {
          color: #888;
          font-size: 14px;
          text-decoration: line-through;
        }

        .trending-discount {
          color: #b42318;
          font-size: 12px;
        }

        .trending-message {
          padding: 25px 0;
          color: #667064;
        }

        .trending-error {
          margin: 12px 0;
          color: #b42318;
          font-size: 14px;
          overflow-wrap: anywhere;
        }

        .trending-overlay {
          position: fixed;
          z-index: 1000;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: #0008;
        }

        .trending-modal {
          width: 100%;
          max-width: 520px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 26px;
          border-radius: 10px;
          background: #fff;
          box-shadow: 0 10px 40px #0002;
        }

        .trending-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 22px;
        }

        .trending-modal-header h3 {
          margin: 0;
          font-family: Georgia, serif;
          font-size: 25px;
          font-weight: 400;
        }

        .trending-close-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border: none;
          background: transparent;
          color: #293b2d;
          cursor: pointer;
        }

        .trending-field {
          display: block;
          width: 100%;
          margin-bottom: 15px;
        }

        .trending-field span {
          display: block;
          margin-bottom: 7px;
          font-size: 14px;
        }

        .trending-field input,
        .trending-field select {
          width: 100%;
          min-width: 0;
          padding: 11px 12px;
          border: 1px solid #d5d9d3;
          border-radius: 5px;
          background: #fff;
          color: #293b2d;
          font: inherit;
        }

        .trending-form-row {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .trending-preview {
          display: block;
          width: 100%;
          max-height: 180px;
          margin: 5px 0 18px;
          border-radius: 5px;
          object-fit: contain;
          background: #f4f5f2;
        }

        .trending-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }

        .trending-modal-actions button {
          padding: 10px 16px;
          border: 1px solid #d5d9d3;
          border-radius: 5px;
          background: #fff;
          color: #293b2d;
          cursor: pointer;
        }

        .trending-modal-actions .primary {
          border-color: #293b2d;
          background: #293b2d;
          color: #fff;
        }

        .trending-modal-actions .danger {
          border-color: #b42318;
          background: #b42318;
          color: #fff;
        }

        .trending-modal-actions button:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        @media (max-width: 1024px) {
          .trending-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .trending-products {
            padding-left: 5%;
          }
        }

        @media (max-width: 760px) {
          .trending-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 18px;
          }

          .trending-products {
            padding-top: 40px;
          }

          .trending-name {
            font-size: 17px;
          }

          .trending-actions {
            top: 7px;
            right: 7px;
            gap: 5px;
          }

          .trending-action-btn {
            width: 32px;
            height: 32px;
          }
        }

        @media (max-width: 420px) {
          .trending-grid {
            gap: 12px;
          }

          .trending-details {
            padding-top: 10px;
          }

          .trending-name {
            font-size: 16px;
          }

          .trending-modal {
            padding: 20px;
          }

          .trending-form-row {
            grid-template-columns: 1fr;
            gap: 0;
          }
        }
      `}</style>

      <div className="trending-header">
        <div>
          <h2>Trending Products</h2>
        </div>

        <button
          type="button"
          className="trending-add-btn"
          onClick={openAddPopup}
          aria-label="Add product"
          title="Add product"
        >
          <Plus size={28} strokeWidth={1.7} />
        </button>
      </div>

      {loading && (
        <p className="trending-message">Loading products...</p>
      )}

      {!loading && error && !popupMode && (
        <p className="trending-error">{error}</p>
      )}

      {!loading && !error && products.length === 0 && (
        <p className="trending-message">No trending products found.</p>
      )}

      <div className="trending-grid">
        {products.map((product) => {
          const imageUrl = getImageUrl(product.imagePath);

          return (
            <article className="trending-card" key={product.id}>
              <div className="trending-image-wrap">
                {product.badge && (
                  <span className="trending-badge">
                    {product.badge}
                  </span>
                )}

                <div className="trending-actions">
                  <button
                    type="button"
                    className="trending-action-btn"
                    aria-label={`Edit ${product.name}`}
                    title="Edit"
                    onClick={() => openEditPopup(product)}
                  >
                    <Pencil size={17} strokeWidth={1.8} />
                  </button>

                  <button
                    type="button"
                    className="trending-action-btn delete"
                    aria-label={`Delete ${product.name}`}
                    title="Delete"
                    onClick={() => openDeletePopup(product)}
                  >
                    <Trash2 size={17} strokeWidth={1.8} />
                  </button>
                </div>

                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="trending-image"
                    loading="lazy"
                    onError={(e) => {
                      console.error(
                        "Failed to load product image:",
                        product.imagePath
                      );
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="trending-image-placeholder">
                    <ImageIcon size={36} />
                  </div>
                )}
              </div>

              <div className="trending-details">
                <h3 className="trending-name">{product.name}</h3>

                <div className="trending-rating">
                  <Star size={15} fill="currentColor" />
                  <span>{product.rating}</span>
                  <span className="trending-review-count">
                    ({product.reviews} reviews)
                  </span>
                </div>

                <div className="trending-price">
                  <span className="trending-current-price">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>

                  {product.originalPrice > product.price && (
                    <span className="trending-original-price">
                      ₹{product.originalPrice.toLocaleString("en-IN")}
                    </span>
                  )}

                  {(product.discount ?? 0) > 0 && (
                    <span className="trending-discount">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {popupMode && (
        <div
          className="trending-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) closePopup();
          }}
        >
          <div
            className="trending-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="trending-modal-title"
          >
            <div className="trending-modal-header">
              <h3 id="trending-modal-title">
                {popupMode === "add"
                  ? "Add Product"
                  : popupMode === "edit"
                    ? "Edit Product"
                    : "Delete Product"}
              </h3>

              <button
                type="button"
                className="trending-close-btn"
                onClick={closePopup}
                aria-label="Close"
              >
                <X size={22} />
              </button>
            </div>

            {popupMode === "delete" ? (
              <>
                <p>
                  Are you sure you want to delete{" "}
                  <strong>{selectedProduct?.name}</strong>?
                </p>

                {error && (
                  <p className="trending-error">{error}</p>
                )}

                <div className="trending-modal-actions">
                  <button type="button" onClick={closePopup}>
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="danger"
                    disabled={saving}
                    onClick={handleDelete}
                  >
                    {saving ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleSave}>
                <label className="trending-field">
                  <span>Product Name</span>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    required
                  />
                </label>

                <label className="trending-field">
                  <span>Category</span>
                  <input
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Enter category"
                    required
                  />
                </label>

                <div className="trending-form-row">
                  <label className="trending-field">
                    <span>Price (₹)</span>
                    <input
                      name="price"
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </label>

                  <label className="trending-field">
                    <span>Original Price (₹)</span>
                    <input
                      name="originalPrice"
                      type="number"
                      min="0"
                      value={formData.originalPrice}
                      onChange={handleChange}
                      required
                    />
                  </label>
                </div>

                <div className="trending-form-row">
                  <label className="trending-field">
                    <span>Rating</span>
                    <input
                      name="rating"
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={handleChange}
                      required
                    />
                  </label>

                  <label className="trending-field">
                    <span>Reviews</span>
                    <input
                      name="reviews"
                      type="number"
                      min="0"
                      value={formData.reviews}
                      onChange={handleChange}
                      required
                    />
                  </label>
                </div>

                <div className="trending-form-row">
                  <label className="trending-field">
                    <span>Discount (%)</span>
                    <input
                      name="discount"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.discount ?? 0}
                      onChange={handleChange}
                    />
                  </label>

                  <label className="trending-field">
                    <span>Badge</span>
                    <select
                      name="badge"
                      value={formData.badge ?? ""}
                      onChange={handleChange}
                    >
                      <option value="">None</option>
                      <option value="new">New</option>
                      <option value="sale">Sale</option>
                      <option value="popular">Popular</option>
                    </select>
                  </label>
                </div>

                <label className="trending-field">
                  <span>Image Path</span>
                  <input
                    name="imagePath"
                    value={formData.imagePath}
                    onChange={handleChange}
                    placeholder="trendingproducts/ElegantCeramicVase.avif"
                    required
                  />
                </label>

                {formData.imagePath && getImageUrl(formData.imagePath) && (
                  <img
                    src={getImageUrl(formData.imagePath)}
                    alt="Product preview"
                    className="trending-preview"
                  />
                )}

                <p style={{ fontSize: 12, color: "#667064" }}>
                  The filename must exist in src/assets/trendingproducts.
                </p>

                {error && (
                  <p className="trending-error">{error}</p>
                )}

                <div className="trending-modal-actions">
                  <button type="button" onClick={closePopup}>
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="primary"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : popupMode === "edit"
                        ? "Update Product"
                        : "Add Product"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
