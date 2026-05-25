import type { ReactNode } from "react";

export function BuilderLayout({
  sidebar,
  editor,
  preview
}: {
  sidebar: ReactNode;
  editor: ReactNode;
  preview: ReactNode;
}) {
  return (
    <main className="mx-auto grid max-w-[1560px] gap-6 px-4 py-6 lg:grid-cols-[270px_1fr_420px] lg:px-8">
      {sidebar}
      {editor}
      <aside className="hidden lg:block">{preview}</aside>
    </main>
  );
}
