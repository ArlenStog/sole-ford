import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import AccountShell from "@/components/AccountShell";
import AccountDetailsForm from "@/components/AccountDetailsForm";

export const metadata = { title: "Podaci o nalogu" };

export default async function Page() {
  const user = await getUser();
  if (!user) redirect("/nalog?next=/nalog/podaci");
  return (
    <AccountShell active="/nalog/podaci" user={user}>
      <AccountDetailsForm user={user} />
    </AccountShell>
  );
}
