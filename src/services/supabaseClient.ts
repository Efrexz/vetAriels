import { createClient } from '@supabase/supabase-js';

// Singleton del cliente Supabase.
// Se crea UNA vez y se reutiliza en toda la app.
// Equivalente a tu `localStorage` global, pero apuntando a la nube.

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltan variables de entorno VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY. ' +
      'Copia .env.example a .env y completa los valores.',
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Expone el cliente en window para tests manuales desde la consola del navegador
// (ej. validar RLS, probar triggers). Seguro porque la anon key ya es publica.
// Si te molesta, puedes comentar este bloque.
if (typeof window !== 'undefined') {
  (window as any).supabase = supabase;
}