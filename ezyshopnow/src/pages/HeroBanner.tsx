


function HeroBanner() {
  const handleShopNow = () => {
    document.getElementById("products")?.scrollIntoView({
      behavior: "smooth",
    });
  };

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
            rgba(27, 32, 25, 0.74) 0%,
            rgba(27, 32, 25, 0.47) 42%,
            rgba(27, 32, 25, 0.04) 100%
          );
        }

        .hero-banner-content {
          position: absolute;
          top: 50%;
          left: 9%;
          z-index: 1;
          width: 82%;
          max-width: 590px;
          color: #ffffff;
          transform: translateY(-50%);
          animation: heroFadeIn 0.8s ease-out both;
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
        }

        .hero-banner-title em {
          font-weight: 400;
        }

        .hero-banner-description {
          max-width: 430px;
          margin: 22px 0 29px;
          color: rgba(255, 255, 255, 0.91);
          font-size: 13px;
          line-height: 1.9;
        }

        .hero-banner-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 23px;
          min-height: 49px;
          padding: 0 25px;
          border: 1px solid #ffffff;
          background: #ffffff;
          color: #354638;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.2px;
          cursor: pointer;
          transition: background 0.25s, color 0.25s;
        }

        .hero-banner-button:hover {
          background: #354638;
          color: #ffffff;
        }

        .hero-banner-button span {
          font-size: 17px;
          transition: transform 0.25s;
        }

        .hero-banner-button:hover span {
          transform: translateX(4px);
        }

        .hero-banner-caption {
          position: absolute;
          right: 5%;
          bottom: 25px;
          color: #ffffff;
          font-size: 9px;
          letter-spacing: 2px;
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
              rgba(27, 32, 25, 0.78) 0%,
              rgba(27, 32, 25, 0.5) 62%,
              rgba(27, 32, 25, 0.17) 100%
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
              rgba(27, 32, 25, 0.76),
              rgba(27, 32, 25, 0.42)
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
            letter-spacing: -0.8px;
          }

          .hero-banner-description {
            max-width: 310px;
            margin: 19px 0 25px;
            font-size: 12px;
            line-height: 1.8;
          }

          .hero-banner-button {
            min-height: 46px;
            padding: 0 17px;
            gap: 15px;
            font-size: 9px;
          }

          .hero-banner-caption {
            right: 5%;
            bottom: 17px;
            font-size: 8px;
            letter-spacing: 1.3px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-banner-content {
            animation: none;
          }

          .hero-banner-button,
          .hero-banner-button span {
            transition: none;
          }
        }
      `}</style>

      <section className="hero-banner" aria-label="Featured collection">
        <img
          className="hero-banner-image"
          src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=2000&q=85"
          alt="Beautifully styled home with elegant furniture and decor"
          fetchPriority="high"
        />

        <div className="hero-banner-overlay" />

        <div className="hero-banner-content">
          <span className="hero-banner-eyebrow">
            THE ART OF BEAUTIFUL LIVING
          </span>

          <h1 className="hero-banner-title">
            Make Your Home
            <br />
            <em>Feel Like You.</em>
          </h1>

          <p className="hero-banner-description">
            Thoughtfully chosen decor and delightful gifts
            to make every moment a little more special.
          </p>

          <button
            className="hero-banner-button"
            onClick={handleShopNow}
          >
            SHOP COLLECTION
            <span>→</span>
          </button>
        </div>

        <div className="hero-banner-caption">
          DESIGNED FOR YOUR EVERYDAY
        </div>
      </section>
    </>
  );
}

export default HeroBanner;
