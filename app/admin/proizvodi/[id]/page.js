import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";
import { DeleteButton } from "@/components/admin/AdminActions";

export default async function Page({ params }) {
  const { id } = await params;
  const [product, models, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: Number(id) } }),
    prisma.carModel.findMany({ orderBy: { sort: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!product) notFound();
  return (
    <div className="max-w-4xl">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ford-dark">Izmena: {product.name}</h1>
        <DeleteButton url={`/api/admin/products/${product.id}`} confirmText="Obrisati proizvod?" redirectTo="/admin/proizvodi" label="Obriši proizvod" />
      </div>
      <ProductForm product={{ ...product, createdAt: undefined }} models={models} categories={categories} />
    </div>
  );
}
