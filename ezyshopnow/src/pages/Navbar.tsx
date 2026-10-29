
import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaHeart,
  FaShoppingCart,
  FaSearch,
  FaSignOutAlt,
} from "react-icons/fa";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface NavbarProps {
  cartCount?: number;
}

interface JwtPayload {
  name?: string;
  given_name?: string;
  unique_name?: string;
  email?: string;
  [key: string]: unknown;
}

interface LogoItem {
  id: number;
  ImagePath: string;
  CreatedAt?: string;
  UpdatedAt?: string;
}

interface LogoApiItem {
  id?: number;
  Id?: number;
  imagePath?: string;
  ImagePath?: string;
  createdAt?: string;
  CreatedAt?: string;
  updatedAt?: string;
  UpdatedAt?: string;
}

type LogoPopupMode = "add" | "edit" | "delete" | null;

const LOGO_API = "https://localhost:7084/api/Logo";

// Automatically load images from src/assets.
const logoImages = import.meta.glob<string>("../assets/*", {
  eager: true,
  query: "?url",
  import: "default",
});

// Match an API ImagePath to the filename in src/assets.
function getLogoByFileName(imagePath: string): string | null {
  const fileName = imagePath
    .replace(/\\/g, "/")
    .split("/")
    .pop()
    ?.toLowerCase();

  if (!fileName) return null;

  const match = Object.entries(logoImages).find(
    ([path]) => path.split("/").pop()?.toLowerCase() === fileName
  );

  return match?.[1] ?? null;
}

function getStoredUserRole(): string {
  const storedRole =
    localStorage.getItem("role") ||
    localStorage.getItem("userRole");

  if (storedRole) {
    return storedRole.trim().toLowerCase();
  }

  // Support applications that store the role only in the user object.
  try {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const user = JSON.parse(storedUser);
      const role = user.role ?? user.userRole;

      if (typeof role === "string") {
        return role.trim().toLowerCase();
      }
    }
  } catch {
    // Ignore invalid stored user data.
  }

  return "";
}

function canManageLogo(): boolean {
  const token = localStorage.getItem("token");
  const role = getStoredUserRole();

  return Boolean(token?.trim()) &&
    ["admin", "client"].includes(role);
}

function Navbar({ cartCount = 0 }: NavbarProps) {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");

  const [logoItem, setLogoItem] = useState<LogoItem | null>(null);
  const [canManage, setCanManage] = useState(false);
  const [logoPopup, setLogoPopup] = useState<LogoPopupMode>(null);
  const [logoFileName, setLogoFileName] = useState("");
  const [logoError, setLogoError] = useState("");
  const [logoLoading, setLogoLoading] = useState(false);

  const navigate = useNavigate();

  // Read the logged-in user's name from the JWT token.
  const getUserName = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUserName("");
      return;
    }

    try {
      const payload = token.split(".")[1];

      if (!payload) {
        setUserName("");
        return;
      }

      const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      const decoded: JwtPayload = JSON.parse(
        atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="))
      );

      const name =
        decoded.name ||
        decoded.given_name ||
        decoded.unique_name ||
        decoded.email ||
        "";

      setUserName(typeof name === "string" ? name : "");
    } catch {
      setUserName("");
    }
  };

  // Load the logo from the database-backed API.
  // No static logo or fallback image is used.
  const fetchLogo = async () => {
    try {
      const response = await fetch(LOGO_API);

      if (!response.ok) {
        throw new Error(`Failed to fetch logo (${response.status}).`);
      }

      const data: LogoApiItem[] | LogoApiItem | null = await response.json();
      const item = Array.isArray(data) ? data[0] : data;

      const imagePath = item?.imagePath ?? item?.ImagePath;

      if (item && imagePath) {
        setLogoItem({
          id: Number(item.id ?? item.Id ?? 0),
          ImagePath: String(imagePath),
          CreatedAt: item.createdAt ?? item.CreatedAt,
          UpdatedAt: item.updatedAt ?? item.UpdatedAt,
        });
      } else {
        setLogoItem(null);
      }
    } catch (error) {
      console.error("Error loading logo:", error);
      setLogoItem(null);
    }
  };

  useEffect(() => {
    const checkPermissions = () => {
      setCanManage(canManageLogo());
      getUserName();

      if (!canManageLogo()) {
        setLogoPopup(null);
        setLogoError("");
      }
    };

    checkPermissions();
    void fetchLogo();

    window.addEventListener("authChanged", checkPermissions);
    window.addEventListener("storage", checkPermissions);

    return () => {
      window.removeEventListener("authChanged", checkPermissions);
      window.removeEventListener("storage", checkPermissions);
    };
  }, []);

  // Logout.
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userRole");
    localStorage.removeItem("user");

    setUserName("");
    setCanManage(false);
    setMenuOpen(false);
    setLogoPopup(null);

    window.dispatchEvent(new Event("authChanged"));
    navigate("/");
  };

  // Search products.
  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const query = search.trim();

    if (query) {
      navigate(`/products?search=${encodeURIComponent(query)}`);
      setSearch("");
    }
  };

  // Open a popup only for authorized users.
  const openLogoPopup = (mode: LogoPopupMode) => {
    if (!canManageLogo()) {
      setCanManage(false);
      return;
    }

    setLogoError("");
    setLogoFileName(
      mode === "edit" ? logoItem?.ImagePath ?? "" : ""
    );
    setLogoPopup(mode);
  };

  // Add or update a logo using the backend LogoDto.
  // LogoDto uses ImagePath, not fileName.
  const handleLogoSave = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!canManageLogo()) {
      setCanManage(false);
      setLogoPopup(null);
      return;
    }

    const token = localStorage.getItem("token");
    const imagePath = logoFileName.trim();

    if (!token?.trim()) {
      setLogoError("Please log in before managing the logo.");
      return;
    }

    if (!imagePath) {
      setLogoError("Please enter the logo image filename.");
      return;
    }

    const isEdit = logoPopup === "edit";

    if (logoPopup !== "add" && !isEdit) {
      setLogoError("Invalid logo operation.");
      return;
    }

    if (isEdit && !logoItem?.id) {
      setLogoError("Logo ID is missing. Refresh and try again.");
      return;
    }

    try {
      setLogoLoading(true);
      setLogoError("");

      const payload = {
        ...(isEdit ? { id: logoItem!.id } : {}),
        imagePath,
      };

      // Your controller has [HttpPut] without an {id} route.
      const response = await fetch(LOGO_API, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();

      if (!response.ok) {
        console.error(
          "Logo save failed:",
          response.status,
          responseText
        );

        throw new Error(
          responseText ||
            `Unable to ${isEdit ? "update" : "add"} logo (${response.status}).`
        );
      }

      await fetchLogo();

      setLogoPopup(null);
      setLogoFileName("");
      window.dispatchEvent(new Event("logoChanged"));
    } catch (error) {
      setLogoError(
        error instanceof Error ? error.message : "Unable to save logo."
      );
    } finally {
      setLogoLoading(false);
    }
  };

  // Delete the logo record.
  const handleLogoDelete = async () => {
    if (!canManageLogo() || !logoItem?.id) {
      setCanManage(false);
      setLogoError("No logo record is available to delete.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token?.trim()) {
      setLogoPopup(null);
      return;
    }

    try {
      setLogoLoading(true);
      setLogoError("");

      const response = await fetch(`${LOGO_API}/${logoItem.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseText = await response.text();

      if (!response.ok) {
        console.error(
          "Logo delete failed:",
          response.status,
          responseText
        );

        throw new Error(
          responseText || `Unable to delete logo (${response.status}).`
        );
      }

      setLogoItem(null);
      setLogoPopup(null);
      window.dispatchEvent(new Event("logoChanged"));
    } catch (error) {
      setLogoError(
        error instanceof Error ? error.message : "Unable to delete logo."
      );
    } finally {
      setLogoLoading(false);
    }
  };

  // Resolve the image exclusively from the API ImagePath.
  const dynamicLogo = logoItem
    ? getLogoByFileName(logoItem.ImagePath)
    : null;

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .ez-navbar {
          position: relative;
          width: 100%;
          max-width: none;
          margin: 0;
          background: #ffffff;
          font-family: Arial, sans-serif;
        }

        .ez-navbar-top {
          position: relative;
          width: 100%;
          min-height: 80px;
          display: grid;
          grid-template-columns: 1fr minmax(280px, 600px) 1fr;
          align-items: center;
          gap: 25px;
          padding: 14px 4%;
          background: #06172d;
          color: #ffffff;
        }

        .ez-welcome {
          font-size: 13px;
          font-weight: 500;
          white-space: nowrap;
        }

        .ez-search {
          display: flex;
          align-items: center;
          width: 100%;
          height: 40px;
          overflow: hidden;
          border: 1px solid #e2e2e2;
          border-radius: 25px;
          background: #ffffff;
        }

        .ez-search input {
          flex: 1;
          min-width: 0;
          height: 100%;
          padding: 0 20px;
          border: none;
          outline: none;
          background: transparent;
          color: #222222;
          font-size: 14px;
        }

        .ez-search button {
          display: grid;
          place-items: center;
          width: 48px;
          height: 100%;
          border: none;
          background: transparent;
          color: #06172d;
          cursor: pointer;
          font-size: 17px;
        }

        .ez-search button:hover {
          color: #ed6b26;
        }

        .ez-navbar-icons {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          flex-wrap: wrap;
          gap: 18px;
        }

        .ez-icon-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;
          padding: 0;
          background: transparent;
          color: #ffffff;
          text-decoration: none;
          font-size: 18px;
          cursor: pointer;
          transition: color 0.2s;
        }

        .ez-icon-link:hover {
          color: #ff762d;
        }

        .ez-user-name {
          max-width: 200px;
          overflow: hidden;
          color: #ffffff;
          font-size: 13px;
          font-weight: 600;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .ez-logout-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 11px;
          border: 1px solid rgba(255, 255, 255, 0.35);
          border-radius: 6px;
          background: transparent;
          color: #ffffff;
          font-size: 13px;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }

        .ez-logout-button:hover {
          background: #ed6b26;
          border-color: #ed6b26;
          color: #ffffff;
        }

        .ez-cart-count {
          position: absolute;
          top: -10px;
          right: -10px;
          display: grid;
          place-items: center;
          min-width: 17px;
          height: 17px;
          padding: 0 3px;
          border-radius: 50%;
          background: #ed6b26;
          color: #ffffff;
          font-size: 10px;
        }

        .ez-navbar-bottom {
          position: sticky;
          top: 0;
          z-index: 1000;
          width: 100%;
          min-height: 102px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          padding: 12px 4%;
          background: #ffffff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .ez-logo-container {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .ez-logo-link {
          display: inline-flex;
          align-items: center;
          flex-shrink: 0;
          text-decoration: none;
        }

        .ez-logo {
          display: block;
          width: 225px;
          max-width: 100%;
          height: auto;
          object-fit: contain;
        }

        .ez-logo-actions {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .ez-logo-actions button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          padding: 0;
          border: 1px solid #e5e5e5;
          border-radius: 5px;
          background: #ffffff;
          color: #06172d;
          cursor: pointer;
        }

        .ez-logo-actions button:hover {
          border-color: #ed6b26;
          background: #ed6b26;
          color: #ffffff;
        }

        .ez-nav-links {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: clamp(22px, 3.5vw, 52px);
        }

        .ez-nav-links a {
          position: relative;
          padding: 10px 0;
          color: #303030;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.7px;
          text-decoration: none;
          white-space: nowrap;
          transition: color 0.2s;
        }

        .ez-nav-links a::after {
          position: absolute;
          right: 0;
          bottom: 3px;
          left: 0;
          height: 2px;
          background: #ed6b26;
          content: "";
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s;
        }

        .ez-nav-links a:hover {
          color: #ed6b26;
        }

        .ez-nav-links a:hover::after {
          transform: scaleX(1);
        }

        .ez-mobile-menu {
          display: none;
          align-items: center;
          justify-content: center;
          border: 1px solid #e5e5e5;
          border-radius: 5px;
          padding: 8px 12px;
          background: #ffffff;
          color: #06172d;
          font-size: 20px;
          cursor: pointer;
        }

        .ez-logo-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(0, 0, 0, 0.5);
        }

        .ez-logo-modal {
          position: relative;
          width: 100%;
          max-width: 420px;
          padding: 28px;
          border-radius: 10px;
          background: #ffffff;
          color: #222222;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
        }

        .ez-logo-modal h3 {
          margin: 0 0 20px;
          color: #06172d;
        }

        .ez-logo-modal-close {
          position: absolute;
          top: 12px;
          right: 12px;
          display: grid;
          place-items: center;
          border: none;
          background: transparent;
          cursor: pointer;
        }

        .ez-logo-modal form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .ez-logo-modal input {
          width: 100%;
          padding: 11px;
          border: 1px solid #dddddd;
          border-radius: 5px;
        }

        .ez-logo-submit {
          padding: 11px 16px;
          border: none;
          border-radius: 5px;
          background: #ed6b26;
          color: #ffffff;
          cursor: pointer;
        }

        .ez-logo-submit:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .ez-logo-error {
          margin-top: 12px;
          color: #c62828;
          font-size: 13px;
          overflow-wrap: anywhere;
          white-space: pre-wrap;
        }

        @media (max-width: 900px) {
          .ez-navbar-top {
            grid-template-columns: 1fr minmax(220px, 1.5fr) auto;
            gap: 15px;
            padding-right: 3%;
            padding-left: 3%;
          }

          .ez-navbar-bottom {
            gap: 18px;
            padding-right: 3%;
            padding-left: 3%;
          }

          .ez-logo {
            width: 185px;
          }

          .ez-nav-links {
            gap: 17px;
          }

          .ez-nav-links a {
            font-size: 11px;
          }

          .ez-navbar-icons {
            gap: 12px;
          }

          .ez-user-name {
            max-width: 120px;
            font-size: 12px;
          }

          .ez-logout-button {
            padding: 7px;
            font-size: 12px;
          }
        }

        @media (max-width: 650px) {
          .ez-navbar-top {
            min-height: 105px;
            grid-template-columns: 1fr auto;
            gap: 10px 15px;
            padding: 12px 16px;
          }

          .ez-welcome {
            font-size: 12px;
          }

          .ez-search {
            grid-column: 1 / -1;
            grid-row: 2;
            height: 38px;
          }

          .ez-navbar-icons {
            gap: 10px;
          }

          .ez-user-name {
            max-width: 105px;
            font-size: 11px;
          }

          .ez-logout-button {
            gap: 4px;
            padding: 6px;
            font-size: 11px;
          }

          .ez-navbar-bottom {
            position: sticky;
            top: 0;
            z-index: 1000;
            min-height: 75px;
            gap: 12px;
            padding: 12px 16px;
          }

          .ez-logo {
            width: 175px;
          }

          .ez-logo-container {
            gap: 5px;
          }

          .ez-logo-actions {
            gap: 3px;
          }

          .ez-logo-actions button {
            width: 25px;
            height: 25px;
          }

          .ez-mobile-menu {
            display: inline-flex;
            flex-shrink: 0;
          }

          .ez-nav-links {
            position: absolute;
            top: 100%;
            right: 0;
            left: 0;
            z-index: 1001;
            display: none;
            align-items: stretch;
            gap: 0;
            padding: 8px 18px;
            border-top: 1px solid #eeeeee;
            background: #ffffff;
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.08);
          }

          .ez-nav-links.ez-menu-open {
            display: flex;
            flex-direction: column;
          }

          .ez-nav-links a {
            padding: 13px 5px;
            border-bottom: 1px solid #f0f0f0;
            font-size: 13px;
          }

          .ez-nav-links a::after {
            display: none;
          }
        }

        @media (max-width: 400px) {
          .ez-navbar-icons {
            gap: 8px;
          }

          .ez-user-name {
            max-width: 85px;
          }

          .ez-logout-button {
            padding: 5px;
          }
        }

        @media (max-width: 360px) {
          .ez-logo {
            width: 145px;
          }

          .ez-navbar-top {
            padding-right: 10px;
            padding-left: 10px;
          }

          .ez-navbar-icons {
            gap: 7px;
          }

          .ez-user-name {
            max-width: 75px;
            font-size: 10px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ez-nav-links a,
          .ez-nav-links a::after,
          .ez-icon-link,
          .ez-logout-button {
            transition: none;
          }
        }
      `}</style>

      <header className="ez-navbar">
        <div className="ez-navbar-top">
          <div className="ez-welcome">Welcome to our store</div>

          <form className="ez-search" onSubmit={handleSearch}>
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search products"
            />

            <button type="submit" aria-label="Search">
              <FaSearch />
            </button>
          </form>

          <div className="ez-navbar-icons">
            {userName ? (
              <>
                <span className="ez-user-name" title={userName}>
                  Welcome, {userName}
                </span>

                <button
                  type="button"
                  className="ez-logout-button"
                  onClick={handleLogout}
                  title="Logout"
                  aria-label="Logout"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="ez-icon-link"
                aria-label="Login"
                title="Login"
              >
                <FaUser />
              </Link>
            )}

            <Link
              to="/wishlist"
              className="ez-icon-link"
              aria-label="Wishlist"
              title="Wishlist"
            >
              <FaHeart />
            </Link>

            <Link
              to="/cart"
              className="ez-icon-link"
              aria-label="Shopping cart"
              title="Cart"
            >
              <FaShoppingCart />
              {cartCount > 0 && (
                <span className="ez-cart-count">{cartCount}</span>
              )}
            </Link>
          </div>
        </div>

        <div className="ez-navbar-bottom">
          <div className="ez-logo-container">
            {dynamicLogo && (
              <Link to="/" className="ez-logo-link" aria-label="EzyShop home">
                <img
                  className="ez-logo"
                  src={dynamicLogo}
                  alt="EzyShopNow"
                />
              </Link>
            )}

            {canManage && (
              <div className="ez-logo-actions">
                <button
                  type="button"
                  title="Add logo"
                  aria-label="Add logo"
                  onClick={() => openLogoPopup("add")}
                >
                  <Plus size={17} />
                </button>

                {logoItem && (
                  <>
                    <button
                      type="button"
                      title="Edit logo"
                      aria-label="Edit logo"
                      onClick={() => openLogoPopup("edit")}
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      title="Delete logo"
                      aria-label="Delete logo"
                      onClick={() => openLogoPopup("delete")}
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            className="ez-mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            ☰
          </button>

          <nav
            className={`ez-nav-links ${menuOpen ? "ez-menu-open" : ""}`}
            aria-label="Main navigation"
          >
            <Link
              to="/products?category=Collections"
              onClick={() => setMenuOpen(false)}
            >
              Collections
            </Link>

            <Link
              to="/products?category=Decor"
              onClick={() => setMenuOpen(false)}
            >
              Decor
            </Link>

            <Link
              to="/products?category=Gift%20Items"
              onClick={() => setMenuOpen(false)}
            >
              Gift Items
            </Link>

            <Link
              to="/products?category=Candles"
              onClick={() => setMenuOpen(false)}
            >
              Candles
            </Link>

            <Link
              to="/products?category=Jewellery"
              onClick={() => setMenuOpen(false)}
            >
              Jewellery
            </Link>

            <Link
              to="/products?category=Wall%20Decor"
              onClick={() => setMenuOpen(false)}
            >
              Wall Decor
            </Link>
          </nav>
        </div>

        {logoPopup && canManage && (
          <div className="ez-logo-modal-overlay">
            <div
              className="ez-logo-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="logo-modal-title"
            >
              <button
                type="button"
                className="ez-logo-modal-close"
                onClick={() => {
                  setLogoPopup(null);
                  setLogoError("");
                }}
                aria-label="Close popup"
              >
                <X size={20} />
              </button>

              <h3 id="logo-modal-title">
                {logoPopup === "add"
                  ? "Add Logo"
                  : logoPopup === "edit"
                    ? "Edit Logo"
                    : "Delete Logo"}
              </h3>

              {logoPopup === "delete" ? (
                <>
                  <p>Are you sure you want to delete this logo?</p>

                  <button
                    type="button"
                    className="ez-logo-submit"
                    onClick={handleLogoDelete}
                    disabled={logoLoading}
                  >
                    {logoLoading ? "Deleting..." : "Confirm Delete"}
                  </button>
                </>
              ) : (
                <form onSubmit={handleLogoSave}>
                  <label htmlFor="logoFileName">Logo file name</label>

                  <input
                    id="logoFileName"
                    type="text"
                    value={logoFileName}
                    onChange={(event) => setLogoFileName(event.target.value)}
                    placeholder="Example: logo.png"
                    required
                  />

                  <p style={{ margin: 0, fontSize: 12, color: "#666" }}>
                    Enter the exact filename of an image located in src/assets.
                  </p>

                  <button
                    type="submit"
                    className="ez-logo-submit"
                    disabled={logoLoading}
                  >
                    {logoLoading
                      ? "Saving..."
                      : logoPopup === "add"
                        ? "Add Logo"
                        : "Update Logo"}
                  </button>
                </form>
              )}

              {logoError && (
                <p className="ez-logo-error">{logoError}</p>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}

export default Navbar;
