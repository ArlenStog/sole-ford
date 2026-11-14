import { prisma } from "@/lib/db";
import { MessageRead, DeleteButton } from "@/components/admin/AdminActions";

export default async function Page() {
  const messages = await prisma.message.findMany({ orderBy: [{ read: "asc" }, { createdAt: "desc" }] });
  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-ford-dark">Poruke sa kontakt forme</h1>
      <div className="mt-4 space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={`card p-4 ${m.read ? "opacity-70" : "border-l-4 border-l-accent"}`}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <b>{m.name}</b> · <a href={`mailto:${m.email}`} className="text-ford">{m.email}</a>{m.phone && <> · <a href={`tel:${m.phone}`} className="text-ford">{m.phone}</a></>}
                {m.subject && <div className="text-sm font-semibold text-gray-700">Tema: {m.subject}</div>}
              </div>
              <span className="text-xs text-gray-500">{new Date(m.createdAt).toLocaleString("sr-RS")}</span>
            </div>
            <p className="mt-2 whitespace-pre-line text-sm">{m.body}</p>
            <div className="mt-3 flex gap-4">
              <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: " + (m.subject || "Vaš upit"))}`} className="text-sm text-ford hover:underline">Odgovori</a>
              <MessageRead id={m.id} read={m.read} />
              <DeleteButton url={`/api/admin/messages/${m.id}`} confirmText="Obrisati poruku?" />
            </div>
          </div>
        ))}
        {messages.length === 0 && <p className="text-gray-500">Nema poruka.</p>}
      </div>
    </div>
  );
}
