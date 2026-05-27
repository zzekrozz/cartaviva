import type { ReactNode } from "react";

export function BuilderLayout({ sidebar, editor }: { sidebar: ReactNode; editor: ReactNode; preview?: ReactNode }) {
  return (
    <main className="mx-auto grid max-w-[1280px] gap-5 px-4 py-5 lg:grid-cols-[270px_minmax(0,1fr)] lg:px-6 xl:max-w-[1360px]">
      {sidebar}
      <section className="min-w-0">{editor}</section>
    </main>
  );
}
