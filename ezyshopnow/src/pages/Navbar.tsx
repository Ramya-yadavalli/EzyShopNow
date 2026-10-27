
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaHeart,
  FaShoppingCart,
  FaSearch,
} from "react-icons/fa";
import logo from "../assets/logo.png";

interface NavbarProps {
  cartCount?: number;
}

function Navbar({ cartCount = 0 }: NavbarProps) {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const query = search.trim();

    if (query) {
      window.location.href = `/products?search=${encodeURIComponent(query)}`;
    }
  };

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

        /* TOP BAR: scrolls away */
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
          gap: 18px;
        }

        .ez-icon-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;
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

        /* BOTTOM BAR: stays at the top when scrolling */
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
            gap: 13px;
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

        @media (max-width: 360px) {
          .ez-logo {
            width: 145px;
          }

          .ez-navbar-top {
            padding-right: 10px;
            padding-left: 10px;
          }

          .ez-navbar-icons {
            gap: 10px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ez-nav-links a,
          .ez-nav-links a::after,
          .ez-icon-link {
            transition: none;
          }
        }
      `}</style>

      <header className="ez-navbar">
        {/* Top bar: scrolls away */}
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
            <Link
              to="/login"
              className="ez-icon-link"
              aria-label="My account"
              title="My Account"
            >
              <FaUser />
            </Link>

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

        {/* Bottom bar: sticky while scrolling */}
        <div className="ez-navbar-bottom">
          <Link to="/" className="ez-logo-link" aria-label="EzyShop home">
            <img className="ez-logo" src={logo} alt="EzyShopNow" />
          </Link>

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
      </header>
    </>
  );
}

export default Navbar;
