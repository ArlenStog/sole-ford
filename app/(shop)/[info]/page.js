import Link from "next/link";
import { notFound } from "next/navigation";
import { pages } from "@/lib/pages";
import { nb } from "@/lib/format";

export function generateStaticParams() {
  return Object.keys(pages).map((info) => ({ info }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { info } = await params;
  return { title: pages[info]?.title };
}

export default async function InfoPage({ params }) {
  const { info } = await params;
  const page = pages[info];
  if (!page) notFound();
  return (
    <div className="container-x max-w-4xl py-10">
      <nav className="mb-4 text-sm text-gray-500"><Link href="/" className="hover:text-ford">Početna</Link> / {page.title}</nav>
      <article className="card prose-sf p-5 sm:p-8">
        <h1 className="mb-4 text-2xl font-extrabold sm:text-3xl text-ford-dark">{page.title}</h1>
        {page.sections.map(([h, content], i) => (
          <section key={i}>
            {h && <h2>{h}</h2>}
            {Array.isArray(content) ? content.map((p, j) => <p key={j}>{nb(p)}</p>) : <ul>{content.list.map((li, j) => <li key={j}>{nb(li)}</li>)}</ul>}
          </section>
        ))}
      </article>
    </div>
  );
}
