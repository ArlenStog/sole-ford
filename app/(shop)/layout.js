import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { WhatsAppButton, CookieBanner } from "@/components/Widgets";

export default function ShopLayout({ children }) {
  return (
    <>
      <Header />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
      <WhatsAppButton />
      <CookieBanner />
    </>
  );
}
