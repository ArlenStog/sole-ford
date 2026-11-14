import { prisma } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";

export default async function Page() {
  const [models, categories] = await Promise.all([prisma.carModel.findMany({ orderBy: { sort: "asc" } }), prisma.category.findMany({ orderBy: { name: "asc" } })]);
  return (
    <div className="max-w-4xl">
      <h1 className="mb-4 text-2xl font-bold text-ford-dark">Novi proizvod</h1>
      <ProductForm models={models} categories={categories} />
    </div>
  );
}
