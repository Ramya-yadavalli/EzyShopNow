
function Offers() {
  const offers = [
    {
      id: 1,
      title: "Nintendo Switch 2",
      description: "Pre-order games & accessories.",
      image:
        "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&q=85",
      className: "offer-card-nintendo",
      imageClass: "offer-image-nintendo",
    },
    {
      id: 2,
      title: "$100 Bonus Reward",
      description: "with $999 spent on select TVs.",
      image:
        "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=85",
      className: "offer-card-reward",
      imageClass: "offer-image-reward",
    },
    {
      id: 3,
      title: "Save up to 40%",
      description: "on select major appliances.",
      image:
        "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=800&q=85",
      className: "offer-card-appliances",
      imageClass: "offer-image-appliances",
    },
  ];

  return (
    <section className="offers-section">
      <div className="offers-grid">
        {offers.map((offer) => (
          <article
            className={`offer-card ${offer.className}`}
            key={offer.id}
          >
            <div className="offer-image-wrap">
              <img
                src={offer.image}
                alt={offer.title}
                className={`offer-image ${offer.imageClass}`}
                loading="lazy"
              />
            </div>

            <div className="offer-content">
              <h3 className="offer-title">{offer.title}</h3>
              <p className="offer-description">
                {offer.description}
              </p>
            </div>
          </article>
        ))}
      </div>

      <style>{`
        .offers-section {
          width: 100%;
          margin: 0;
          padding: 60px 4% 60px;
          background: #ffffff;
          color: #111111;
          box-sizing: border-box;
          font-family: Arial, Helvetica, sans-serif;
        }

        .offers-section *,
        .offers-section *::before,
        .offers-section *::after {
          box-sizing: border-box;
        }

        .offers-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 30px;
          width: 100%;
          max-width: 1500px;
          margin: 0 auto;
        }

        .offer-card {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          justify-content: flex-start;
          min-width: 0;
          min-height: 320px;
          padding: 30px;
          overflow: hidden;
          text-align: left;
          transition: transform 0.6s ease, box-shadow 0.6s ease;
          cursor: pointer;
        }
          .offer-card:hover {
            transform: translateY(-10px);
            
         }

        /* Nintendo promotion */
        .offer-card-nintendo {
          background: #ed0017;
        }

        /* Bonus reward promotion */
        .offer-card-reward {
          background: #e5e7eb;
        }

        /* Appliance promotion */
        .offer-card-appliances {
          background: #cfe1e3;
        }

        .offer-image-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 190px;
          margin: 0 0 14px;
          overflow: hidden;
          background: transparent;
        }

        .offer-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
          transition: transform 0.3s ease;
        }

        

        .offer-image-nintendo {
          max-width: 100%;
        }

        .offer-image-reward {
          max-width: 85%;
          object-fit: contain;
        }

        .offer-image-appliances {
          max-width: 100%;
          object-fit: contain;
        }

        .offer-content {
          width: 100%;
          margin-top: auto;
          text-align: left;
        }

        .offer-title {
          margin: 0 0 5px;
          color: #080808;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 20px;
          font-weight: 700;
          line-height: 1.4;
        }

        .offer-description {
          margin: 0;
          color: #080808;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 1.6;
        }

        /* Laptop and tablet */
        @media (max-width: 1000px) {
          .offers-section {
            padding: 40px 25px;
          }

          .offers-grid {
            gap: 20px;
          }

          .offer-card {
            min-height: 290px;
            padding: 22px;
          }

          .offer-image-wrap {
            height: 165px;
          }

          .offer-title {
            font-size: 18px;
          }

          .offer-description {
            font-size: 14px;
          }
        }

        /* Mobile and small tablets */
        @media (max-width: 700px) {
          .offers-section {
            padding: 30px 20px;
          }

          .offers-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 18px;
          }

          .offer-card {
            min-height: 280px;
            padding: 20px;
          }

          .offer-image-wrap {
            height: 155px;
            margin-bottom: 14px;
          }

          .offer-title {
            font-size: 17px;
          }

          .offer-description {
            font-size: 14px;
          }
        }

        /* Small mobile screens */
        @media (max-width: 480px) {
          .offers-section {
            padding: 24px 16px;
          }

          .offers-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .offer-card {
            min-height: 300px;
            padding: 24px;
          }

          .offer-image-wrap {
            height: 190px;
            margin-bottom: 15px;
          }

          .offer-title {
            font-size: 20px;
          }

          .offer-description {
            font-size: 15px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .offer-image {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}

export default Offers;
