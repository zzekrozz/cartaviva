import ClientCartaPage from "./ClientCartaPage";

export default function CartaPage({ params }: { params: { slug: string } }) {
  return <ClientCartaPage slug={params.slug} />;
}
