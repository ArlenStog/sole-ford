import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import AccountShell from "@/components/AccountShell";
import AddressManager from "@/components/AddressManager";

export const metadata = { title: "Moje adrese" };

export default async function Page() {
  const user = await getUser();
  if (!user) redirect("/nalog?next=/nalog/adrese");
  const addresses = await prisma.address.findMany({ where: { userId: user.id }, orderBy: { id: "asc" } });
  return (
    <AccountShell active="/nalog/adrese" user={user}>
      <AddressManager initial={addresses} defaultName={`${user.firstName} ${user.lastName}`} defaultPhone={user.phone || ""} />
    </AccountShell>
  );
}
