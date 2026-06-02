"use client";

import type { ReactNode } from "react";

export function BuilderLayout({
  sidebar,
  editor,
  preview,
  previewVisible,
}: {
  sidebar: ReactNode;
  editor: ReactNode;
  preview?: ReactNode;
  previewVisible?: boolean;
}) {
  return (
    <main className="mx-auto max-w-[1600px] px-4 py-5 lg:px-6">
      <div className={`grid gap-5 ${previewVisible && preview ? "lg:grid-cols-[240px_minmax(0,1fr)_380px]" : "lg:grid-cols-[240px_minmax(0,1fr)]"}`}>
        {sidebar}
        <section className="min-w-0">{editor}</section>
        {previewVisible && preview && (
          <aside className="hidden xl:block">
            <div className="sticky top-20">{preview}</div>
          </aside>
        )}
      </div>
    </main>
  );
}
