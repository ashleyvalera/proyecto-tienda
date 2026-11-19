-- ============================================================================
-- La casita de Mathi · Datos iniciales del catálogo (Precios exactos en S/)
-- ============================================================================

insert into public.products (
  slug, name, category, subtype, brand, device_model, price, compare_at_price,
  supports_mica_addon, mica_addon_price, image_url, swatches, rating, review_count,
  featured, badge, sort_order
) values
  -- FUNDAS COMERCIALES (S/ 35, + S/ 10 mica de vidrio opcional)
  ('funda-samsung-galaxy-a54-transparente', 'Funda Transparente Samsung Galaxy A54', 'fundas', 'Transparente', 'Samsung', 'Galaxy A54', 35, 42, true, 10, '/images/funda-transparente.jpg', '["#E5E7EB", "#CBD5E1"]', 4.9, 18, true, 'Top ventas', 10),
  ('funda-samsung-galaxy-a54-color', 'Funda Color Entero Samsung Galaxy A54', 'fundas', 'Color entero', 'Samsung', 'Galaxy A54', 35, 42, true, 10, '/images/funda-color.jpg', '["#94C5B5", "#F3A8B8", "#1F2937", "#E5D3B3"]', 4.8, 15, true, 'Nuevo', 11),
  ('funda-samsung-galaxy-a54-diseno', 'Funda Con Diseño Samsung Galaxy A54', 'fundas', 'Con diseño', 'Samsung', 'Galaxy A54', 35, 45, true, 10, '/images/funda-diseno.jpg', '["#F5C2C7", "#A3C4BC", "#F7D9C4"]', 4.9, 24, true, '-20%', 12),

  ('funda-motorola-moto-g54-transparente', 'Funda Transparente Motorola Moto G54', 'fundas', 'Transparente', 'Motorola', 'Moto G54', 35, null, true, 10, '/images/funda-transparente.jpg', '["#E5E7EB", "#CBD5E1"]', 4.7, 9, false, null, 13),
  ('funda-motorola-moto-g54-color', 'Funda Color Entero Motorola Moto G54', 'fundas', 'Color entero', 'Motorola', 'Moto G54', 35, null, true, 10, '/images/funda-color.jpg', '["#94C5B5", "#60A5FA", "#1F2937"]', 4.8, 11, false, null, 14),
  ('funda-motorola-moto-g54-diseno', 'Funda Con Diseño Motorola Moto G54', 'fundas', 'Con diseño', 'Motorola', 'Moto G54', 35, 42, true, 10, '/images/funda-diseno.jpg', '["#F5C2C7", "#C4B5FD", "#FDE68A"]', 4.9, 14, true, 'Popular', 15),

  ('funda-xiaomi-redmi-note-13-transparente', 'Funda Transparente Xiaomi Redmi Note 13', 'fundas', 'Transparente', 'Xiaomi', 'Redmi Note 13', 35, null, true, 10, '/images/funda-transparente.jpg', '["#E5E7EB"]', 4.8, 16, false, null, 16),
  ('funda-xiaomi-redmi-note-13-color', 'Funda Color Entero Xiaomi Redmi Note 13', 'fundas', 'Color entero', 'Xiaomi', 'Redmi Note 13', 35, 40, true, 10, '/images/funda-color.jpg', '["#94C5B5", "#F9A8D4", "#374151"]', 4.9, 21, true, 'Oferta', 17),
  ('funda-xiaomi-redmi-note-13-diseno', 'Funda Con Diseño Xiaomi Redmi Note 13', 'fundas', 'Con diseño', 'Xiaomi', 'Redmi Note 13', 35, 45, true, 10, '/images/funda-diseno.jpg', '["#F5C2C7", "#A3C4BC", "#F7D9C4"]', 4.9, 19, false, null, 18),

  ('funda-iphone-a-pedido', 'Fundas para iPhone (Según modelo)', 'fundas', 'A cotizar', 'Apple', 'iPhone 11 al 16 Pro Max', null, null, true, 10, '/images/funda-diseno.jpg', '["#1F2937", "#E5D3B3", "#94C5B5", "#F3A8B8"]', 5.0, 32, true, 'Consultar', 19),

  -- PROTECTORES (S/ 20)
  ('protector-pantalla-templado', 'Protector de pantalla templado', 'protectores', 'Pantalla templada', 'Universal', null, 20, 25, false, 0, '/images/protector-vidrio.jpg', '["#E5E7EB"]', 4.9, 27, true, 'Esencial', 20),
  ('protector-camara', 'Protector de cámara', 'protectores', 'Cámara', 'Universal', null, 20, null, false, 0, '/images/protector-camara.jpg', '["#111827", "#D1D5DB", "#EAB308"]', 4.8, 14, false, null, 21),

  -- CABLES (S/ 20 y 3 en 1 a consultar)
  ('cable-v8-micro-usb', 'Cable V8 / Micro USB', 'cables', 'V8 / Micro USB', 'Universal', null, 20, null, false, 0, '/images/cable-usbc.jpg', '["#FFFFFF", "#1F2937"]', 4.7, 10, false, null, 30),
  ('cable-usb-a-usb-c', 'Cable USB-A a USB-C', 'cables', 'USB-A a USB-C', 'Universal', null, 20, null, false, 0, '/images/cable-usbc.jpg', '["#FFFFFF", "#1F2937"]', 4.8, 19, false, null, 31),
  ('cable-usb-c-usb-c', 'Cable USB-C a USB-C', 'cables', 'USB-C a USB-C', 'Universal', null, 20, 25, false, 0, '/images/cable-usbc.jpg', '["#FFFFFF"]', 4.9, 23, true, 'Carga rápida', 32),
  ('cable-usb-a-lightning', 'Cable USB-A a Lightning', 'cables', 'USB-A a Lightning', 'Apple', null, 20, null, false, 0, '/images/cable-usbc.jpg', '["#FFFFFF"]', 4.8, 13, false, null, 33),
  ('cable-usb-c-lightning', 'Cable USB-C a Lightning', 'cables', 'USB-C a Lightning', 'Apple', null, 20, 25, false, 0, '/images/cable-usbc.jpg', '["#FFFFFF"]', 4.9, 17, false, null, 34),
  ('cable-usb-c-micro-usb', 'Cable USB-C a Micro USB', 'cables', 'USB-C a Micro USB', 'Universal', null, 20, null, false, 0, '/images/cable-usbc.jpg', '["#FFFFFF", "#1F2937"]', 4.6, 8, false, null, 35),
  ('cable-3-en-1', 'Cable 3 en 1', 'cables', '3 en 1', 'Universal', null, null, null, false, 0, '/images/cable-usbc.jpg', '["#1F2937", "#DC2626"]', 4.8, 11, false, 'Consultar', 36),

  -- CARGADORES (S/ 20 rápido USB-C y resto a consultar)
  ('cargador-rapido-usb-c', 'Cargador rápido USB-C', 'cargadores', 'Cargador de pared', 'Universal', null, 20, 28, false, 0, '/images/cargador-rapido.jpg', '["#FFFFFF"]', 4.9, 25, true, 'Oferta', 40),
  ('cargador-pared', 'Cargador de pared', 'cargadores', 'De pared', 'Universal', null, null, null, false, 0, '/images/cargador-rapido.jpg', '["#FFFFFF", "#1F2937"]', 4.7, 9, false, 'Consultar', 41),
  ('cargador-rapido', 'Cargador rápido', 'cargadores', 'Rápidos', 'Universal', null, null, null, false, 0, '/images/cargador-rapido.jpg', '["#FFFFFF"]', 4.8, 12, false, 'Consultar', 42),
  ('cargador-auto', 'Cargador para auto', 'cargadores', 'Para auto', 'Universal', null, null, null, false, 0, '/images/cargador-rapido.jpg', '["#1F2937"]', 4.7, 7, false, 'Consultar', 43),
  ('cargador-inalambrico', 'Cargador inalámbrico', 'cargadores', 'Inalámbricos', 'Universal', null, null, null, false, 0, '/images/cargador-rapido.jpg', '["#FFFFFF", "#1F2937"]', 4.9, 10, false, 'Consultar', 44),

  -- AUDÍFONOS (S/ 20 jack/usb-c/lightning y modelos especiales a consultar)
  ('audifonos-inalambricos', 'Audífonos inalámbricos', 'audifonos', 'Inalámbricos', 'Universal', null, null, null, false, 0, '/images/audifonos-inalambricos.jpg', '["#FFFFFF", "#1F2937"]', 4.9, 29, true, 'Destacado', 50),
  ('audifonos-jack-35', 'Audífonos jack 3.5 mm', 'audifonos', 'Jack 3.5 mm', 'Universal', null, 20, null, false, 0, '/images/audifonos-inalambricos.jpg', '["#FFFFFF", "#1F2937"]', 4.7, 15, false, null, 51),
  ('audifonos-usb-c', 'Audífonos USB-C', 'audifonos', 'USB-C', 'Universal', null, 20, null, false, 0, '/images/audifonos-inalambricos.jpg', '["#FFFFFF"]', 4.8, 12, false, null, 52),
  ('audifonos-lightning', 'Audífonos Lightning', 'audifonos', 'Lightning', 'Apple', null, 20, null, false, 0, '/images/audifonos-inalambricos.jpg', '["#FFFFFF"]', 4.8, 14, false, null, 53),
  ('audifonos-con-cable', 'Audífonos con cable', 'audifonos', 'Con cable', 'Universal', null, null, null, false, 0, '/images/audifonos-inalambricos.jpg', '["#FFFFFF", "#1F2937"]', 4.6, 8, false, 'Consultar', 54),
  ('audifonos-diadema', 'Audífonos de diadema', 'audifonos', 'Diadema', 'Universal', null, null, null, false, 0, '/images/audifonos-diadema.jpg', '["#E5E7EB", "#1F2937"]', 4.9, 16, true, 'Consultar', 55)
on conflict (slug) do nothing;
