import "./globals.css";
import { getUser } from "@/lib/auth";
import { CartProvider } from "@/components/CartProvider";
import { site } from "@/lib/site";

export const metadata = {
  title: { default: `${site.name} — ${site.tagline}`, template: `%s | ${site.name}` },
  description: "Sole Ford — originalni polovni i novi delovi za sve Ford modele. Brza dostava širom Srbije, garancija i povraćaj novca.",
};

export default async function RootLayout({ children }) {
  const user = await getUser();
  return (
    <html lang="sr">
      <body>
        <CartProvider loggedIn={!!user}>{children}</CartProvider>
      </body>
    </html>
  );
}
