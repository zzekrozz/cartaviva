import type { ReactNode } from "react";

export function BuilderLayout({ sidebar, editor, preview }: { sidebar: ReactNode; editor: ReactNode; preview: ReactNode }) {
  return (
    <main className="mx-auto grid max-w-[1640px] gap-6 px-4 py-6 lg:grid-cols-[290px_minmax(0,1fr)_430px] lg:px-8">
      {sidebar}
      <section className="min-w-0">{editor}</section>
      <aside className="hidden min-w-0 lg:block">{preview}</aside>
    </main>
  );
}
