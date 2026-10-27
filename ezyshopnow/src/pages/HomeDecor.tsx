
const homeDecorItems = [
  {
    id: 1,
    name: "Elegant Ceramic Vase",
    description:
      "Add a timeless touch to your living room with this elegant ceramic vase.",
    price: "₹799",
    image:
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 2,
    name: "Modern Table Lamp",
    description:
      "Create a warm and relaxing atmosphere with this stylish table lamp.",
    price: "₹1,299",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 3,
    name: "Decorative Green Planter",
    description:
      "Bring a refreshing natural look to your home with this decorative planter.",
    price: "₹599",
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 4,
    name: "Minimalist Wall Art",
    description:
      "Enhance empty walls with beautiful artwork for a modern home.",
    price: "₹999",
    image:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 5,
    name: "Scented Candle",
    description:
      "Enjoy a cozy ambience with a scented candle for your bedroom or living room.",
    price: "₹499",
    image:
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 6,
    name: "Elegant Decorative Accent",
    description:
      "Complete your interior styling with a tasteful decorative accent.",
    price: "₹899",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=700&q=85",
  },
];

function HomeDecore() {
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
          text-align: left;
        }

        .home-decore-eyebrow {
          margin-bottom: 10px;
          color: #71816c;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
        }

        .home-decore-title {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(30px, 4vw, 42px);
          font-weight: 400;
        }

        .home-decore-subtitle {
          margin: 12px auto 0;
          max-width: 550px;
          color: #777;
          font-size: 14px;
          line-height: 1.7;
        }

        .home-decore-grid {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 28px;
          max-width: 1300px;
          margin: 0 auto;
        }

        .home-decore-card {
          min-width: 0;
          overflow: hidden;
          background: #fff;
          
          transition: transform 0.25s ease,
                      box-shadow 0.25s ease;
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

        .home-decore-info {
          padding: 20px;
        }

        .home-decore-name {
          margin: 0 0 10px;
          color: #303b30;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 20px;
          font-weight: 400;
        }

        .home-decore-description {
          min-height: 60px;
          margin: 0 0 16px;
          color: #777;
          font-size: 13px;
          line-height: 1.7;
        }

        .home-decore-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding-top: 14px;
          border-top: 1px solid #eee;
        }

        .home-decore-price {
          color: #344b38;
          font-size: 17px;
          font-weight: 600;
        }

        .home-decore-tag {
          color: #71816c;
          font-size: 10px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        @media (max-width: 900px) {
          .home-decore-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
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

          .home-decore-subtitle {
            font-size: 12px;
          }

          .home-decore-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
          }

          .home-decore-info {
            padding: 12px;
          }

          .home-decore-name {
            font-size: 16px;
          }

          .home-decore-description {
            min-height: 95px;
            margin-bottom: 12px;
            font-size: 11px;
          }

          .home-decore-price {
            font-size: 14px;
          }

          .home-decore-tag {
            font-size: 8px;
            letter-spacing: 0.5px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .home-decore-card,
          .home-decore-image {
            transition: none;
          }
        }
      `}</style>

      <section className="home-decore" aria-labelledby="home-decore-heading">
        <header className="home-decore-header">
          
          <h2 className="home-decore-title" id="home-decore-heading">
            Home Decor 
          </h2>

          
        </header>

        <div className="home-decore-grid">
          {homeDecorItems.map((item) => (
            <article className="home-decore-card" key={item.id}>
              <div className="home-decore-image-wrap">
                <img
                  className="home-decore-image"
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                />
              </div>

              <div className="home-decore-info">
                <h3 className="home-decore-name">{item.name}</h3>

                

                
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export default HomeDecore;
