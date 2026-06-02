# CartaViva: tablas futuras Supabase

Flujo previsto: demo en localStorage → crear cuenta → guardar restaurante en Supabase → Stripe activa plan.

Tablas mínimas:

- users: Supabase Auth.
- restaurants: user_id, name, slug, city, phone, whatsapp, instagram, address, cover_image, logo, template, primary_color, plan_status, stripe_customer_id.
- categories: restaurant_id, name, order, visible, group.
- products: restaurant_id, category_id, name, description, price, image_url, is_featured/tags, allergens, status, order.
- subscriptions: restaurant_id, stripe_customer_id, stripe_subscription_id, status, price_id, current_period_end.
