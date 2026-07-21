import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import ScrollTop from "../components/ScrollTop/ScrollTop";

export default function MainLayout({ children }) {
  return (
    <div className="bg-bg text-white min-h-screen overflow-x-hidden">
      <Navbar />
      <main>{children}</main>
      <Footer />
      <ScrollTop />
    </div>
  );
}
