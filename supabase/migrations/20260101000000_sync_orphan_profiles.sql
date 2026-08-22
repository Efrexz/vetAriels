-- ============================================================================
-- Migracion: sincronizar profiles para usuarios de Auth que no tienen profile.
-- ============================================================================
-- Caso de uso: el trigger handle_new_user fallo (por motivo X) y quedaron
-- usuarios en auth.users sin fila correspondiente en profiles. Este script
-- los crea retroactivamente.
--
-- IMPORTANTE: este script NO se ejecuta automaticamente. Es una migracion
-- puntual para limpiar datos huerfanos. En produccion real no deberia
-- haber casos pendientes, pero durante el desarrollo pueden aparecer.
-- ============================================================================

INSERT INTO public.profiles (id, company_id, role, first_name, last_name)
SELECT
  u.id,
  (u.raw_app_meta_data ->> 'company_id')::UUID,
  COALESCE(u.raw_app_meta_data ->> 'role', 'RECEPCIONISTA'),
  COALESCE(u.raw_app_meta_data ->> 'first_name', ''),
  COALESCE(u.raw_app_meta_data ->> 'last_name', '')
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
  AND u.raw_app_meta_data ->> 'company_id' IS NOT NULL
ON CONFLICT (id) DO NOTHING;

-- Verificacion: debe mostrar todos los usuarios con su profile.
SELECT
  u.email,
  p.role,
  p.active,
  p.first_name,
  p.last_name
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
ORDER BY u.created_at;