# MesaCarta MVP

Carta digital visual para restaurantes, bares y cafeterías.

## Rutas principales

- `/` landing
- `/builder` builder demo con localStorage
- `/login` login/registro con Supabase
- `/dashboard` cartas guardadas del usuario
- `/builder/[restaurantId]` builder real guardado en Supabase
- `/demo` demo pública
- `/carta/[slug]` carta pública por slug

## Configurar Supabase

1. Crea un proyecto en Supabase.
2. Ve a **SQL Editor**.
3. Ejecuta el archivo `supabase/schema.sql`.
4. Ve a **Project Settings > API**.
5. Copia:
   - Project URL
   - anon public key
6. Crea `.env.local` usando `.env.local.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY
```

## Vercel

Añade las mismas variables en:

**Vercel > Project > Settings > Environment Variables**

Después redeploy.

## Fase actual

Incluye login real, dashboard, guardado en Supabase, RLS y cartas públicas publicadas.

No incluye todavía pagos, IA, Stripe, pedidos, TPV ni subida real de imágenes.


## Fotos y QR

Esta versión incluye subida real de fotos con Supabase Storage. Las imágenes se comprimen en el navegador antes de subirse al bucket `menu-images` para ahorrar almacenamiento y mejorar carga.

También incluye QR real generado en el navegador y descarga en PNG desde el panel QR.

Para activar fotos: ejecuta `supabase/schema.sql` completo en Supabase SQL Editor. Ese SQL crea las tablas, políticas RLS y el bucket público `menu-images`.

## Fase beta: cómo probar productos y fotos

1. Entra en `/probar`.
2. Elige `Carta Visual` o `Restaurante Pro` para probar un plan con fotos.
3. Entra al builder demo o crea una carta desde `/dashboard`.
4. Ve a `Productos`.
5. Crea un producto o edita uno existente.
6. Usa `Subir foto` desde PC o móvil. La imagen se comprime en el navegador antes de subirla a Supabase Storage.
7. Guarda.
8. Publica.
9. Abre `/carta/tu-slug` y confirma que la foto aparece.
10. Para comprobar el gratis, cambia a plan `Gratis`: al intentar subir fotos debe aparecer el aviso de que las fotos empiezan desde Menú Día.

## Cómo probar Stripe checkout

1. Crea los productos y precios en Stripe: mensual/anual para Menú Día, Carta Visual y Restaurante Pro.
2. Añade las variables de entorno en Vercel o `.env.local`.
3. Entra con una cuenta real.
4. Ve a `/probar` o `/dashboard`.
5. Pulsa `Probar por 1 €` o `Pagar anual`.
6. Debe abrirse Stripe Checkout.
7. Al completar, vuelve a `/dashboard?checkout=success`.

## Cómo probar Stripe webhook

1. En Stripe Dashboard añade endpoint: `https://tu-dominio.com/api/stripe/webhook`.
2. Eventos mínimos: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`.
3. Copia el signing secret en `STRIPE_WEBHOOK_SECRET`.
4. Haz una compra de prueba y revisa que `profiles.subscription_status`, `selected_plan`, `stripe_customer_id` y `stripe_subscription_id` se actualizan.

## Cómo probar traducciones

1. Entra en una carta con plan `Restaurante Pro`.
2. Abre el paso `Idiomas`.
3. Selecciona hasta 2 idiomas extra.
4. Edita manualmente descripción, categorías, productos y menú del día.
5. Guarda y publica.
6. Abre la carta pública y usa el selector `ES | EN | FR | DE...`.
7. Si quieres traducción automática, configura `TRANSLATION_PROVIDER=google` y `GOOGLE_TRANSLATE_API_KEY`. El botón traduce solo cuando se pulsa, no cada vez que abre un cliente.

## Cómo probar propuestas

1. Entra en `/dashboard`.
2. En una carta pulsa `Propuesta`.
3. Se crea una copia con estado `proposal`, marca visible y enlace `/propuesta/[slug]`.
4. Comparte ese enlace con el restaurante.
5. La página muestra el aviso de que es una propuesta visual, no la carta oficial.

## Cómo probar emails

1. Añade `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `SUPPORT_EMAIL`.
2. En desarrollo, haz POST a `/api/emails/test` con `{ "to": "tu@email.com" }`.
3. El webhook de Stripe intenta enviar email cuando una suscripción queda activa o falla un pago.

## Cómo repetir tutorial

1. Entra en `/builder` o `/builder/[restaurantId]`.
2. Pulsa `Repetir tutorial` en la barra superior.
3. Usa `Siguiente` para avanzar por Restaurante, Diseño, Categorías, Productos, Menú del día y QR.
4. El estado se guarda en `localStorage` para no enseñarlo siempre.

## Variables de entorno nuevas

```bash
NEXT_PUBLIC_APP_URL=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRICE_MENU_DAY_MONTHLY=
STRIPE_PRICE_MENU_DAY_YEARLY=
STRIPE_PRICE_VISUAL_MONTHLY=
STRIPE_PRICE_VISUAL_YEARLY=
STRIPE_PRICE_PRO_MONTHLY=
STRIPE_PRICE_PRO_YEARLY=
STRIPE_PRICE_MENU_DAY_TRIAL_ONE_EURO=
STRIPE_PRICE_VISUAL_TRIAL_ONE_EURO=
STRIPE_PRICE_PRO_TRIAL_ONE_EURO=
GOOGLE_TRANSLATE_API_KEY=
TRANSLATION_PROVIDER=manual
RESEND_API_KEY=
RESEND_FROM_EMAIL=
SUPPORT_EMAIL=
ADMIN_EMAILS=
NEXT_PUBLIC_CONTACT_WHATSAPP=
```

## Pendiente de fase siguiente

- Stripe completo con cupones reales para el 50% durante 3 meses.
- Automatización de emails por cron antes de fin de prueba.
- Panel admin más completo para gestionar propuestas.
- Control estricto de límites por plan en servidor.
- Estadísticas y eventos de QR.
- Dominios personalizados.

## Fase comercial final añadida

Esta versión prepara MesaCarta para vender como beta: fotos como gancho principal, montaje asistido, mensual/trimestral/anual, Stripe trimestral, 29 € con 1 idioma extra, 49 € con hasta 3 idiomas extra, menú semanal Pro y QR para pegatina/mesa.

### Cómo probar plan gratis
1. Entra en `/probar`.
2. Elige Gratis.
3. Entra en `/builder?plan=free`.
4. Crea hasta 20 productos.
5. Prueba a subir una foto: debe mostrarse aviso de que las fotos empiezan desde Menú Día.
6. Ve a QR y comprueba que aparece marca visible.

### Cómo probar plan 29 con 1 idioma
1. Entra en `/probar`.
2. Elige Carta Visual.
3. Entra al builder con `?plan=visual` o crea checkout.
4. Abre sección Idiomas.
5. Selecciona 1 idioma extra.
6. Al intentar seleccionar más, debe avisar del límite.

### Cómo probar plan 49 con 3 idiomas
1. Entra en `/builder?plan=pro` o usa checkout Pro.
2. Abre sección Idiomas.
3. Selecciona hasta 3 idiomas extra.
4. Edita traducciones manuales de restaurante, categorías, productos y menú del día.

### Cómo probar trimestral “paga 2 usa 3”
1. Entra en `/probar`.
2. Cambia selector a Trimestral.
3. Verás precios: 38 €, 58 €, 98 € + IVA.
4. El botón envía a Stripe con `interval=quarterly`.
5. Debes crear los Price IDs trimestrales y añadirlos al `.env.local`.

### Cómo probar anual “paga 10 usa 12”
1. Entra en `/probar` o landing.
2. Cambia a Anual.
3. Verás 190 €, 290 €, 490 € + IVA.
4. Los botones usan Price IDs anuales.

### Cómo probar Stripe trimestral
1. Crea productos/precios recurrentes trimestrales en Stripe.
2. Añade:
   - `STRIPE_PRICE_MENU_DAY_QUARTERLY`
   - `STRIPE_PRICE_VISUAL_QUARTERLY`
   - `STRIPE_PRICE_PRO_QUARTERLY`
3. Ejecuta local o despliega en Vercel.
4. Entra en `/probar`, elige Trimestral y pulsa un plan de pago.
5. Para webhook, configura `/api/stripe/webhook` en Stripe.

### Cómo probar solicitud de montaje
1. Entra en `/montaje`, landing, `/probar` o dashboard.
2. Rellena formulario.
3. Se guarda en `setup_requests`.
4. Si `RESEND_API_KEY`, `RESEND_FROM_EMAIL` y `SUPPORT_EMAIL` están configurados, se preparan emails.

### Cómo probar menú semanal programado
1. Entra en `/builder?plan=pro` o una carta Pro.
2. Abre Menú del día.
3. Edita bloque “Menú semanal programado”.
4. Usa “Usar este menú hoy” para copiarlo al menú manual.
5. En carta pública, si existe menú programado para hoy y está activo, se muestra como menú destacado.

### Cómo probar propuesta personalizada
1. En dashboard, usa las funciones de propuesta existentes.
2. Abre `/propuesta/[slug]`.
3. Comprueba aviso de demo, marca visible y CTA de activación.
4. La propuesta no debe parecer carta oficial.

### Cómo probar QR formato pegatina
1. En builder, abre QR y publicar.
2. Verás QR principal, QR gratis con marca o limpio según plan.
3. Verás bloques visuales “Formato pegatina” y “Formato cartel”.
4. La descarga de cartel físico queda para fase posterior.

### Variables nuevas
Consulta `.env.local.example` para Stripe trimestral, Resend, admin, WhatsApp de contacto y oferta de lanzamiento.
