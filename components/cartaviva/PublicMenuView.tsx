import { Clock3, Instagram, MapPin, MessageCircle, Phone, QrCode } from "lucide-react";
import { BRAND_DOMAIN_PLACEHOLDER, BRAND_NAME } from "@/lib/brand";
import {
  FALLBACK_IMAGE,
  getVisibleCategories,
  getVisibleProducts,
  menuGroupOptions,
  splitLines,
  type CartaVivaState,
  type Category,
  type MenuGroup,
  type Product
} from "@/lib/cartaviva-data";

function groupLabel(group: MenuGroup) {
  return menuGroupOptions.find((item) => item.value === group)?.label || group;
}

function templateSurface(template: CartaVivaState["restaurant"]["template"]) {
  switch (template) {
    case "elegant":
      return {
        shell: "bg-[#f8f1e8]",
        card: "bg-[#fffdf8] border-[#e9dcc7]",
        header: "bg-[#2f211a] text-white",
        chip: "bg-[#f1e5d6] text-[#6b594a]"
      };
    case "compact":
      return {
        shell: "bg-[#fff8ef]",
        card: "bg-white border-[#eadfce]",
        header: "bg-[#221812] text-white",
        chip: "bg-[#f4eadc] text-[#5f4e42]"
      };
    case "dark-premium":
      return {
        shell: "bg-[#120d0a]",
        card: "bg-[#221812] border-[#3d2b23]",
        header: "bg-[#0f0a08] text-white",
        chip: "bg-white/10 text-white"
      };
    case "mediterranean":
      return {
        shell: "bg-[#fffaf3]",
        card: "bg-[#fffefb] border-[#e3d7c8]",
        header: "bg-[#1f5f64] text-white",
        chip: "bg-[#e7f1ef] text-[#1f5f64]"
      };
    default:
      return {
        shell: "bg-[#fffaf3]",
        card: "bg-white border-[#eadfce]",
        header: "bg-[#221812] text-white",
        chip: "bg-[#f4eadc] text-[#5f4e42]"
      };
  }
}

function productsByGroup(categories: Category[], group: MenuGroup) {
  return categories.filter((category) => category.group === group && category.id !== "daily");
}

function FakeQr({ color = "#221812", compact = false }: { color?: string; compact?: boolean }) {
  const cells = Array.from({ length: 49 }, (_, index) => index);
  return (
    <div className={`${compact ? "h-20 w-20" : "h-28 w-28"} rounded-[1.4rem] bg-white p-2 shadow-inner`}>
      <div className="grid h-full w-full grid-cols-7 gap-0.5">
        {cells.map((cell) => {
          const filled = [0, 1, 2, 4, 6, 7, 9, 11, 13, 14, 15, 16, 18, 20, 22, 24, 25, 27, 30, 32, 34, 35, 36, 37, 39, 41, 42, 43, 44, 45, 48].includes(cell);
          return <span key={cell} className="rounded-[2px]" style={{ backgroundColor: filled ? color : "transparent" }} />;
        })}
      </div>
    </div>
  );
}

function DailyMenuPreview({
  data,
  compact
}: {
  data: CartaVivaState;
  compact?: boolean;
}) {
  const tabs = [
    { key: "primeros", label: "Primeros", items: splitLines(data.dailyMenu.starters), image: data.dailyMenu.startersImage },
    { key: "segundos", label: "Segundos", items: splitLines(data.dailyMenu.mains), image: data.dailyMenu.mainsImage },
    { key: "postres", label: "Postres", items: splitLines(data.dailyMenu.desserts), image: data.dailyMenu.dessertsImage }
  ];

  return (
    <section className="overflow-hidden rounded-[2rem] border border-orange-200 bg-gradient-to-br from-[#fff4e8] via-white to-[#fff7ef]">
      <div className="relative h-40 overflow-hidden border-b border-orange-100">
        <img src={data.dailyMenu.coverImage || FALLBACK_IMAGE} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] backdrop-blur">Menu del dia</span>
            {data.dailyMenu.drinkIncluded ? <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#221812]">Bebida incluida</span> : null}
          </div>
          <div className="mt-3 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold">{data.dailyMenu.title}</h2>
              <p className="text-sm text-white/80">{data.dailyMenu.dayLabel} · {data.dailyMenu.schedule}</p>
            </div>
            <span className="rounded-full bg-[#221812] px-4 py-2 text-sm font-bold">{data.dailyMenu.price}</span>
          </div>
        </div>
      </div>

      <div className={`grid gap-3 p-4 ${compact ? "" : "lg:grid-cols-3"}`}>
        {tabs.map((tab) => (
          <article key={tab.key} className="rounded-[1.5rem] border border-[#f4d9bb] bg-white p-4 shadow-sm">
            {data.dailyMenu.showImages ? (
              <img src={tab.image || FALLBACK_IMAGE} alt="" className="mb-3 h-32 w-full rounded-[1.2rem] object-cover" />
            ) : null}
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#e85d04]">{tab.label}</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-[#5f4e42]">
              {tab.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
        ))}
      </div>

      <div className="px-4 pb-4 text-sm leading-6 text-[#6b594a]">{data.dailyMenu.note}</div>
    </section>
  );
}

function ProductCard({
  product,
  data,
  compact
}: {
  product: Product;
  data: CartaVivaState;
  compact?: boolean;
}) {
  const soldOut = product.status === "soldout";
  const showImage = data.restaurant.template !== "compact" && Boolean(product.imageUrl);
  const styles = templateSurface(data.restaurant.template);

  return (
    <article className={`rounded-[1.6rem] border p-3 shadow-sm ${styles.card} ${soldOut ? "opacity-60 grayscale" : ""}`}>
      <div className={showImage ? "grid gap-3 sm:grid-cols-[112px_1fr]" : ""}>
        {showImage ? <img src={product.imageUrl || FALLBACK_IMAGE} alt="" className="h-28 w-full rounded-[1.2rem] object-cover" /> : null}
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {soldOut ? <span className="rounded-full bg-[#221812] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white">Agotado</span> : null}
              {data.settings.showTags ? product.tags.slice(0, compact ? 1 : 2).map((tag) => (
                <span key={tag} className="rounded-full bg-[#fff1df] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#c2410c]">
                  {tag}
                </span>
              )) : null}
            </div>
            <span className="whitespace-nowrap text-lg font-bold text-[#221812]">{product.price}</span>
          </div>
          <h3 className="mt-2 text-lg font-bold text-[#221812]">{product.name}</h3>
          <p className="mt-1 text-sm leading-6 text-[#6b594a]">{product.description}</p>
          {data.settings.showAllergens && product.allergens.length ? (
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#8a796a]">
              Alergenos: {product.allergens.join(", ")}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function PublicMenuView({
  data,
  preview = false,
  showBranding
}: {
  data: CartaVivaState;
  preview?: boolean;
  showBranding?: boolean;
}) {
  const styles = templateSurface(data.restaurant.template);
  const categories = getVisibleCategories(data.categories);
  const groups = menuGroupOptions.filter((group) => productsByGroup(categories, group.value).length > 0);
  const brandingVisible = showBranding ?? data.settings.showBranding;
  const whatsappHref = `https://wa.me/${data.restaurant.whatsapp.replace(/\D/g, "")}`;

  return (
    <div className={preview ? styles.shell : `${styles.shell} min-h-screen px-4 py-6`}>
      <div className={preview ? `overflow-hidden ${styles.shell}` : `mx-auto max-w-5xl overflow-hidden rounded-[2rem] border shadow-xl ${styles.card}`}>
        <header className="relative">
          <div className="h-64 w-full overflow-hidden">
            <img src={data.restaurant.coverUrl || FALLBACK_IMAGE} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-8">
            <div className="flex flex-wrap items-center gap-3">
              {data.restaurant.logoUrl ? (
                <img src={data.restaurant.logoUrl} alt="" className="h-14 w-14 rounded-[1.2rem] border border-white/25 object-cover shadow-lg" />
              ) : null}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/75">Miniweb del restaurante</p>
                <h1 className="text-3xl font-bold md:text-5xl">{data.restaurant.name}</h1>
              </div>
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/85 md:text-base">{data.restaurant.description}</p>
          </div>
        </header>

        <section className="space-y-5 p-4 md:p-6">
          <div className="grid gap-3 rounded-[1.7rem] border border-[#eadfce] bg-white p-4 shadow-sm lg:grid-cols-[1.3fr_1fr]">
            <div className="flex flex-wrap gap-2">
              {groups.map((group) => (
                <a key={group.value} href={`#grupo-${group.value}`} className={`rounded-full px-4 py-2 text-sm font-bold ${styles.chip}`}>
                  {group.label}
                </a>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 justify-start lg:justify-end">
              <a href={whatsappHref} className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-white" style={{ backgroundColor: data.restaurant.primaryColor }}>
                <MessageCircle size={16} />
                WhatsApp
              </a>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#fff6eb] px-4 py-2 text-sm font-bold text-[#a3581c]">
                <QrCode size={16} />
                QR listo
              </span>
            </div>
          </div>

          <div className="grid gap-3 rounded-[1.7rem] border border-[#eadfce] bg-white p-4 text-sm text-[#5f4e42] shadow-sm md:grid-cols-2 xl:grid-cols-4">
            <p className="flex items-center gap-2"><MapPin size={16} /> {data.restaurant.address}</p>
            <p className="flex items-center gap-2"><Clock3 size={16} /> {data.restaurant.schedule}</p>
            <p className="flex items-center gap-2"><Phone size={16} /> {data.restaurant.phone}</p>
            <p className="flex items-center gap-2"><Instagram size={16} /> {data.restaurant.instagram}</p>
          </div>

          {data.dailyMenu.enabled ? <DailyMenuPreview data={data} compact={preview} /> : null}

          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.filter((category) => category.id !== "daily").map((category) => (
              <a key={category.id} href={`#${category.id}`} className="whitespace-nowrap rounded-full border border-[#eadfce] bg-white px-4 py-2 text-sm font-bold text-[#6b594a]">
                {category.name}
              </a>
            ))}
          </div>

          {groups.map((group) => {
            const groupCategories = productsByGroup(categories, group.value);
            return (
              <section key={group.value} id={`grupo-${group.value}`} className="space-y-5">
                <div className={`rounded-[1.7rem] px-5 py-4 ${styles.header}`}>
                  <h2 className="text-2xl font-bold">{groupLabel(group.value)}</h2>
                </div>
                {groupCategories.map((category) => {
                  const items = getVisibleProducts(data.products, category.id);
                  if (!items.length) return null;
                  return (
                    <section key={category.id} id={category.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-[#221812]">{category.name}</h3>
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#8a796a]">{items.length} productos</span>
                      </div>
                      <div className={data.restaurant.template === "compact" ? "space-y-2" : "grid gap-3 lg:grid-cols-2"}>
                        {items.map((product) => <ProductCard key={product.id} product={product} data={data} compact={preview} />)}
                      </div>
                    </section>
                  );
                })}
              </section>
            );
          })}

          <section className="grid gap-4 rounded-[1.8rem] border border-[#eadfce] bg-white p-5 shadow-sm md:grid-cols-[1fr_220px]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#e85d04]">Escanea nuestra carta</p>
              <h3 className="mt-2 text-2xl font-bold text-[#221812]">{data.restaurant.name}</h3>
              <p className="mt-2 text-sm leading-7 text-[#6b594a]">Carta digital con fotos y menu del dia.</p>
              {brandingVisible ? (
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#8a796a]">
                  Creado con {BRAND_NAME} · {BRAND_DOMAIN_PLACEHOLDER}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col items-center justify-center rounded-[1.5rem] bg-[#fff7ee] p-4 text-center">
              <FakeQr color={data.restaurant.primaryColor} />
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-[#8a796a]">/{data.restaurant.slug}</p>
            </div>
          </section>
        </section>
      </div>
    </div>
  );
}

export { FakeQr };
