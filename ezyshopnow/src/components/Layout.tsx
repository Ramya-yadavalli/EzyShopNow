import type { ReactNode } from "react";
import Navbar from "../pages/Navbar";

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <>
      <Navbar cartCount={0} />
      <main>{children}</main>
    </>
  );
}

export default Layout;