import type { ReactNode } from "react";
import Navbar from "../pages/Navbar";
import Footer from "../pages/Footer";
interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <>
      <Navbar cartCount={0} />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default Layout;