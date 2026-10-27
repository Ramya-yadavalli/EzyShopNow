
import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Image as ImageIcon,
} from "lucide-react";

const API_URL = "https://localhost:7084/api/TopCategory";

interface TopCategory {
  id: number;
  imagePath: string;
  categoryName: string;
}

type PopupMode = "add" | "edit" | "delete" | null;

// Automatically discover images in src/assets/topcategories.
const categoryImages = import.meta.glob<string>(
  "../assets/topcategories/*",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

function getImageUrl(imagePath: string): string {
  if (!imagePath) return "";

  const normalizedPath = imagePath
    .replace(/\\/g, "/")
    .replace(/^\/+/, "");

  const fileName = normalizedPath.split("/").pop()?.toLowerCase();

  if (!fileName) return "";

  const match = Object.entries(categoryImages).find(([path]) => {
    return path.split("/").pop()?.toLowerCase() === fileName;
  });

  return match?.[1] || "";
}

export default function TopCategories() {
  const [categories, setCategories] = useState<TopCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [popupMode, setPopupMode] = useState<PopupMode>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<TopCategory | null>(null);

  const [categoryName, setCategoryName] = useState("");
  const [imagePath, setImagePath] = useState("");

  // Fetch categories
  async function fetchCategories() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch categories (${response.status})`
        );
      }

      const data: TopCategory[] = await response.json();
      setCategories(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load categories."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchCategories();
  }, []);

  // Open add popup
  function openAddPopup() {
    setSelectedCategory(null);
    setCategoryName("");
    setImagePath("");
    setError("");
    setPopupMode("add");
  }

  // Open edit popup
  function openEditPopup(category: TopCategory) {
    setSelectedCategory(category);
    setCategoryName(category.categoryName);
    setImagePath(category.imagePath);
    setError("");
    setPopupMode("edit");
  }

  // Open delete confirmation
  function openDeletePopup(category: TopCategory) {
    setSelectedCategory(category);
    setError("");
    setPopupMode("delete");
  }

  function closePopup() {
    setPopupMode(null);
    setSelectedCategory(null);
    setError("");
  }

  // Add or update category. Update ID is sent in the body, not URL.
  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!categoryName.trim() || !imagePath.trim()) {
      setError("Please enter the category name and image path.");
      return;
    }

    if (!getImageUrl(imagePath)) {
      setError(
        "Image not found in src/assets/topcategories. Check the filename and extension."
      );
      return;
    }

    const isEdit = popupMode === "edit";

    if (isEdit && !selectedCategory) {
      setError("No category selected for updating.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        ...(isEdit && selectedCategory
          ? { id: selectedCategory.id }
          : {}),
        categoryName: categoryName.trim(),
        imagePath: imagePath.trim(),
      };

      const method = isEdit ? "PUT" : "POST";

      console.log("API URL:", API_URL);
      console.log("Request method:", method);
      console.log("Request payload:", payload);

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
          `Unable to ${isEdit ? "update" : "add"} category (${response.status}). ${message}`
        );
      }

      closePopup();
      await fetchCategories();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to save category.";

      setError(message);
      console.error("Save category error:", err);
    } finally {
      setSaving(false);
    }
  }

  // Delete category
  async function handleDelete() {
    if (!selectedCategory) return;

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `${API_URL}/${selectedCategory.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          message || `Unable to delete category (${response.status})`
        );
      }

      closePopup();
      await fetchCategories();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete category."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="top-categories">
      <style>{`
        .top-categories {
          width: 100%;
          box-sizing: border-box;
          padding: 65px 5% 0px 75px;
          background: #fff;
          font-family: Arial, sans-serif;
          color: #293b2d;
        }

        .top-categories * {
          box-sizing: border-box;
        }

        .top-categories-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 30px;
        }

        .top-categories-title {
          margin: 0;
          font-family: Georgia, serif;
          font-size: clamp(28px, 3vw, 40px);
          font-weight: 400;
        }

        .top-categories-add {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          padding: 0;
          border: none;
          border-radius: 100px;
          background: white;
          color: #293b2d;
          cursor: pointer;
        }

        .top-categories-add:hover {
          color: #71836b;
        }

        .top-categories-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 24px;
        }

        .top-category-item {
          position: relative;
          min-width: 0;
        }

        .top-category-card {
          display: block;
          width: 100%;
          padding: 0;
          border: 1px solid transparent;
          border-radius: 6px;
          overflow: hidden;
          background: white;
          color: inherit;
          text-align: left;
        }

        .top-category-image-wrap {
          width: 100%;
          aspect-ratio: 4 / 3;
          overflow: hidden;
          background: #f2f3ef;
        }

        .top-category-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .top-category-card:hover .top-category-image {
          transform: scale(1.04);
        }

        .top-category-image-placeholder {
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          justify-content: center;
          color: #7b887b;
        }

        .top-category-name {
          padding: 16px 8px 12px;
          font-family: Georgia, serif;
          font-size: 20px;
          text-align: center;
        }

        .top-category-actions {
          position: absolute;
          z-index: 2;
          top: 10px;
          right: 10px;
          display: flex;
          gap: 10px;
        }

        .top-category-action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          padding: 0;
          border: none;
          border-radius: 100px;
          background: white;
          color: #293b2d;
          box-shadow: none;
          cursor: pointer;
        }

        .top-category-action:hover {
          color: #71836b;
        }

        .top-category-action.delete {
          color: #b42318;
        }

        .top-category-action.delete:hover {
          color: #e04438;
        }

        .top-category-message {
          padding: 25px 0;
          color: #667064;
        }

        .top-category-error {
          margin: 12px 0;
          color: #b42318;
          font-size: 14px;
          overflow-wrap: anywhere;
        }

        .top-category-overlay {
          position: fixed;
          z-index: 1000;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: #0008;
        }

        .top-category-modal {
          width: 100%;
          max-width: 460px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 26px;
          border-radius: 10px;
          background: white;
          box-shadow: 0 10px 40px #0002;
        }

        .top-category-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 22px;
        }

        .top-category-modal-header h3 {
          margin: 0;
          font-family: Georgia, serif;
          font-size: 25px;
          font-weight: 400;
        }

        .top-category-close {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border: none;
          background: transparent;
          color: #293b2d;
          cursor: pointer;
        }

        .top-category-field {
          display: block;
          width: 100%;
          margin-bottom: 16px;
        }

        .top-category-field span {
          display: block;
          margin-bottom: 7px;
          font-size: 14px;
        }

        .top-category-field input {
          width: 100%;
          padding: 12px;
          border: 1px solid #d5d9d3;
          border-radius: 5px;
          font: inherit;
        }

        .top-category-preview {
          display: block;
          width: 100%;
          max-height: 180px;
          margin: 5px 0 18px;
          border-radius: 5px;
          object-fit: contain;
          background: #f4f5f2;
        }

        .top-category-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }

        .top-category-modal-actions button {
          padding: 10px 16px;
          border: 1px solid #d5d9d3;
          border-radius: 5px;
          background: white;
          cursor: pointer;
        }

        .top-category-modal-actions .primary {
          border-color: #293b2d;
          background: #293b2d;
          color: white;
        }

        .top-category-modal-actions .danger {
          border-color: #b42318;
          background: #b42318;
          color: white;
        }

        .top-category-modal-actions button:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        @media (max-width: 1024px) {
          .top-categories-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 600px) {
          .top-categories {
            padding: 38px 5% 45px;
          }

          .top-categories-grid {
            gap: 16px;
          }

          .top-category-name {
            padding: 12px 5px;
            font-size: 17px;
          }

          .top-category-actions {
            top: 6px;
            right: 6px;
            gap: 5px;
          }

          .top-category-action {
            width: 28px;
            height: 28px;
          }

          .top-category-modal {
            padding: 20px;
          }
        }
      `}</style>

      <div className="top-categories-header">
        <h2 className="top-categories-title">Top Categories</h2>

        <button
          type="button"
          className="top-categories-add"
          onClick={openAddPopup}
          aria-label="Add category"
          title="Add category"
        >
          <Plus size={28} strokeWidth={1.7} />
        </button>
      </div>

      {loading && (
        <p className="top-category-message">Loading categories...</p>
      )}

      {!loading && error && !popupMode && (
        <p className="top-category-error">{error}</p>
      )}

      {!loading && !error && categories.length === 0 && (
        <p className="top-category-message">No categories found.</p>
      )}

      <div className="top-categories-grid">
        {categories.map((category) => {
          const imageUrl = getImageUrl(category.imagePath);

          return (
            <div className="top-category-item" key={category.id}>
              <div className="top-category-actions">
                <button
                  type="button"
                  className="top-category-action"
                  aria-label={`Edit ${category.categoryName}`}
                  title="Edit"
                  onClick={() => openEditPopup(category)}
                >
                  <Pencil size={17} strokeWidth={1.7} />
                </button>

                <button
                  type="button"
                  className="top-category-action delete"
                  aria-label={`Delete ${category.categoryName}`}
                  title="Delete"
                  onClick={() => openDeletePopup(category)}
                >
                  <Trash2 size={17} strokeWidth={1.7} />
                </button>
              </div>

              <div className="top-category-card">
                <div className="top-category-image-wrap">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={category.categoryName}
                      className="top-category-image"
                    />
                  ) : (
                    <div className="top-category-image-placeholder">
                      <ImageIcon size={36} />
                    </div>
                  )}
                </div>

                <div className="top-category-name">
                  {category.categoryName}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {popupMode && (
        <div
          className="top-category-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) closePopup();
          }}
        >
          <div
            className="top-category-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="top-category-modal-title"
          >
            <div className="top-category-modal-header">
              <h3 id="top-category-modal-title">
                {popupMode === "add"
                  ? "Add Category"
                  : popupMode === "edit"
                    ? "Edit Category"
                    : "Delete Category"}
              </h3>

              <button
                type="button"
                className="top-category-close"
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
                  <strong>{selectedCategory?.categoryName}</strong>?
                </p>

                {error && <p className="top-category-error">{error}</p>}

                <div className="top-category-modal-actions">
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
                <label className="top-category-field">
                  <span>Category Name</span>
                  <input
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Enter category name"
                    required
                  />
                </label>

                <label className="top-category-field">
                  <span>Image Path</span>
                  <input
                    value={imagePath}
                    onChange={(e) => setImagePath(e.target.value)}
                    placeholder="topcategories/Home-Decor.avif"
                    required
                  />
                </label>

                {getImageUrl(imagePath) && (
                  <img
                    src={getImageUrl(imagePath)}
                    alt="Category preview"
                    className="top-category-preview"
                  />
                )}

                <p style={{ fontSize: 12, color: "#667064" }}>
                  Enter the relative path for an image in your
                  src/assets/topcategories folder.
                </p>

                {error && <p className="top-category-error">{error}</p>}

                <div className="top-category-modal-actions">
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
                        ? "Update"
                        : "Add Category"}
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

