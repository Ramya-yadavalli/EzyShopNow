
import { useState } from "react";

function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) return;

    alert("Thank you for subscribing!");
    setEmail("");
  };

  return (
    <>
      <style>{`
        .ezy-footer {
          width: 100%;
          background: #031126;
          color: #d5deec;
          font-family: Arial, sans-serif;
          box-sizing: border-box;
        }

        .ezy-footer * {
          box-sizing: border-box;
        }

        .ezy-footer-main {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 80px 50px 40px;
          display: grid;
          grid-template-columns: 1.15fr 1fr 1fr 1.05fr 1.55fr;
          gap: 38px;
          align-items: start;
        }

        .ezy-footer-logo {
          display: block;
          width: 205px;
          max-width: 100%;
          height: auto;
          object-fit: contain;
          margin-bottom: 22px;
        }

        .ezy-footer-description {
          max-width: 250px;
          margin: 0;
          color: #d0d9e8;
          font-size: 14px;
          line-height: 1.7;
        }

        .ezy-footer-column h3 {
          margin: 4px 0 26px;
          color: #ff590b;
          font-family: Arial, sans-serif;
          font-size: 15px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .ezy-footer-links {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
        }

        .ezy-footer a {
          color: #d0d9e8;
          font-size: 14px;
          line-height: 1.5;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .ezy-footer a:hover {
          color: #ff650d;
        }

        .ezy-footer-contact p {
          margin: 0 0 14px;
          font-size: 14px;
          line-height: 1.7;
          overflow-wrap: anywhere;
        }

        .ezy-footer-contact a {
          overflow-wrap: anywhere;
        }

        .ezy-newsletter-text {
          margin: 0 0 20px;
          color: #d0d9e8;
          font-size: 14px;
          line-height: 1.7;
        }

        .ezy-newsletter-form {
          display: flex;
          flex-direction: row;
          align-items: stretch;
          width: 100%;
          min-width: 0;
        }

        .ezy-newsletter-input {
          width: 65%;
          min-width: 0;
          flex: 1;
          padding: 12px 14px;
          border: 1px solid #29384d;
          border-right: none;
          border-radius: 0;
          outline: none;
          background: #132136;
          color: #ffffff;
          font-size: 13px;
        }

        .ezy-newsletter-input::placeholder {
          color: #8490a3;
        }

        .ezy-newsletter-input:focus {
          border-color: #ff650d;
        }

        .ezy-newsletter-button {
          flex-shrink: 0;
          padding: 12px 16px;
          border: 1px solid #e95b00;
          border-radius: 0;
          background: #e95b00;
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .ezy-newsletter-button:hover {
          background: #ff7019;
        }

        .ezy-footer-socials {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 20px;
        }

        .ezy-footer-socials a {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #343638;
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          transition: background 0.2s ease;
        }

        .ezy-footer-socials a:hover {
          background: #e95b00;
        }

        .ezy-footer-bottom {
          width: calc(100% - 100px);
          max-width: 1300px;
          margin: 0 auto;
          min-height: 72px;
          border-top: 1px solid rgba(255,255,255,0.04);
          padding: 22px 0;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 5px;
          flex-wrap: wrap;
          text-align: center;
        }

        .ezy-footer-bottom p {
          margin: 0;
          color: #68778d;
          font-size: 13px;
          line-height: 1.8;
        }

        .ezy-footer-legal {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 5px;
        }

        .ezy-footer-legal a,
        .ezy-footer-legal span {
          color: #68778d;
          font-size: 13px;
        }

        @media (min-width: 1401px) {
          .ezy-footer-main {
            padding-left: 50px;
            padding-right: 50px;
          }
        }

        @media (max-width: 1100px) {
          .ezy-footer-main {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 40px 30px;
            padding: 55px 35px 40px;
          }

          .ezy-footer-logo-column {
            grid-column: span 1;
          }

          .ezy-footer-newsletter {
            grid-column: span 2;
          }

          .ezy-footer-bottom {
            width: calc(100% - 70px);
          }
        }

        @media (max-width: 700px) {
          .ezy-footer-main {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 35px 22px;
            padding: 42px 24px 35px;
          }

          .ezy-footer-logo-column,
          .ezy-footer-newsletter {
            grid-column: 1 / -1;
          }

          .ezy-footer-logo {
            width: 190px;
          }

          .ezy-footer-description {
            max-width: 360px;
          }

          .ezy-footer-bottom {
            width: calc(100% - 48px);
            padding: 20px 0;
          }
        }

        @media (max-width: 420px) {
          .ezy-footer-main {
            grid-template-columns: 1fr;
            gap: 30px;
            padding: 35px 20px;
          }

          .ezy-footer-logo-column,
          .ezy-footer-newsletter {
            grid-column: auto;
          }

          .ezy-footer-column h3 {
            margin-bottom: 18px;
          }

          .ezy-footer-bottom {
            flex-direction: column;
            gap: 5px;
          }

          .ezy-newsletter-button {
            padding: 12px 11px;
            font-size: 10px;
          }
        }
      `}</style>

      <footer className="ezy-footer">
        <div className="ezy-footer-main">
          {/* Company Information */}
          <div className="ezy-footer-logo-column">
            <a href="https://ezyshopnow.com/index.html">
              <img
                src="https://ezyshopnow.com/images/ezyshopnow-ftr-logo.png"
                alt="EzyShopNow"
                className="ezy-footer-logo"
              />
            </a>

            <p className="ezy-footer-description">
              We are an online lifestyle store offering the latest in
              fashion, electronics, and home decor. Our mission is to
              provide high-quality products with exceptional service.
            </p>

            <div className="ezy-footer-socials">
              <a href="#" aria-label="Facebook">f</a>
              <a href="#" aria-label="Twitter">♥</a>
              <a href="#" aria-label="Instagram">◎</a>
              <a href="#" aria-label="LinkedIn">in</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="ezy-footer-column">
            <h3>Quick Links</h3>
            <div className="ezy-footer-links">
              <a href="#">Decor</a>
              <a href="#">Gift Items</a>
              <a href="#">Candles</a>
              <a href="#">Jewellery</a>
              <a href="#">Wall Decor</a>
            </div>
          </div>

          {/* Support */}
          <div className="ezy-footer-column">
            <h3>Support</h3>
            <div className="ezy-footer-links">
              <a href="#">Your Account</a>
              <a href="#">Shipping Policy</a>
              <a href="#">Returns &amp; Exchanges</a>
              <a href="#">FAQs</a>
            </div>
          </div>

          {/* Contact */}
          <div className="ezy-footer-column ezy-footer-contact">
            <h3>Contact Us</h3>
            <div className="ezy-footer-links">
              <a href="#">Contact Us</a>
              <a href="https://ezyshopnow.com/about-us.html">
                About Us
              </a>
              <a href="#">Blog</a>
              <a href="tel:+919876862727">+91-9876862727</a>
              <a href="mailto:Support@ezyshopnow.com">
                Support@ezyshopnow.com
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="ezy-footer-column ezy-footer-newsletter">
            <h3>Stay Updated</h3>

            <p className="ezy-newsletter-text">
              Subscribe to our newsletter to get the latest updates
              and exclusive offers.
            </p>

            <form
              className="ezy-newsletter-form"
              onSubmit={handleSubscribe}
            >
              <input
                type="email"
                className="ezy-newsletter-input"
                placeholder="Your email address"
                aria-label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button
                type="submit"
                className="ezy-newsletter-button"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="ezy-footer-bottom">
          <p>© 2025 Ezyshopnow Inc. All rights reserved.</p>

          <div className="ezy-footer-legal">
            <span aria-hidden="true">|</span>
            <a href="#">Privacy Policy</a>
            <span aria-hidden="true">|</span>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;