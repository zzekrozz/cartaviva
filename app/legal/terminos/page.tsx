import { BRAND_NAME } from "@/lib/brand";
import { LegalPage } from "@/components/legal/LegalPage";

export default function Page() {
  return (
    <LegalPage title="Términos del servicio">
      <h2>Uso del servicio</h2>
      <p>{BRAND_NAME} permite crear y publicar cartas digitales, menús del día, QR, propuestas visuales y páginas públicas para restaurantes, bares y cafeterías.</p>
      <h2>Responsabilidad del restaurante</h2>
      <p>El restaurante es responsable de mantener actualizados precios, productos, disponibilidad, horarios, datos de contacto, fotos y alérgenos. También debe revisar traducciones, textos y enlaces antes de publicar.</p>
      <h2>Fotos y contenido</h2>
      <p>Las fotos deben ser propias, cedidas por el restaurante o contar con permiso suficiente. El restaurante declara tener derecho a usar todas las imágenes, logotipos, cartas y contenidos subidos al servicio.</p>
      <h2>Montaje asistido</h2>
      <p>{BRAND_NAME} puede ofrecer montaje inicial si se contrata o está incluido durante una promoción. El montaje puede tener límites de productos, fotos, idiomas y rondas de cambios según el plan o la oferta vigente.</p>
      <h2>Límites por plan</h2>
      <p>Cada plan puede tener límites de productos, fotos, idiomas, QR, personalización, menús programados y otras funciones. Si se superan, el servicio puede pedir cambio de plan o bloquear edición premium sin borrar la información ya creada.</p>
      <h2>Descuentos de lanzamiento</h2>
      <p>Los descuentos, pruebas, meses incluidos y ofertas de lanzamiento pueden cambiar, finalizar o limitarse a determinados restaurantes, periodos o zonas.</p>
      <h2>Suspensión</h2>
      <p>Podremos suspender cuentas por uso abusivo, ilegal, fraudulento, por contenido no autorizado o por impago prolongado.</p>
    </LegalPage>
  );
}
