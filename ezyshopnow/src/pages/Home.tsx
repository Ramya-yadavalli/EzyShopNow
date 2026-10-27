
import HeroBanner from "./HeroBanner";
import TopCategories from "./TopCategories";
import TrendingProducts from "./TrendingProducts";
import HomeDecors from "./HomeDecor";
import HomeDecoreBanner from "./HomeDecoreBanner";
import BlogPosts from "./BlogPosts";
import Offers from "./Offers";
import Quote from "./Quote";
import Footer from "./Footer";
function Home() {
  return (
    <>
      <main>
        <HeroBanner />

        <TopCategories />

        <TrendingProducts />

        <HomeDecoreBanner />

        <Offers />

        <Quote />

        <HomeDecors />

        <BlogPosts />

        <Footer />
      </main>
    </>
  );
}

export default Home;
