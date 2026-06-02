type Tab = { id: string; label: string };

export function SectionTabs({
  tabs,
  activeId,
  onChange
}: {
  tabs: Tab[];
  activeId: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${
            activeId === tab.id ? "bg-[#221812] text-white" : "bg-white text-[#6b594a]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
