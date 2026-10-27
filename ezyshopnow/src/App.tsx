import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Navbar from './pages/Navbar';
import HeroBanner from './pages/HeroBanner';
import TrendingProducts from './pages/TrendingProducts';
import TopCategories from './pages/TopCategories';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="navbar" element={<Navbar />} />
          <Route path="herobanner" element={<HeroBanner />} />
          <Route path="trendingproducts" element={<TrendingProducts />} />
          <Route path="topcategories" element={<TopCategories />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;