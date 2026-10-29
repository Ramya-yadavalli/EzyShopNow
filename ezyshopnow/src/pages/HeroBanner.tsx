
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Image as ImageIcon,
} from "lucide-react";

interface HeroBannerItem {
  id: number;
  title: string;
  header: string;
  description: string;
  imagePath: string;
}

interface HeroBannerApiItem {
  id?: number;
  Id?: number;
  title?: string;
  Title?: string;
  header?: string;
  Header?: string;
  description?: string;
  Description?: string;
  imagePath?: string;
  ImagePath?: string;
}

type PopupMode = "add" | "edit" | "delete" | null;

const API_URL = "https://localhost:7084/api/HeroBanner";

/* -------------------- AUTHORIZATION -------------------- */

function getStoredUserRole(): string {
  const role =
    localStorage.getItem("role") ||
    localStorage.getItem("userRole");

  if (!role || !role.trim()) {
    return "";
  }

  return role.trim().toLowerCase();
}

function canManageHeroBanner(): boolean {
  const token = localStorage.getItem("token");
  const role = getStoredUserRole();

  return Boolean(token) && ["admin", "client"].includes(role);
}

/* -------------------- IMAGE HELPERS -------------------- */

const heroBannerImages = import.meta.glob<string>(
  "../assets/*",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

function getImageUrl(imagePath: string): string {
  const fileName = imagePath
    .trim()
    .replace(/\\/g, "/")
    .split("?")[0]
    .split("/")
    .pop()
    ?.toLowerCase();

  if (!fileName) return "";

  const match = Object.entries(heroBannerImages).find(
    ([path]) => path.split("/").pop()?.toLowerCase() === fileName
  );

  return match?.[1] ?? "";
}

/* -------------------- COMPONENT -------------------- */

function HeroBanner() {
  const [banner, setBanner] = useState<HeroBannerItem | null>(null);
  const [canManage, setCanManage] = useState(
    () => canManageHeroBanner()
  );

  const [popupMode, setPopupMode] = useState<PopupMode>(null);
  const [title, setTitle] = useState("");
  const [header, setHeader] = useState("");
  const [description, setDescription] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* -------------------- CHECK ROLE -------------------- */

  useEffect(() => {
    function checkAuthorization() {
      const allowed = canManageHeroBanner();

      setCanManage(allowed);

      if (!allowed) {
        setPopupMode(null);
      }
    }

    checkAuthorization();

    window.addEventListener("storage", checkAuthorization);
    window.addEventListener("authChanged", checkAuthorization);

    return () => {
      window.removeEventListener("storage", checkAuthorization);
      window.removeEventListener("authChanged", checkAuthorization);
    };
  }, []);

  /* -------------------- FETCH BANNER -------------------- */

  async function fetchBanner() {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Failed to load banner (${response.status})`);
      }

      const data: HeroBannerApiItem | HeroBannerApiItem[] =
        await response.json();

      const item = Array.isArray(data) ? data[0] : data;

      if (!item) {
        setBanner(null);
        setError("");
        return;
      }

      setBanner({
        id: item.id ?? item.Id ?? 0,
        title: item.title ?? item.Title ?? "",
        header: item.header ?? item.Header ?? "",
        description: item.description ?? item.Description ?? "",
        imagePath: item.imagePath ?? item.ImagePath ?? "",
      });

      setError("");
    } catch (err) {
      console.error("Error loading hero banner:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load banner."
      );
    }
  }

  useEffect(() => {
    void fetchBanner();
  }, []);

  /* -------------------- POPUP HANDLERS -------------------- */

  function openPopup(mode: PopupMode) {
    if (!canManageHeroBanner()) {
      setCanManage(false);
      setPopupMode(null);
      return;
    }

    setCanManage(true);
    setError("");
    setPopupMode(mode);

    if (mode === "add") {
      setTitle("");
      setHeader("");
      setDescription("");
      setImagePath("");
    } else if (banner) {
      setTitle(banner.title);
      setHeader(banner.header);
      setDescription(banner.description);
      setImagePath(banner.imagePath);
    }
  }

  function closePopup() {
    if (loading) return;
    setPopupMode(null);
    setError("");
  }

  /* -------------------- ADD / UPDATE -------------------- */

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canManageHeroBanner()) {
      setCanManage(false);
      setPopupMode(null);
      return;
    }

    if (popupMode !== "add" && popupMode !== "edit") return;

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in first.");
      return;
    }

    if (!title.trim() || !header.trim() || !description.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!getImageUrl(imagePath)) {
      setError("Image not found. Enter a filename from src/assets.");
      return;
    }

    if (popupMode === "edit" && !banner) {
      setError("No banner selected for updating.");
      return;
    }

    const isEdit = popupMode === "edit";

    const payload: HeroBannerItem = {
      id: isEdit ? banner?.id ?? 0 : 0,
      title: title.trim(),
      header: header.trim(),
      description: description.trim(),
      imagePath:
        imagePath.trim().replace(/\\/g, "/").split("/").pop() || "",
    };

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        isEdit ? `${API_URL}/${payload.id}` : API_URL,
        {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(
          (await response.text()) || `Request failed (${response.status}).`
        );
      }

      setPopupMode(null);
      await fetchBanner();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save banner."
      );
    } finally {
      setLoading(false);
    }
  }

  /* -------------------- DELETE -------------------- */

  async function handleDelete() {
    if (!canManageHeroBanner()) {
      setCanManage(false);
      setPopupMode(null);
      return;
    }

    if (!banner) return;

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in first.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/${banner.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          (await response.text()) || `Delete failed (${response.status}).`
        );
      }

      setBanner(null);
      setPopupMode(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not delete banner."
      );
    } finally {
      setLoading(false);
    }
  }

  /* -------------------- UI -------------------- */

  return (
    <>
      <style>{`
        .hero-banner {
          position: relative;
          width: 100%;
          min-height: 540px;
          height: min(47vw, 620px);
          overflow: hidden;
          background: #d8d3c7;
          font-family: Arial, sans-serif;
        }

        .hero-banner-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 55%;
        }

        .hero-banner-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            rgba(27,32,25,.74) 0%,
            rgba(27,32,25,.47) 42%,
            rgba(27,32,25,.04) 100%
          );
          pointer-events: none;
        }

        .hero-banner-content {
          position: absolute;
          top: 50%;
          left: 9%;
          z-index: 1;
          width: 82%;
          max-width: 590px;
          color: white;
          transform: translateY(-50%);
          animation: heroFadeIn .8s ease-out both;
        }

        .hero-banner-eyebrow {
          display: inline-block;
          margin-bottom: 17px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 3px;
          line-height: 1.8;
        }

        .hero-banner-title {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(42px, 5.2vw, 70px);
          font-weight: 400;
          line-height: 1.12;
          letter-spacing: -1.5px;
          overflow-wrap: anywhere;
        }

        .hero-banner-description {
          max-width: 430px;
          margin: 22px 0 29px;
          color: rgba(255,255,255,.91);
          font-size: 13px;
          line-height: 1.9;
        }

        .hero-banner-caption {
          position: absolute;
          right: 5%;
          bottom: 25px;
          z-index: 1;
          color: white;
          font-size: 9px;
          letter-spacing: 2px;
        }

        .hero-banner-admin {
          position: absolute;
          top: 20px;
          right: 22px;
          z-index: 10;
          display: flex;
          gap: 10px;
        }

        .hero-banner-admin button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border: none;
          border-radius: 50%;
          background: white;
          color: #344b38;
          box-shadow: 0 2px 10px rgba(0,0,0,.18);
          cursor: pointer;
          transition: transform .2s, background .2s;
        }

        .hero-banner-admin button:hover {
          transform: translateY(-2px);
          background: #e9eee7;
        }

        .hero-banner-admin button.delete {
          color: #c0392b;
        }

        @keyframes heroFadeIn {
          from {
            opacity: 0;
            transform: translateY(calc(-50% + 18px));
          }
          to {
            opacity: 1;
            transform: translateY(-50%);
          }
        }

        .hero-popup-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
          background: rgba(0,0,0,.55);
        }

        .hero-popup {
          box-sizing: border-box;
          width: 100%;
          max-width: 480px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 26px;
          border-radius: 10px;
          background: white;
          color: #344b38;
          box-shadow: 0 12px 40px rgba(0,0,0,.2);
        }

        .hero-popup-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 22px;
        }

        .hero-popup-header h2 {
          margin: 0;
          font: 400 25px Georgia, "Times New Roman", serif;
        }

        .hero-popup-close {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 34px;
          height: 34px;
          border: none;
          border-radius: 50%;
          cursor: pointer;
        }

        .hero-popup-close:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        .hero-popup label {
          display: block;
          margin-bottom: 15px;
          font-size: 13px;
          font-weight: 600;
        }

        .hero-popup input,
        .hero-popup textarea {
          display: block;
          box-sizing: border-box;
          width: 100%;
          margin-top: 7px;
          padding: 11px;
          border: 1px solid #d5dbd3;
          border-radius: 5px;
          font: 14px Arial, sans-serif;
        }

        .hero-popup input:focus,
        .hero-popup textarea:focus {
          outline: 2px solid rgba(52,75,56,.18);
          border-color: #344b38;
        }

        .hero-popup textarea {
          min-height: 90px;
          resize: vertical;
        }

        .hero-popup-preview {
          display: block;
          box-sizing: border-box;
          width: 100%;
          max-height: 170px;
          margin-top: 8px;
          object-fit: contain;
          background: #f2f0e9;
        }

        .hero-popup-image-message {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
          color: #777;
          font-size: 12px;
          overflow-wrap: anywhere;
        }

        .hero-popup-error {
          color: #b42318;
          font-size: 13px;
          overflow-wrap: anywhere;
          white-space: pre-wrap;
        }

        .hero-popup-actions {
          display: flex;
          justify-content: flex-end;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 22px;
        }

        .hero-popup-actions button {
          padding: 11px 18px;
          border: 1px solid #344b38;
          border-radius: 5px;
          background: #344b38;
          color: white;
          cursor: pointer;
        }

        .hero-popup-actions button:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        .hero-popup-actions button.secondary {
          background: white;
          color: #344b38;
        }

        .hero-popup-actions button.delete {
          border-color: #c0392b;
          background: #c0392b;
        }

        @media (max-width: 768px) {
          .hero-banner {
            min-height: 480px;
            height: 75vw;
            max-height: 570px;
          }

          .hero-banner-image {
            object-position: 58% center;
          }

          .hero-banner-overlay {
            background: linear-gradient(
              90deg,
              rgba(27,32,25,.78) 0%,
              rgba(27,32,25,.5) 62%,
              rgba(27,32,25,.17) 100%
            );
          }

          .hero-banner-content {
            left: 6%;
            width: 88%;
          }

          .hero-banner-title {
            font-size: clamp(40px, 7vw, 56px);
          }

          .hero-banner-description {
            max-width: 350px;
            font-size: 12px;
          }
        }

        @media (max-width: 480px) {
          .hero-banner {
            min-height: 470px;
            height: 125vw;
            max-height: 540px;
          }

          .hero-banner-image {
            object-position: 60% center;
          }

          .hero-banner-overlay {
            background: linear-gradient(
              90deg,
              rgba(27,32,25,.76),
              rgba(27,32,25,.42)
            );
          }

          .hero-banner-content {
            left: 6%;
            width: 88%;
          }

          .hero-banner-eyebrow {
            margin-bottom: 15px;
            font-size: 9px;
            letter-spacing: 2px;
          }

          .hero-banner-title {
            font-size: clamp(39px, 10vw, 49px);
            letter-spacing: -.8px;
          }

          .hero-banner-description {
            max-width: 310px;
            margin: 19px 0 25px;
            font-size: 12px;
            line-height: 1.8;
          }

          .hero-banner-caption {
            right: 5%;
            bottom: 17px;
            font-size: 8px;
            letter-spacing: 1.3px;
          }

          .hero-banner-admin {
            top: 12px;
            right: 12px;
            gap: 6px;
          }

          .hero-banner-admin button {
            width: 36px;
            height: 36px;
          }

          .hero-popup {
            padding: 20px;
          }

          .hero-popup-header h2 {
            font-size: 22px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-banner-content {
            animation: none;
          }
        }
      `}</style>

      <section className="hero-banner" aria-label="Featured collection">
        {banner && getImageUrl(banner.imagePath) && (
          <img
            className="hero-banner-image"
            src={getImageUrl(banner.imagePath)}
            alt={banner.header || "Featured collection"}
            fetchPriority="high"
          />
        )}

        <div className="hero-banner-overlay" />

        {/* Icons appear only for Admin or Client */}
        {canManage && (
          <div className="hero-banner-admin">
            <button
              type="button"
              title="Add banner"
              aria-label="Add banner"
              onClick={() => openPopup("add")}
            >
              <Plus size={21} />
            </button>

            {banner && (
              <>
                <button
                  type="button"
                  title="Edit banner"
                  aria-label="Edit banner"
                  onClick={() => openPopup("edit")}
                >
                  <Pencil size={18} />
                </button>

                <button
                  type="button"
                  className="delete"
                  title="Delete banner"
                  aria-label="Delete banner"
                  onClick={() => openPopup("delete")}
                >
                  <Trash2 size={18} />
                </button>
              </>
            )}
          </div>
        )}

        {banner ? (
          <div className="hero-banner-content">
            {banner.title && (
              <span className="hero-banner-eyebrow">
                {banner.title}
              </span>
            )}

            {banner.header && (
              <h1 className="hero-banner-title">{banner.header}</h1>
            )}

            {banner.description && (
              <p className="hero-banner-description">
                {banner.description}
              </p>
            )}
          </div>
        ) : (
          <div className="hero-banner-content">
            <h1 className="hero-banner-title">
              {error ? "Unable to load banner" : "No banner available"}
            </h1>

            {error && (
              <p className="hero-banner-description">{error}</p>
            )}
          </div>
        )}

        <div className="hero-banner-caption">
          DESIGNED FOR YOUR EVERYDAY
        </div>
      </section>

      {/* Add / Edit / Delete popup */}
      {canManage && popupMode && (
        <div
          className="hero-popup-overlay"
          onClick={() => {
            if (!loading) closePopup();
          }}
        >
          <div
            className="hero-popup"
            role="dialog"
            aria-modal="true"
            aria-labelledby="hero-popup-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="hero-popup-header">
              <h2 id="hero-popup-title">
                {popupMode === "add"
                  ? "Add Hero Banner"
                  : popupMode === "edit"
                    ? "Edit Hero Banner"
                    : "Delete Hero Banner"}
              </h2>

              <button
                type="button"
                className="hero-popup-close"
                aria-label="Close"
                disabled={loading}
                onClick={closePopup}
              >
                <X size={20} />
              </button>
            </div>

            {popupMode === "delete" ? (
              <>
                <p>Are you sure you want to delete this hero banner?</p>

                {error && (
                  <p className="hero-popup-error">{error}</p>
                )}

                <div className="hero-popup-actions">
                  <button
                    type="button"
                    className="secondary"
                    disabled={loading}
                    onClick={closePopup}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="delete"
                    disabled={loading}
                    onClick={() => void handleDelete()}
                  >
                    {loading ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={(event) => void handleSave(event)}>
                <label>
                  Title
                  <input
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Small text above heading"
                    required
                  />
                </label>

                <label>
                  Header
                  <input
                    type="text"
                    value={header}
                    onChange={(event) => setHeader(event.target.value)}
                    placeholder="Main banner heading"
                    required
                  />
                </label>

                <label>
                  Description
                  <textarea
                    value={description}
                    onChange={(event) =>
                      setDescription(event.target.value)
                    }
                    placeholder="Banner description"
                    required
                  />
                </label>

                <label>
                  Image File Name
                  <input
                    type="text"
                    value={imagePath}
                    onChange={(event) => setImagePath(event.target.value)}
                    placeholder="e.g. hero.png"
                    required
                  />
                </label>

                {imagePath.trim() && getImageUrl(imagePath) ? (
                  <img
                    className="hero-popup-preview"
                    src={getImageUrl(imagePath)}
                    alt="Hero banner preview"
                  />
                ) : (
                  <div className="hero-popup-image-message">
                    <ImageIcon size={28} />
                    <span>
                      {imagePath.trim()
                        ? "Image not found in src/assets/"
                        : "Enter an image filename to preview"}
                    </span>
                  </div>
                )}

                {error && (
                  <p className="hero-popup-error">{error}</p>
                )}

                <div className="hero-popup-actions">
                  <button
                    type="button"
                    className="secondary"
                    disabled={loading}
                    onClick={closePopup}
                  >
                    Cancel
                  </button>

                  <button type="submit" disabled={loading}>
                    {loading
                      ? "Saving..."
                      : popupMode === "add"
                        ? "Add Banner"
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

export default HeroBanner;
