
import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Image as ImageIcon,
} from "lucide-react";

interface HomeDecorItem {
  id: number;
  name: string;
  imagePath: string;
}

interface HomeDecorApiItem {
  id?: number;
  Id?: number;
  name?: string;
  Name?: string;
  imagePath?: string;
  ImagePath?: string;
}

type PopupMode = "add" | "edit" | "delete" | null;

const API_URL = "https://localhost:7084/api/HomeDecore";

const homeDecorImages = import.meta.glob<string>(
  "../assets/homedecore/*",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

const availableImages = Object.keys(homeDecorImages).map((path) => ({
  path,
  name: path.split("/").pop() || path,
}));

// Match the role-checking logic used in HeroBanner and BlogPosts.
function getStoredUserRole(): string {
  const role =
    localStorage.getItem("role") ||
    localStorage.getItem("userRole");

  if (!role || !role.trim()) return "";

  return role.trim().toLowerCase();
}

// Only admin and client users with a token can manage Home Decor items.
function canManageHomeDecor(): boolean {
  const token = localStorage.getItem("token");
  const role = getStoredUserRole();

  return Boolean(token?.trim()) &&
    ["admin", "client"].includes(role);
}

function getImageUrl(imagePath: string): string {
  if (!imagePath) return "";

  const fileName = imagePath
    .replace(/\\/g, "/")
    .split("?")[0]
    .split("/")
    .pop()
    ?.toLowerCase();

  if (!fileName) return "";

  const match = Object.entries(homeDecorImages).find(([path]) => {
    return path.split("/").pop()?.toLowerCase() === fileName;
  });

  return match?.[1] || "";
}

function HomeDecore() {
  const [homeDecorItems, setHomeDecorItems] = useState<HomeDecorItem[]>([]);

  const [canManage, setCanManage] = useState(
    () => canManageHomeDecor()
  );

  const [popupMode, setPopupMode] = useState<PopupMode>(null);
  const [selectedItem, setSelectedItem] = useState<HomeDecorItem | null>(null);

  const [name, setName] = useState("");
  const [imagePath, setImagePath] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Refresh permissions after login or logout.
  useEffect(() => {
    function checkPermissions() {
      const allowed = canManageHomeDecor();

      setCanManage(allowed);

      if (!allowed) {
        setPopupMode(null);
        setSelectedItem(null);
        setError("");
      }
    }

    checkPermissions();

    window.addEventListener("storage", checkPermissions);
    window.addEventListener("authChanged", checkPermissions);

    return () => {
      window.removeEventListener("storage", checkPermissions);
      window.removeEventListener("authChanged", checkPermissions);
    };
  }, []);

  // Fetch Home Decor items.
  async function fetchHomeDecorItems() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          `Could not load Home Decor items (${response.status}).`
        );
      }

      const data: HomeDecorApiItem[] = await response.json();

      setHomeDecorItems(
        data.map((item, index) => ({
          id: item.id ?? item.Id ?? index + 1,
          name: item.name ?? item.Name ?? "",
          imagePath: item.imagePath ?? item.ImagePath ?? "",
        }))
      );
    } catch (err) {
      console.error("Error fetching Home Decor items:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Could not load Home Decor items."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchHomeDecorItems();
  }, []);

  function openAddPopup() {
    if (!canManageHomeDecor()) return;

    setSelectedItem(null);
    setName("");
    setImagePath("");
    setError("");
    setSuccess("");
    setPopupMode("add");
  }

  function openEditPopup(item: HomeDecorItem) {
    if (!canManageHomeDecor()) return;

    setSelectedItem(item);
    setName(item.name);
    setImagePath(item.imagePath);
    setError("");
    setSuccess("");
    setPopupMode("edit");
  }

  function openDeletePopup(item: HomeDecorItem) {
    if (!canManageHomeDecor()) return;

    setSelectedItem(item);
    setError("");
    setSuccess("");
    setPopupMode("delete");
  }

  function closePopup() {
    if (loading) return;

    setPopupMode(null);
    setSelectedItem(null);
    setError("");
  }

  function getAuthHeaders(): HeadersInit {
    if (!canManageHomeDecor()) {
      throw new Error(
        "Only admin or client users can manage Home Decor items."
      );
    }

    const token = localStorage.getItem("token");

    if (!token?.trim()) {
      throw new Error("Please log in before managing Home Decor items.");
    }

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !canManageHomeDecor() ||
      (popupMode !== "add" && popupMode !== "edit")
    ) {
      setCanManage(canManageHomeDecor());
      setError("Only admin or client users can manage Home Decor items.");
      return;
    }

    if (!name.trim() || !imagePath.trim()) {
      setError("Please enter a name and select an image.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const isEditing = popupMode === "edit";

      if (isEditing && !selectedItem) {
        throw new Error("No Home Decor item selected for updating.");
      }

      const payload = {
        id: isEditing ? selectedItem?.id : 0,
        name: name.trim(),
        imagePath: imagePath.trim(),
      };

      const response = await fetch(API_URL, {
        method: isEditing ? "PUT" : "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          message ||
            `${isEditing ? "Update" : "Create"} failed (${response.status}).`
        );
      }

      await fetchHomeDecorItems();

      setPopupMode(null);
      setSelectedItem(null);
      setName("");
      setImagePath("");
      setSuccess(
        isEditing
          ? "Home Decor item updated successfully."
          : "Home Decor item added successfully."
      );
    } catch (err) {
      console.error("Error saving Home Decor item:", err);

      setError(
        err instanceof Error ? err.message : "Unable to save item."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!canManageHomeDecor()) {
      setCanManage(false);
      setError("Only admin or client users can manage Home Decor items.");
      return;
    }

    if (!selectedItem) return;

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await fetch(`${API_URL}/${selectedItem.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          message || `Delete failed (${response.status}).`
        );
      }

      setHomeDecorItems((items) =>
        items.filter((item) => item.id !== selectedItem.id)
      );

      setPopupMode(null);
      setSelectedItem(null);
      setSuccess("Home Decor item deleted successfully.");
    } catch (err) {
      console.error("Error deleting Home Decor item:", err);

      setError(
        err instanceof Error ? err.message : "Unable to delete item."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        .home-decore {
          padding: 65px 5%;
          background: #fff;
          font-family: Arial, sans-serif;
          color: #293b2d;
        }

        .home-decore-header {
          max-width: 1300px;
          margin: 0 auto 35px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .home-decore-title {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(30px, 4vw, 42px);
          font-weight: 400;
        }

        .home-decore-add {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          border: 1px solid #344b38;
          border-radius: 50%;
          background: #344b38;
          color: #fff;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .home-decore-add:hover {
          background: #263a2a;
          transform: scale(1.05);
        }

        .home-decore-grid {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 28px;
          max-width: 1300px;
          margin: 0 auto;
        }

        .home-decore-card {
          position: relative;
          min-width: 0;
          overflow: hidden;
          background: #fff;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .home-decore-image-wrap {
          width: 100%;
          aspect-ratio: 4 / 3;
          overflow: hidden;
          background: #f1f0eb;
        }

        .home-decore-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .home-decore-card:hover .home-decore-image {
          transform: scale(1.04);
        }

        .home-decore-actions {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 2;
          display: flex;
          gap: 7px;
        }

        .home-decore-action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border: none;
          border-radius: 50%;
          background: #fff;
          color: #344b38;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.14);
          cursor: pointer;
        }

        .home-decore-action:hover {
          background: #344b38;
          color: #fff;
        }

        .home-decore-action.delete {
          color: #c0392b;
        }

        .home-decore-action.delete:hover {
          background: #c0392b;
          color: #fff;
        }

        .home-decore-info {
          padding: 20px;
        }

        .home-decore-name {
          margin: 0;
          color: #303b30;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 20px;
          font-weight: 400;
          overflow-wrap: anywhere;
        }

        .home-decore-empty {
          grid-column: 1 / -1;
          color: #777;
          text-align: center;
          padding: 30px 0;
        }

        .home-decore-notice {
          max-width: 1300px;
          margin: 0 auto 18px;
          font-size: 14px;
        }

        .home-decore-notice.error {
          color: #b42318;
        }

        .home-decore-notice.success {
          color: #287443;
        }

        .home-decore-popup-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(0, 0, 0, 0.5);
          overflow-y: auto;
        }

        .home-decore-popup {
          width: 100%;
          max-width: 480px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 28px;
          border-radius: 10px;
          background: #fff;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
        }

        .home-decore-popup-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 22px;
        }

        .home-decore-popup h3 {
          margin: 0;
          color: #344b38;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 24px;
          font-weight: 400;
        }

        .home-decore-close {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border: none;
          border-radius: 50%;
          background: #f2f2ee;
          color: #344b38;
          cursor: pointer;
        }

        .home-decore-field {
          display: block;
          margin-bottom: 18px;
        }

        .home-decore-field > span {
          display: block;
          margin-bottom: 8px;
          color: #344b38;
          font-size: 13px;
          font-weight: 600;
        }

        .home-decore-input,
        .home-decore-select {
          width: 100%;
          box-sizing: border-box;
          padding: 12px;
          border: 1px solid #d8ddd6;
          border-radius: 5px;
          background: #fff;
          color: #293b2d;
          font: inherit;
        }

        .home-decore-preview {
          display: block;
          width: 100%;
          max-height: 190px;
          margin-top: 12px;
          border-radius: 5px;
          object-fit: contain;
          background: #f5f4ef;
        }

        .home-decore-delete-preview {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 18px 0 24px;
        }

        .home-decore-delete-preview img {
          width: 90px;
          height: 75px;
          object-fit: cover;
          border-radius: 5px;
        }

        .home-decore-popup-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 24px;
        }

        .home-decore-popup-button {
          padding: 11px 18px;
          border: 1px solid #344b38;
          border-radius: 5px;
          background: #344b38;
          color: #fff;
          cursor: pointer;
        }

        .home-decore-popup-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .home-decore-popup-button.cancel {
          background: #fff;
          color: #344b38;
        }

        .home-decore-popup-button.delete {
          border-color: #c0392b;
          background: #c0392b;
        }

        @media (max-width: 1200px) {
          .home-decore-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 900px) {
          .home-decore-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 20px;
          }
        }

        @media (max-width: 600px) {
          .home-decore {
            padding: 42px 16px;
          }

          .home-decore-header {
            margin-bottom: 25px;
          }

          .home-decore-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 12px;
          }

          .home-decore-info {
            padding: 12px;
          }

          .home-decore-name {
            font-size: 16px;
          }

          .home-decore-actions {
            top: 6px;
            right: 6px;
            gap: 5px;
          }

          .home-decore-action {
            width: 30px;
            height: 30px;
          }

          .home-decore-add {
            width: 40px;
            height: 40px;
          }

          .home-decore-popup {
            padding: 22px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .home-decore-card,
          .home-decore-image,
          .home-decore-add {
            transition: none;
          }
        }
      `}</style>

      <section className="home-decore" aria-labelledby="home-decore-heading">
        <header className="home-decore-header">
          <h2 className="home-decore-title" id="home-decore-heading">
            Home Decor
          </h2>

          {canManage && (
            <button
              type="button"
              className="home-decore-add"
              aria-label="Add Home Decor item"
              title="Add Home Decor item"
              onClick={openAddPopup}
            >
              <Plus size={25} />
            </button>
          )}
        </header>

        {error && !popupMode && (
          <p className="home-decore-notice error" role="alert">
            {error}
          </p>
        )}

        {success && (
          <p className="home-decore-notice success" role="status">
            {success}
          </p>
        )}

        <div className="home-decore-grid">
          {loading && homeDecorItems.length === 0 ? (
            <p className="home-decore-empty">
              Loading Home Decor items...
            </p>
          ) : homeDecorItems.length === 0 ? (
            <p className="home-decore-empty">
              No Home Decor items found.
            </p>
          ) : (
            homeDecorItems.map((item) => {
              const imageUrl = getImageUrl(item.imagePath);

              return (
                <article className="home-decore-card" key={item.id}>
                  {canManage && (
                    <div className="home-decore-actions">
                      <button
                        type="button"
                        className="home-decore-action"
                        title="Edit"
                        aria-label={`Edit ${item.name}`}
                        onClick={() => openEditPopup(item)}
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        className="home-decore-action delete"
                        title="Delete"
                        aria-label={`Delete ${item.name}`}
                        onClick={() => openDeletePopup(item)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}

                  <div className="home-decore-image-wrap">
                    {imageUrl ? (
                      <img
                        className="home-decore-image"
                        src={imageUrl}
                        alt={item.name}
                        loading="lazy"
                      />
                    ) : (
                      <div
                        style={{
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#899184",
                        }}
                      >
                        <ImageIcon size={32} />
                      </div>
                    )}
                  </div>

                  <div className="home-decore-info">
                    <h3 className="home-decore-name">{item.name}</h3>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>

      {canManage && popupMode && (
        <div
          className="home-decore-popup-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closePopup();
            }
          }}
        >
          <div
            className="home-decore-popup"
            role="dialog"
            aria-modal="true"
            aria-labelledby="home-decore-popup-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="home-decore-popup-header">
              <h3 id="home-decore-popup-title">
                {popupMode === "add"
                  ? "Add Home Decor"
                  : popupMode === "edit"
                    ? "Edit Home Decor"
                    : "Delete Home Decor"}
              </h3>

              <button
                type="button"
                className="home-decore-close"
                onClick={closePopup}
                disabled={loading}
                aria-label="Close popup"
              >
                <X size={20} />
              </button>
            </div>

            {popupMode === "delete" ? (
              <>
                <p>
                  Are you sure you want to delete{" "}
                  <strong>{selectedItem?.name}</strong>?
                </p>

                <div className="home-decore-delete-preview">
                  {selectedItem &&
                    getImageUrl(selectedItem.imagePath) && (
                      <img
                        src={getImageUrl(selectedItem.imagePath)}
                        alt={selectedItem.name}
                      />
                    )}

                  <span>
                    This item will be removed from the database.
                  </span>
                </div>

                {error && (
                  <p className="home-decore-notice error">{error}</p>
                )}

                <div className="home-decore-popup-buttons">
                  <button
                    type="button"
                    className="home-decore-popup-button cancel"
                    onClick={closePopup}
                    disabled={loading}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="home-decore-popup-button delete"
                    onClick={() => void handleDelete()}
                    disabled={loading}
                  >
                    {loading ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={(event) => void handleSave(event)}>
                <label className="home-decore-field">
                  <span>Item Name *</span>

                  <input
                    className="home-decore-input"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Enter Home Decor name"
                    required
                    maxLength={200}
                  />
                </label>

                <label className="home-decore-field">
                  <span>Select Image *</span>

                  <select
                    className="home-decore-select"
                    value={imagePath}
                    onChange={(event) => setImagePath(event.target.value)}
                    required
                  >
                    <option value="">Choose an image</option>

                    {availableImages.map((image) => (
                      <option key={image.path} value={image.name}>
                        {image.name}
                      </option>
                    ))}
                  </select>
                </label>

                {imagePath && getImageUrl(imagePath) && (
                  <img
                    className="home-decore-preview"
                    src={getImageUrl(imagePath)}
                    alt="Selected Home Decor preview"
                  />
                )}

                {error && (
                  <p className="home-decore-notice error">{error}</p>
                )}

                <div className="home-decore-popup-buttons">
                  <button
                    type="button"
                    className="home-decore-popup-button cancel"
                    onClick={closePopup}
                    disabled={loading}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="home-decore-popup-button"
                    disabled={loading}
                  >
                    {loading
                      ? "Saving..."
                      : popupMode === "add"
                        ? "Add Item"
                        : "Save Changes"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default HomeDecore;
