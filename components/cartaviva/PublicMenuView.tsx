"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Clock3, Instagram, MapPin, MessageCircle, Phone, QrCode } from "lucide-react";
import { BRAND_DOMAIN_PLACEHOLDER, BRAND_NAME } from "@/lib/brand";
import {
  FALLBACK_IMAGE,
  buildPublicPath,
  getVisibleCategories,
  getVisibleProducts,
  menuGroupOptions,
  splitLines,
  weeklyMenuToDailyMenu,
  type CartaVivaState,
  type Category,
  type MenuGroup,
  type Product
} from "@/lib/cartaviva-data";
import { RealQrCode } from "@/components/cartaviva/RealQrCode";

const headingFonts = {
  fraunces: '"Fraunces", "Georgia", serif',
  playfair: '"Playfair Display", "Georgia", serif',
  sora: '"Sora", "Avenir Next", sans-serif',
} as const;

const bodyFonts = {
  inter: '"Inter", "Segoe UI", sans-serif',
  manrope: '"Manrope", "Segoe UI", sans-serif',
  "plus-jakarta": '"Plus Jakarta Sans", "Segoe UI", sans-serif',
} as const;

const radiusClass = {
  suave: "rounded-[1.2rem]",
  medio: "rounded-[1.7rem]",
  grande: "rounded-[2.2rem]",
} as const;

const densityClass = {
  compacta: "space-y-4",
  normal: "space-y-5",
  amplia: "space-y-7",
} as const;

function groupLabel(group: MenuGroup) {
  return menuGroupOptions.find((item) => item.value === group)?.label || group;
}

function categoryGroupKey(category: Category) {
  return category.group === "otro"
    ? `otro:${(category.customGroupLabel || category.name || "otros").trim().toLowerCase()}`
    : category.group;
}

function categoryGroupLabel(category: Category) {
  return category.group === "otro"
    ? (category.customGroupLabel || category.name || "Otros").trim()
    : groupLabel(category.group);
}

type Surface = {
  shell: string;
  frame: string;
  panel: string;
  softPanel: string;
  card: string;
  cardHover: string;
  heading: string;
  text: string;
  muted: string;
  chip: string;
  activeChip: string;
  sectionHeader: string;
  price: string;
  border: string;
  productMode: "photo" | "elegant" | "compact" | "dark" | "med";
};

function templateSurface(template: CartaVivaState["restaurant"]["template"]): Surface {
  switch (template) {
    case "elegant":
      return {
        shell: "bg-[#f8f1e8]",
        frame: "bg-[#fffdf8] border-[#e8d8c2]",
        panel: "bg-[#fffdf8] border-[#e8d8c2]",
        softPanel: "bg-[#f5eadb] border-[#e1cfb8]",
        card: "bg-[#fffdf8] border-[#e7dac9]",
        cardHover: "shadow-[0_18px_42px_rgba(61,43,33,0.08)]",
        heading: "text-[#251a14]",
        text: "text-[#3b2b22]",
        muted: "text-[#7c6b5c]",
        chip: "bg-[#efe2d0] text-[#5d4738] border-[#e2d0bb]",
        activeChip: "bg-[#2f211a] text-white border-[#2f211a]",
        sectionHeader: "bg-[#2f211a] text-white",
        price: "text-[#2f211a]",
        border: "border-[#e7dac9]",
        productMode: "elegant"
      };
    case "compact":
      return {
        shell: "bg-[#fff8ef]",
        frame: "bg-white border-[#eadfce]",
        panel: "bg-white border-[#eadfce]",
        softPanel: "bg-[#fff4e4] border-[#eadfce]",
        card: "bg-white border-[#eadfce]",
        cardHover: "shadow-sm",
        heading: "text-[#221812]",
        text: "text-[#31231b]",
        muted: "text-[#6b594a]",
        chip: "bg-[#f4eadc] text-[#5f4e42] border-[#eadfce]",
        activeChip: "bg-[#221812] text-white border-[#221812]",
        sectionHeader: "bg-[#221812] text-white",
        price: "text-[#221812]",
        border: "border-[#eadfce]",
        productMode: "compact"
      };
    case "dark-premium":
      return {
        shell: "bg-[#0f0a08]",
        frame: "bg-[#15100d] border-[#3b2a21]",
        panel: "bg-[#1b130f] border-[#3b2a21]",
        softPanel: "bg-[#211711] border-[#4c3327]",
        card: "bg-[#211711] border-[#3b2a21]",
        cardHover: "shadow-[0_22px_50px_rgba(0,0,0,0.26)]",
        heading: "text-[#fff7ec]",
        text: "text-[#f5e8d5]",
        muted: "text-[#bca997]",
        chip: "bg-white/10 text-[#f5e8d5] border-white/10",
        activeChip: "bg-[#f0b35b] text-[#120d0a] border-[#f0b35b]",
        sectionHeader: "bg-[#070504] text-[#fff7ec] border border-[#3b2a21]",
        price: "text-[#f0b35b]",
        border: "border-[#3b2a21]",
        productMode: "dark"
      };
    case "mediterranean":
      return {
        shell: "bg-[#fdf6e8]",
        frame: "bg-[#fffdf8] border-[#e3d7c8]",
        panel: "bg-[#fffefb] border-[#e3d7c8]",
        softPanel: "bg-[#eef7f4] border-[#cfe2dc]",
        card: "bg-[#fffefb] border-[#e3d7c8]",
        cardHover: "shadow-[0_18px_44px_rgba(31,95,100,0.1)]",
        heading: "text-[#1d3939]",
        text: "text-[#304745]",
        muted: "text-[#627875]",
        chip: "bg-[#e7f1ef] text-[#1f5f64] border-[#cfe2dc]",
        activeChip: "bg-[#1f5f64] text-white border-[#1f5f64]",
        sectionHeader: "bg-[#1f5f64] text-white",
        price: "text-[#1f5f64]",
        border: "border-[#e3d7c8]",
        productMode: "med"
      };
    case "sweet-cafe":
      return {
        shell: "bg-[#fdf8f3]",
        frame: "bg-white border-[#f0e0d0]",
        panel: "bg-[#fffcf8] border-[#f0e0d0]",
        softPanel: "bg-[#fef3ea] border-[#f5d9c0]",
        card: "bg-white border-[#f0e0d0]",
        cardHover: "shadow-[0_18px_44px_rgba(180,90,30,0.10)]",
        heading: "text-[#3d1e0f]",
        text: "text-[#4a2810]",
        muted: "text-[#8a5c3c]",
        chip: "bg-[#fef0e4] text-[#a0481a] border-[#f5d0b0]",
        activeChip: "bg-[#c4501a] text-white border-[#c4501a]",
        sectionHeader: "bg-[#c4501a] text-white",
        price: "text-[#c4501a]",
        border: "border-[#f0e0d0]",
        productMode: "visual"
      };
    default:
      return {
        shell: "bg-[#fffaf3]",
        frame: "bg-white border-[#eadfce]",
        panel: "bg-white border-[#eadfce]",
        softPanel: "bg-[#fff4e8] border-[#f0d7b9]",
        card: "bg-white border-[#eadfce]",
        cardHover: "shadow-[0_18px_50px_rgba(232,93,4,0.09)]",
        heading: "text-[#221812]",
        text: "text-[#3a2a21]",
        muted: "text-[#6b594a]",
        chip: "bg-[#fff1df] text-[#a3581c] border-[#f4d9bb]",
        activeChip: "bg-[#221812] text-white border-[#221812]",
        sectionHeader: "bg-[#221812] text-white",
        price: "text-[#221812]",
        border: "border-[#eadfce]",
        productMode: "photo"
      };
  }
}

function FakeQr({ color = "#221812", compact = false }: { color?: string; compact?: boolean }) {
  const cells = Array.from({ length: 49 }, (_, index) => index);
  return (
    <div className={`${compact ? "h-20 w-20" : "h-28 w-28"} rounded-[1.35rem] bg-white p-2 shadow-inner ring-1 ring-black/5`}>
      <div className="grid h-full w-full grid-cols-7 gap-0.5">
        {cells.map((cell) => {
          const filled = [0, 1, 2, 4, 6, 7, 9, 11, 13, 14, 15, 16, 18, 20, 22, 24, 25, 27, 30, 32, 34, 35, 36, 37, 39, 41, 42, 43, 44, 45, 48].includes(cell);
          return <span key={cell} className="rounded-[2px]" style={{ backgroundColor: filled ? color : "transparent" }} />;
        })}
      </div>
    </div>
  );
}

function DailyMenuPreview({ data, compact, surface }: { data: CartaVivaState; compact?: boolean; surface: Surface }) {
  const [activeTab, setActiveTab] = useState("primeros");
  const blocks = [
    { key: "primeros", label: "Primeros", items: splitLines(data.dailyMenu.starters), image: data.dailyMenu.startersImage },
    { key: "segundos", label: "Segundos", items: splitLines(data.dailyMenu.mains), image: data.dailyMenu.mainsImage },
    { key: "postres", label: "Postres", items: splitLines(data.dailyMenu.desserts), image: data.dailyMenu.dessertsImage }
  ];
  const menuImage = data.dailyMenu.coverImage || FALLBACK_IMAGE;
  const activeBlock = blocks.find((block) => block.key === activeTab) || blocks[0];

  return (
    <section className={`overflow-hidden rounded-[2rem] border ${surface.softPanel} ${surface.cardHover}`}>
      <div className="relative min-h-[190px] overflow-hidden">
        <img src={menuImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/5" />
        <div className="relative z-10 flex min-h-[190px] flex-col justify-end p-5 text-white">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] backdrop-blur">Menú del día</span>
            {data.dailyMenu.drinkIncluded ? <span className="rounded-full bg-white px-3 py-1 text-[11px] font-black text-[#221812]">Bebida incluida</span> : null}
          </div>
          <div className="mt-3 flex items-end justify-between gap-3">
            <div>
              <h2 className={`${compact ? "text-2xl" : "text-3xl"} font-black tracking-tight`}>{data.dailyMenu.title}</h2>
              <p className="mt-1 text-sm font-semibold text-white/80">{data.dailyMenu.dayLabel} · {data.dailyMenu.schedule}</p>
            </div>
            <span className="whitespace-nowrap rounded-full bg-white px-4 py-2 text-base font-black text-[#221812] shadow-lg">{data.dailyMenu.price}</span>
          </div>
        </div>
      </div>

      <div className={`border-b ${surface.border} px-4 pt-4`}>
        <div className="flex gap-2 overflow-x-auto pb-3">
          {blocks.map((block) => (
            <button key={block.key} type="button" onClick={() => setActiveTab(block.key)} className={`whitespace-nowrap rounded-full border px-3 py-2 text-xs font-black ${activeTab === block.key ? surface.activeChip : surface.chip}`}>
              {block.label}
            </button>
          ))}
        </div>
      </div>

      <div className={`grid gap-3 p-4 ${compact ? "" : "md:grid-cols-3"}`}>
        {(compact ? [activeBlock] : blocks).map((block) => (
          <article key={block.key} className={`rounded-[1.45rem] border p-4 ${surface.panel}`}>
            {data.dailyMenu.showImages && block.image ? (
              <img src={block.image} alt="" className="mb-3 h-24 w-full rounded-[1rem] object-cover" />
            ) : null}
            <p className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: data.restaurant.primaryColor }}>{block.label}</p>
            <ul className={`mt-3 space-y-2 text-sm leading-6 ${surface.text}`}>
              {block.items.map((item) => <li key={item} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: data.restaurant.primaryColor }} />{item}</li>)}
            </ul>
          </article>
        ))}
      </div>
      {data.dailyMenu.note ? <p className={`px-5 pb-5 text-sm font-semibold ${surface.muted}`}>{data.dailyMenu.note}</p> : null}
    </section>
  );
}

function ProductCard({ product, data, compact, surface }: { product: Product; data: CartaVivaState; compact?: boolean; surface: Surface }) {
  const soldOut = product.status === "soldout";
  const hasImage = Boolean(product.imageUrl);
  const template = data.restaurant.template;
  const showImage = hasImage && template !== "compact" && (surface.productMode !== "elegant" || !compact);
  const visualLarge = surface.productMode === "photo" && showImage && !compact;
  const isDark = template === "dark-premium";

  return (
    <article className={`group overflow-hidden rounded-[1.55rem] border transition hover:-translate-y-0.5 ${surface.card} ${surface.cardHover} ${soldOut ? "opacity-55 grayscale" : ""}`}>
      {visualLarge ? <img src={product.imageUrl || FALLBACK_IMAGE} alt="" className="h-44 w-full object-cover" /> : null}
      <div className={`${visualLarge ? "p-4" : "p-3"} ${showImage && !visualLarge ? "grid gap-3 sm:grid-cols-[96px_1fr]" : ""}`}>
        {showImage && !visualLarge ? <img src={product.imageUrl || FALLBACK_IMAGE} alt="" className="h-24 w-full rounded-[1.1rem] object-cover" /> : null}
        <div className="min-w-0">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap gap-1.5">
              {soldOut ? <span className="rounded-full bg-[#221812] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white">Agotado</span> : null}
              {data.settings.showTags ? product.tags.slice(0, compact ? 1 : 2).map((tag) => (
                <span key={tag} className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${isDark ? "border-white/10 bg-white/10 text-[#f0b35b]" : "border-[#f4d9bb] bg-[#fff1df] text-[#c2410c]"}`}>
                  {tag}
                </span>
              )) : null}
              </div>
              <h3 className={`mt-2 break-words ${compact ? "text-base" : "text-lg"} font-black leading-6 ${surface.heading}`}>{product.name}</h3>
            </div>
            <span className={`whitespace-nowrap text-lg font-black ${surface.price}`}>{product.price}</span>
          </div>
          <p className={`mt-1 text-sm leading-6 ${surface.muted}`}>{product.description}</p>
          {data.settings.showAllergens && product.allergens.length ? (
            <p className={`mt-2 text-[11px] font-black uppercase tracking-[0.12em] ${surface.muted}`}>
              Alérgenos: {product.allergens.join(", ")}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function PublicMenuView({ data: sourceData, preview = false, showBranding, publicUrl, proposal = false }: { data: CartaVivaState; preview?: boolean; showBranding?: boolean; publicUrl?: string; proposal?: boolean }) {
  const languages = ["es", ...(sourceData.settings.extraLanguages || [])].filter((value, index, array) => array.indexOf(value) === index);
  const [language, setLanguage] = useState<string>(languages[0] || "es");
  const data = useMemo(() => {
    const effectiveDailyMenu = weeklyMenuToDailyMenu(sourceData);
    if (language === "es") return { ...sourceData, dailyMenu: effectiveDailyMenu };
    const translatedRestaurant = sourceData.translations.restaurant[language] || {};
    const translatedDaily = sourceData.translations.dailyMenu[language] || {};
    return {
      ...sourceData,
      restaurant: {
        ...sourceData.restaurant,
        description: translatedRestaurant.description || sourceData.restaurant.description,
        schedule: translatedRestaurant.schedule || sourceData.restaurant.schedule
      },
      categories: sourceData.categories.map((category) => ({
        ...category,
        name: sourceData.translations.categories[category.id]?.[language]?.name || category.name
      })),
      products: sourceData.products.map((product) => ({
        ...product,
        name: sourceData.translations.products[product.id]?.[language]?.name || product.name,
        description: sourceData.translations.products[product.id]?.[language]?.description || product.description
      })),
      dailyMenu: {
        ...effectiveDailyMenu,
        title: translatedDaily.title || effectiveDailyMenu.title,
        starters: translatedDaily.starters || effectiveDailyMenu.starters,
        mains: translatedDaily.mains || effectiveDailyMenu.mains,
        desserts: translatedDaily.desserts || effectiveDailyMenu.desserts,
        note: translatedDaily.note || effectiveDailyMenu.note
      }
    };
  }, [language, sourceData]);

  const surface = templateSurface(data.restaurant.template);
  const headingStyle = { fontFamily: headingFonts[data.restaurant.titleFont] };
  const bodyStyle = { fontFamily: bodyFonts[data.restaurant.bodyFont] };
  const categories = getVisibleCategories(data.categories);
  const groupSections = categories
    .filter((category) => category.id !== "daily")
    .reduce<Array<{ key: string; label: string; categories: Category[] }>>((acc, category) => {
      const key = categoryGroupKey(category);
      const existing = acc.find((item) => item.key === key);
      if (existing) {
        existing.categories.push(category);
      } else {
        acc.push({ key, label: categoryGroupLabel(category), categories: [category] });
      }
      return acc;
    }, [])
    .filter((section) => section.categories.some((category) => getVisibleProducts(data.products, category.id).length > 0));
  const brandingVisible = showBranding ?? data.settings.plan === "free";
  const whatsappHref = data.restaurant.whatsapp ? `https://wa.me/${data.restaurant.whatsapp.replace(/\D/g, "")}` : "";
  const compactMode = preview || data.restaurant.template === "compact";
  const contactRows = [
    data.restaurant.showAddress && data.restaurant.address ? { key: "address", icon: <MapPin size={16} />, value: data.restaurant.address } : null,
    data.restaurant.showSchedule && data.restaurant.schedule ? { key: "schedule", icon: <Clock3 size={16} />, value: data.restaurant.schedule } : null,
    data.restaurant.showPhone && data.restaurant.phone ? { key: "phone", icon: <Phone size={16} />, value: data.restaurant.phone } : null,
    data.restaurant.showInstagram && data.restaurant.instagram ? { key: "instagram", icon: <Instagram size={16} />, value: data.restaurant.instagram } : null
  ].filter(Boolean) as Array<{ key: string; icon: ReactNode; value: string }>;

  return (
    <div className={preview ? `${surface.shell}` : `${surface.shell} min-h-screen px-4 py-6`} style={{ backgroundColor: data.restaurant.backgroundColor, ...bodyStyle }}>
      <div className={preview ? `overflow-hidden ${surface.shell}` : `mx-auto max-w-5xl overflow-hidden rounded-[2.4rem] border ${surface.frame} shadow-[0_30px_90px_rgba(34,24,18,0.16)]`} style={{ backgroundColor: data.restaurant.backgroundColor }}>
        <header className="relative">
          <div className={`${preview ? "h-60" : "h-[360px]"} w-full overflow-hidden`}>
            <img src={data.restaurant.coverUrl || FALLBACK_IMAGE} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-8">
            <div className="flex flex-wrap items-end gap-3">
              {data.restaurant.logoUrl ? (
                <img src={data.restaurant.logoUrl} alt="" className="h-16 w-16 rounded-[1.35rem] border border-white/25 object-cover shadow-xl" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-[1.35rem] border border-white/25 bg-white/15 text-2xl font-black shadow-xl backdrop-blur">{data.restaurant.name.slice(0, 1)}</div>
              )}
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.32em] text-white/75">Miniweb del restaurante</p>
                <h1 className={`${preview ? "text-3xl" : "text-5xl"} font-black tracking-tight`} style={headingStyle}>{data.restaurant.name}</h1>
              </div>
            </div>
            <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-white/85 md:text-base">{data.restaurant.description}</p>
          </div>
        </header>

        <section className={`${densityClass[data.restaurant.visualDensity]} p-4 md:p-6 ${surface.shell}`}>
          {proposal ? (
            <div className="rounded-[1.7rem] border border-orange-200 bg-[#fff4e8] p-4 text-center text-sm font-black text-[#a3581c] shadow-sm">
              Esta es una propuesta visual, no la carta oficial del restaurante. Demo creada con {BRAND_NAME}.
            </div>
          ) : null}

          {languages.length > 1 ? (
            <div className={`flex flex-wrap items-center gap-2 rounded-[1.7rem] border p-3 ${surface.panel} shadow-sm`}>
              <span className={`px-2 text-xs font-black uppercase tracking-[0.18em] ${surface.muted}`}>Idioma</span>
              {languages.map((entry) => (
                <button key={entry} type="button" onClick={() => setLanguage(entry)} className={`rounded-full border px-3 py-2 text-xs font-black uppercase tracking-[0.16em] ${language === entry ? surface.activeChip : surface.chip}`}>
                  {entry}
                </button>
              ))}
            </div>
          ) : null}

          <div className={`grid gap-3 rounded-[1.7rem] border p-4 ${surface.panel} shadow-sm lg:grid-cols-[1.3fr_1fr]`}>
            <div className="flex flex-wrap gap-2">
              {groupSections.map((group, index) => (
                <a key={group.key} href={`#grupo-${group.key}`} className={`rounded-full border px-4 py-2 text-sm font-black ${index === 0 ? surface.activeChip : surface.chip}`}>
                  {group.label}
                </a>
              ))}
              {data.dailyMenu.enabled ? <a href="#menu-dia" className={`rounded-full border px-4 py-2 text-sm font-black ${surface.chip}`}>Menú del día</a> : null}
            </div>
            <div className="flex flex-wrap justify-start gap-2 lg:justify-end">
              {data.restaurant.showWhatsapp && data.restaurant.whatsapp ? (
                <a href={whatsappHref} className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-black text-white shadow-sm ${radiusClass[data.restaurant.borderRadiusStyle]}`} style={{ backgroundColor: data.restaurant.primaryColor }}>
                  <MessageCircle size={16} /> WhatsApp
                </a>
              ) : null}
              <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-black ${surface.chip}`}>
                <QrCode size={16} /> QR listo
              </span>
            </div>
          </div>

          {contactRows.length ? (
            <div className={`rounded-[1.7rem] border p-4 text-sm shadow-sm ${surface.panel} ${surface.muted}`}>
              <div className="space-y-3">
                {contactRows.map((row) => (
                  <p key={row.key} className="flex items-start gap-3 break-words leading-6">
                    <span className="mt-1 shrink-0">{row.icon}</span>
                    <span className="min-w-0 flex-1">{row.value}</span>
                  </p>
                ))}
              </div>
            </div>
          ) : null}

          {data.dailyMenu.enabled ? <div id="menu-dia"><DailyMenuPreview data={data} compact={preview} surface={surface} /></div> : null}

          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.filter((category) => category.id !== "daily").map((category) => (
              <a key={category.id} href={`#${category.id}`} className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-black ${surface.chip}`}>
                {category.name}
              </a>
            ))}
          </div>

          {groupSections.map((group) => {
            const groupCategories = group.categories;
            return (
              <section key={group.key} id={`grupo-${group.key}`} className="space-y-5">
                <div className={`rounded-[1.7rem] px-5 py-4 ${surface.sectionHeader}`}>
                  <p className="text-[11px] font-black uppercase tracking-[0.28em] opacity-70">Sección</p>
                  <h2 className="text-2xl font-black" style={headingStyle}>{group.label}</h2>
                </div>
                {groupCategories.map((category) => {
                  const items = getVisibleProducts(data.products, category.id);
                  if (!items.length) return null;
                  return (
                    <section key={category.id} id={category.id} className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className={`text-2xl font-black ${surface.heading}`} style={headingStyle}>{category.name}</h3>
                        <span className={`whitespace-nowrap text-[11px] font-black uppercase tracking-[0.18em] ${surface.muted}`}>{items.length} productos</span>
                      </div>
                      <div className={data.restaurant.template === "compact" ? "space-y-2" : data.restaurant.template === "visual" ? "grid gap-4 xl:grid-cols-2" : "grid gap-3 xl:grid-cols-2"}>
                        {items.map((product) => <ProductCard key={product.id} product={product} data={data} compact={compactMode} surface={surface} />)}
                      </div>
                    </section>
                  );
                })}
              </section>
            );
          })}

          <section className={`grid gap-4 rounded-[1.8rem] border p-5 shadow-sm md:grid-cols-[1fr_220px] ${surface.panel}`}>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em]" style={{ color: data.restaurant.primaryColor }}>Escanea nuestra carta</p>
              <h3 className={`mt-2 text-2xl font-black ${surface.heading}`} style={headingStyle}>{data.restaurant.name}</h3>
              <p className={`mt-2 text-sm leading-7 ${surface.muted}`}>{proposal ? "Así podría verse la carta digital del restaurante." : "Carta digital con fotos, menú del día y productos actualizados."}</p>
              {brandingVisible ? (
                <p className={`mt-3 text-xs font-black uppercase tracking-[0.14em] ${surface.muted}`}>
                  Creado con {BRAND_NAME} · {BRAND_DOMAIN_PLACEHOLDER}
                </p>
              ) : null}
            </div>
            <div className={`flex flex-col items-center justify-center rounded-[1.5rem] p-4 text-center ${surface.softPanel}`}>
              <RealQrCode value={publicUrl || `${BRAND_DOMAIN_PLACEHOLDER}${buildPublicPath(data.restaurant.slug)}`} color={data.restaurant.primaryColor} fileName={`qr-${data.restaurant.slug || "carta"}.png`} showDownload={!preview && !brandingVisible} />
              <p className={`mt-3 text-xs font-black uppercase tracking-[0.16em] ${surface.muted}`}>/{data.restaurant.slug}</p>
            </div>
          </section>
        </section>
      </div>
    </div>
  );
}

export { FakeQr };
