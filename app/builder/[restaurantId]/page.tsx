import SavedBuilderClient from "./SavedBuilderClient";

export default function SavedBuilderPage({ params }: { params: { restaurantId: string } }) {
  return <SavedBuilderClient restaurantId={params.restaurantId} />;
}
