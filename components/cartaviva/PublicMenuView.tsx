import { Clock, Instagram, Languages, MapPin, MessageCircle, Phone } from "lucide-react";
import { menuGroupOptions, type CartaVivaState, type Category, type MenuGroup, type Product } from "@/lib/cartaviva-data";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=900&auto=format&fit=crop";

function splitLines(value: string) {
  return value.split("\n").map((line) => line.trim()).filter(Boolean);
}

function visibleCategories(categories: Category[]) {
  return [...categories].filter((category) => category.visible).sort((a, b) => a.order - b.order);
}

function visibleProducts(products: Product[], categoryId: string) {
  return products.filter((product) => product.categoryId === categoryId && product.status !== "hidden");
}

function groupLabel(group: MenuGroup) {
  return menuGroupOptions.find((item) => item.value === group)?.label || group;
}

function usedGroups(categories: Category[]) {
  const groups = new Set(categories.filter((category) => category.id !== "daily").map((category) => category.group));
  return menuGroupOptions.filter((item) => groups.has(item.value));
}

export function FakeQr({ compact = false, color = "#221812" }: { compact?: boolean; color?: string }) {
  const cells = Array.from({ length: 49 }, (_, index) => index);
  return (
    <div className={`${compact ? "h-20 w-20" : "h-28 w-28"} rounded-2xl bg-white p-2 shadow-inner`}>
      <div className="grid h-full w-full grid-cols-7 gap-0.5">
        {cells.map((cell) => {
          const filled = [0,1,2,7,14,15,16,4,6,13,20,27,34,41,42,43,44,48,35,36,37,22,24,30,32,9,11,18,25,39,45].includes(cell);
          return <span key={cell} className="rounded-[2px]" style={{ backgroundColor: filled ? color : "transparent" }} />;
        })}
      </div>
    </div>
  );
}

function DailyMenuCard({ data, compact = false }: { data: CartaVivaState; compact?: boolean }) {
  if (!data.dailyMenu.enabled) return null;

  return (
    <div className="rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#e85d04]">Menú del día</p>
          <h3 className={`${compact ? "text-lg" : "text-2xl"} mt-1 font-black text-[#221812]`}>{data.dailyMenu.title}</h3>
          <p className="mt-1 text-sm text-[#7b6a5b]">{data.dailyMenu.availableDays}</p>
        </div>
        <p className="rounded-full bg-[#221812] px-3 py-2 text-sm font-black text-white">{data.dailyMenu.price}</p>
      </div>

      <div className="mt-4 grid gap-3 text-sm text-[#5f4e42] sm:grid-cols-3">
        <div className="rounded-2xl bg-white/80 p-3">
          <p className="font-black text-[#221812]">Primeros</p>
          <ul className="mt-2 space-y-1">
            {splitLines(data.dailyMenu.starters).map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </div>
        <div className="rounded-2xl bg-white/80 p-3">
          <p className="font-black text-[#221812]">Segundos</p>
          <ul className="mt-2 space-y-1">
            {splitLines(data.dailyMenu.mains).map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </div>
        <div className="rounded-2xl bg-white/80 p-3">
          <p className="font-black text-[#221812]">Postres</p>
          <ul className="mt-2 space-y-1">
            {splitLines(data.dailyMenu.desserts).map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-[#7b6a5b]">
        {data.dailyMenu.drinkIncluded && <span className="rounded-full bg-white px-3 py-1">Bebida incluida</span>}
        {data.dailyMenu.note && <span className="rounded-full bg-white px-3 py-1">{data.dailyMenu.note}</span>}
      </div>
    </div>
  );
}

function ProductCard({ product, data, compact = false }: { product: Product; data: CartaVivaState; compact?: boolean }) {
  const isSoldOut = product.status === "soldout";
  const shouldShowImage = data.settings.showImages === "always" && data.settings.template !== "compact";
  const imageUrl = product.imageUrl || FALLBACK_IMAGE;

  return (
    <article className={`rounded-3xl border border-[#f0e6d8] bg-white p-3 shadow-sm ${isSoldOut ? "opacity-55 grayscale" : ""}`}>
      <div className={shouldShowImage ? "grid grid-cols-[92px_1fr] gap-3" : ""}>
        {shouldShowImage && (
          <img src={imageUrl} alt="" className="h-24 w-24 rounded-2xl object-cover" />
        )}
        <div className="min-w-0">
          <div className="mb-1 flex items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1">
              {isSoldOut && <span className="rounded-full bg-[#221812] px-2 py-1 text-[10px] font-black uppercase text-white">Agotado</span>}
              {data.settings.showTags && product.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="rounded-full bg-orange-100 px-2 py-1 text-[10px] font-black uppercase text-[#c2410c]">{tag}</span>
              ))}
            </div>
            <span className="whitespace-nowrap font-black text-[#221812]">{product.price}</span>
          </div>
          <h3 className={`${compact ? "text-base" : "text-lg"} font-black text-[#221812]`}>{product.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#7b6a5b]">{product.description}</p>
          {data.settings.showAllergens && product.allergens.length > 0 && (
            <p className="mt-2 text-xs font-semibold text-[#8a796a]">Alérgenos: {product.allergens.join(", ")}</p>
          )}
        </div>
      </div>
    </article>
  );
}

export function PublicMenuView({ data, preview = false }: { data: CartaVivaState; preview?: boolean }) {
  const categories = visibleCategories(data.categories);
  const mainCategories = categories.filter((category) => category.id !== "daily");
  const groups = usedGroups(categories);
  const whatsappHref = `https://wa.me/${data.restaurant.whatsapp.replace(/\D/g, "")}`;
  const publicUrl = `cartaviva.es/carta/${data.restaurant.slug}`;

  return (
    <div className={preview ? "bg-[#fffaf3]" : "min-h-screen bg-[#fffaf3] px-4 py-6"}>
      <div className={preview ? "overflow-hidden rounded-[2rem] bg-[#fffaf3]" : "mx-auto max-w-3xl overflow-hidden rounded-[2rem] border border-[#eadfce] bg-[#fffaf3] shadow-xl"}>
        <header className="relative h-52 bg-cover bg-center" style={{ backgroundImage: `url('${data.restaurant.coverUrl || FALLBACK_IMAGE}')` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
              <Languages size={14} /> {data.restaurant.language} · English · Deutsch
            </div>
            <div className="flex items-end gap-3">
              {data.restaurant.logoUrl && <img src={data.restaurant.logoUrl} alt="" className="h-12 w-12 rounded-2xl border border-white/40 object-cover shadow-lg" />}
              <h1 className="text-3xl font-black tracking-tight">{data.restaurant.name}</h1>
            </div>
            <p className="mt-1 max-w-xl text-sm leading-6 text-white/85">{data.restaurant.description}</p>
          </div>
        </header>

        <section className="space-y-4 p-4 md:p-6">
          <div className="flex gap-2 overflow-x-auto pb-1 text-sm font-black">
            {data.dailyMenu.enabled && <a href="#menu-dia" className="whitespace-nowrap rounded-full px-4 py-2 text-white" style={{ backgroundColor: data.settings.primaryColor }}>Hoy</a>}
            {groups.map((group) => (
              <a key={group.value} href={`#grupo-${group.value}`} className="whitespace-nowrap rounded-full bg-[#f1e7d8] px-4 py-2 text-[#6b594a]">{group.label}</a>
            ))}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 text-xs font-black text-[#7b6a5b]">
            {mainCategories.map((category) => (
              <a key={category.id} href={`#${category.id}`} className="whitespace-nowrap rounded-full border border-[#eadfce] bg-white px-3 py-2">{category.name}</a>
            ))}
          </div>

          <div className="grid gap-2 rounded-3xl bg-white p-4 text-sm text-[#6b594a] shadow-sm sm:grid-cols-2">
            <p className="flex items-center gap-2"><MapPin size={16} /> {data.restaurant.address}</p>
            <p className="flex items-center gap-2"><Clock size={16} /> {data.restaurant.schedule}</p>
            <p className="flex items-center gap-2"><Phone size={16} /> {data.restaurant.phone}</p>
            <p className="flex items-center gap-2"><Instagram size={16} /> {data.restaurant.instagram}</p>
          </div>

          {data.dailyMenu.enabled && <div id="menu-dia"><DailyMenuCard data={data} compact={preview} /></div>}

          {groups.map((group) => {
            const groupCategories = mainCategories.filter((category) => category.group === group.value);
            if (groupCategories.length === 0) return null;
            return (
              <section id={`grupo-${group.value}`} key={group.value} className="scroll-mt-4 space-y-5">
                <div className="flex items-center justify-between rounded-3xl bg-[#221812] px-5 py-4 text-white">
                  <h2 className="text-2xl font-black">{groupLabel(group.value)}</h2>
                  <span className="text-xs font-bold text-white/65">{groupCategories.length} secciones</span>
                </div>
                {groupCategories.map((category) => {
                  const products = visibleProducts(data.products, category.id);
                  if (products.length === 0) return null;
                  return (
                    <section id={category.id} key={category.id} className="scroll-mt-4">
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-2xl font-black text-[#221812]">{category.name}</h3>
                        <span className="text-xs font-bold text-[#8a796a]">{products.length} productos</span>
                      </div>
                      <div className={data.settings.template === "compact" ? "space-y-2" : "space-y-3"}>
                        {products.map((product) => <ProductCard key={product.id} product={product} data={data} compact={preview} />)}
                      </div>
                    </section>
                  );
                })}
              </section>
            );
          })}

          <div className="rounded-3xl bg-[#221812] p-5 text-white">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black">¿Quieres reservar o preguntar?</h3>
                <p className="mt-1 text-sm text-white/70">Escríbenos directamente por WhatsApp.</p>
              </div>
              <a href={whatsappHref} className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-black text-white" style={{ backgroundColor: data.settings.primaryColor }}>
                <MessageCircle size={16} /> WhatsApp
              </a>
            </div>
          </div>

          {!preview && (
            <div className="rounded-3xl border border-dashed border-[#d9cbb8] bg-white p-5 text-center">
              <div className="mx-auto w-fit"><FakeQr compact color={data.settings.primaryColor} /></div>
              <p className="mt-3 font-black text-[#221812]">{publicUrl}</p>
              <p className="text-sm text-[#7b6a5b]">QR listo para mesas, barra, escaparate e Instagram.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export function MobilePreview({ data }: { data: CartaVivaState }) {
  return (
    <div className="sticky top-24 mx-auto w-full max-w-[390px] rounded-[2.5rem] border-[12px] border-[#1c1511] bg-[#fffaf3] shadow-2xl">
      <div className="max-h-[760px] overflow-y-auto rounded-[1.6rem]">
        <PublicMenuView data={data} preview />
      </div>
    </div>
  );
}
