-- ============================================================================
-- Seed de desarrollo local — VetAriel (esquema v3)
-- ============================================================================
-- Se ejecuta con `supabase db reset` SOLO en local. NO sembrar aqui:
--   * usuarios de Auth (se crean desde la app / Edge Function admin-users),
--   * datos de demo para el cliente (se crean desde la UI, es mejor rehearsal).
-- Solo se siembra la empresa base para poder iniciar sesion y crear datos.
-- ============================================================================

INSERT INTO public.companies (name, ruc, address, phone, email)
VALUES ('Veterinaria Demo (local)', '20480000000', 'Av. Veterinaria 123, Lima', '999999999', 'demo@vetariel.local')
ON CONFLICT DO NOTHING;
