import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import CheckoutForm from "@/components/CheckoutForm";

export const metadata = { title: "Plaćanje" };

export default async function Page() {
  const user = await getUser();
  const addresses = user ? await prisma.address.findMany({ where: { userId: user.id }, orderBy: { isDefault: "desc" } }) : [];
  return (
    <div className="container-x py-8">
      <h1 className="text-3xl font-extrabold text-ford-dark">Plaćanje i dostava</h1>
      <CheckoutForm user={user} addresses={addresses} />
    </div>
  );
}
