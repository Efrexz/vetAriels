# Guía — Crear proyecto en Supabase (Micro-fase 1B)

Esta guía la sigues TÚ en tu navegador, ya que requiere tu cuenta personal y
no puedo automatizarla por ti. Cada paso toma entre 1 y 3 minutos.

---

## 1. Crear cuenta y proyecto

1. Abre https://supabase.com en tu navegador.
2. Click en **"Start your project"** (arriba a la derecha).
3. Inicia sesión con GitHub (es lo más rápido).
4. Una vez dentro, click en **"New project"**.
5. Completa el formulario:
   - **Name**: `vetariel-dev` (o el que prefieras)
   - **Database Password**: genera una segura y guárdala (no la pierdas).
     Esta contraseña es la del **rol postgres** (administrador de la DB).
   - **Region**: `South America (São Paulo)` — la más cercana a Perú.
   - **Plan**: Free (suficiente para desarrollo).
6. Click **"Create new project"**.
7. Espera 1-2 minutos mientras Supabase aprovisiona el proyecto.

---

## 2. Obtener las credenciales para conectar tu app

Una vez creado el proyecto:

1. En el menú lateral izquierdo, ve a **Project Settings** (ícono de engranaje).
2. Click en **API**.
3. Verás dos valores que necesitas:
   - **Project URL** (algo como `https://xxxxx.supabase.co`)
   - **anon public key** (una cadena larga que empieza con `eyJhbGciOiJIUzI1NiIs...`)
4. Copia ambos valores.

---

## 3. Crear el archivo `.env` en tu proyecto

En la raíz de VetAriel, crea un archivo llamado `.env` (sin extension) con:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

Reemplaza los valores con los del paso anterior. **Este archivo NO se sube a
git** (ya está en .gitignore).

---

## 4. Ejecutar el schema SQL

1. En el menú lateral de Supabase, ve a **SQL Editor** (ícono de base de datos).
2. Click en **"New query"**.
3. Abre el archivo `db/supabase-schema.sql` de tu proyecto.
4. Copia TODO su contenido y pégalo en el editor SQL.
5. Click en **"Run"** (abajo a la derecha).
6. Deberías ver "Success. No rows returned" — eso significa que las tablas
   se crearon correctamente.

---

## 5. Insertar datos de ejemplo

1. En el mismo SQL Editor, crea una nueva query.
2. Abre `db/supabase-seed.sql` y pega su contenido.
3. Click en **"Run"**.
4. Deberías ver "Success. 9 rows affected" (4 clientes + 5 mascotas).

---

## 6. Verificar que todo está bien

1. En el menú lateral, ve a **Table Editor** (ícono de tabla).
2. Deberías ver dos tablas: `clients` y `pets`.
3. Click en `clients` → deberías ver 4 filas con los datos de Juan, María,
   Carlos y Ana.
4. Click en `pets` → deberías ver 5 filas con Max, Luna, Rocky, Mishi y Toby.

---

## 7. Próximo paso

Una vez tengas todo esto listo, dime "ya tengo Supabase configurado" y
continuamos con la **Micro-fase 1C**: instalar `@supabase/supabase-js` y
reemplazar el primer contexto (`ClientsContext`) para que lea/escriba en
Supabase en vez de localStorage.

---

## Quédate con estas ideas

- **Nunca** compartas tu `service_role key` — esa es la contraseña maestra de
  tu DB. Solo la `anon` key va al frontend.
- El **SQL Editor** es tu consola para ejecutar queries directamente en la DB.
  Es como la consola de `sqlite3` pero en la nube.
- El **Table Editor** es la versión visual: ves las tablas como hojas de Excel.
- **Storage** (ícono de imagen) es para guardar archivos (fotos de mascotas
  más adelante).
- **Authentication** (ícono de usuarios) es donde Supabase Auth vive — lo
  usaremos en la micro-fase 1D.