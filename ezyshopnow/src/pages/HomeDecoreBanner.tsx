import { Link } from "react-router-dom";

function HomeDecoreBanners() {
  const banners = [
    {
      title: "Wall Decor",
      label: "STYLE YOUR WALLS",
      description:
        "Transform your walls with elegant artwork and timeless decorative accents that make every corner special.",
      image:
        "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1000&q=85",
      link: "/products?category=Wall%20Decor",
    },
    {
      title: "Tabletop Fountains",
      label: "CREATE A CALM SPACE",
      description:
        "Bring a peaceful atmosphere into your home with beautiful accents for a relaxing, inviting space.",
      image:
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85",
      link: "/products?category=Tabletop%20Fountains",
    },
    {
      title: "Candle Holders",
      label: "A WARMER GLOW",
      description:
        "Add warmth and sophistication to your evenings with decorative pieces that create a beautiful ambience.",
      image:
        "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=85",
      link: "/products?category=Candle%20Holders",
    },
    {
      title: "Home Decor",
      label: "MAKE IT YOURS",
      description:
        "Discover thoughtful finishing touches that bring harmony, comfort, and personality to your home.",
      image:
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=85",
      link: "/products?category=Home%20Decor",
    },
  ];

  return (
    <section className="decore-banners">
      {banners.map((banner, index) => (
        <article
          className={`decore-banner ${
            index % 2 === 1 ? "reverse" : ""
          }`}
          key={banner.title }
        >
          <div className="decore-banner-content">
            <span className="decore-banner-label">{banner.label}</span>

            <h2 className="decore-banner-title">
              {index % 2 === 1 && (
                <span aria-hidden="true" className="decore-arrow">
                  ←
                </span>
              )}

              {banner.title}

              {index % 2 === 0 && (
                <span aria-hidden="true" className="decore-arrow">
                  →
                </span>
              )}
            </h2>
            <p className="decore-banner-description">
              {banner.description}
            </p>

            <Link to={banner.link} className="decore-banner-button">
              Shop Now 
            </Link>
          </div>

          <div className="decore-banner-image-wrap">
            <img
              src={banner.image}
              alt={banner.title}
              className="decore-banner-image"
              loading="lazy"
            />
          </div>
        </article>
      ))}

      <style>{`
        .decore-banners {
          width: 100%;
          max-width: none;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          overflow: hidden;
        }

        .decore-banner {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: stretch;
          min-height: 420px;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          background: #f5f3ee;
          overflow: hidden;
        }

        .decore-banner:nth-child(even) {
          background: #eeeee7;
        }

        .decore-banner.reverse .decore-banner-content {
          order: 2;
        }

        .decore-banner.reverse .decore-banner-image-wrap {
          order: 1;
        }

        .decore-banner-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          padding: clamp(28px, 6vw, 100px);
          box-sizing: border-box;
        }

        .decore-banner-label {
          color: #71816c;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 3px;
          margin-bottom: 18px;
        }

        .decore-banner-title {
          margin: 0 0 20px;
          color: #293b2d;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(30px, 4vw, 52px);
          font-weight: 400;
          line-height: 1.15;
        }

        .decore-banner-description {
          max-width: 430px;
          margin: 0 0 30px;
          color: #666a60;
          font-size: 15px;
          line-height: 1.9;
        }

        .decore-banner-button {
          display: inline-flex;
          align-items: center;
          gap: 18px;
          padding: 14px 24px;
          color: #fff;
          background: #344b38;
          text-decoration: none;
          text-transform: uppercase;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1.5px;
          transition: background 0.25s ease;
        }

        

        .decore-banner-button span {
          font-size: 18px;
          line-height: 1;
        }

        .decore-banner-image-wrap {
          width: 100%;
          height: 100%;
          min-height: 420px;
          overflow: hidden;
        }

        .decore-banner-image {
          display: block;
          width: 100%;
          height: 500px;
          min-height: 420px;
          object-fit: cover;
          object-position: center;
          transition: transform 0.5s ease;
        }

        

        @media (max-width: 768px) {
          .decore-banner {
            min-height: 300px;
          }

          .decore-banner-image-wrap,
          .decore-banner-image {
            min-height: 300px;
          }

          .decore-banner-content {
            padding: 24px;
          }

          .decore-banner-label {
            font-size: 9px;
            letter-spacing: 1.5px;
            margin-bottom: 12px;
          }

          .decore-banner-title {
            font-size: clamp(23px, 4vw, 34px);
            margin-bottom: 14px;
          }

          .decore-banner-description {
            font-size: 13px;
            line-height: 1.65;
            margin-bottom: 20px;
          }

          .decore-banner-button {
            gap: 10px;
            padding: 12px 15px;
            font-size: 10px;
          }
        }

        @media (max-width: 480px) {
          .decore-banner {
            min-height: 260px;
          }

          .decore-banner-content {
            padding: 16px 12px;
          }

          .decore-banner-image-wrap,
          .decore-banner-image {
            min-height: 260px;
          }

          .decore-banner-title {
            font-size: 23px;
          }

          .decore-banner-description {
            font-size: 12px;
            line-height: 1.5;
            margin-bottom: 15px;
          }

          .decore-banner-label {
            font-size: 8px;
            letter-spacing: 1px;
          }

          .decore-banner-button {
            padding: 10px;
            font-size: 9px;
            letter-spacing: 0.5px;
          }
        }
      `}</style>
    </section>
  );
}

export default HomeDecoreBanners;