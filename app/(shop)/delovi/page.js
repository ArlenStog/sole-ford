import ProductListing from "@/components/ProductListing";

export const metadata = { title: "Ford polovni delovi" };

export default async function Page({ searchParams }) {
  return (
    <ProductListing
      searchParams={await searchParams}
      basePath="/delovi"
      title="Ford polovni i novi delovi"
      intro="Kompletna ponuda originalnih delova za Ford vozila. Koristite filtere da brzo pronađete deo za vaš model."
    />
  );
}
