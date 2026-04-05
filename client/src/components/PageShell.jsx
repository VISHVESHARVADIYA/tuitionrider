import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";

function PageShell({ children }) {
  return (
    <div className="min-h-screen text-slate-800">
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default PageShell;
