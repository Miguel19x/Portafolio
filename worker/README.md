# Backend Serverless para Formulario de Contacto (Cloudflare)

Este módulo implementa el endpoint `/api/contact` con validaciones de seguridad de nivel de producción:

## Características de Seguridad Implementadas

1. **Honeypot Anti-Spam**:
   - Campo oculto (`hp_company_website`) con estilos fuera de pantalla (`.hp-field-wrap`).
   - Si un bot o scraper rellena este campo, el servidor descarta la petición simulando éxito (`200 OK`) sin consumir recursos ni enviar correos.

2. **Cloudflare Turnstile**:
   - Verificación server-side del token `cf-turnstile-response` contra la API oficial de Cloudflare (`/turnstile/v0/siteverify`).

3. **Prevención de Inyección de Cabeceras (CRLF Injection)**:
   - Los campos `email` y `name` son depurados eliminando cualquier salto de línea (`\r`, `\n`) antes de insertarse en el correo, previniendo ataques de inyección SMTP (`Bcc:`, `Cc:`).
   - Validación estricta del formato de email según RFC 5322.

4. **Validación de Origen (`Origin` / `Referer`)**:
   - Bloquea peticiones directas de scripts externos o dominios no autorizados con `403 Forbidden`.

5. **Rate Limiting por IP**:
   - Limita a un máximo de **3 envíos por hora** por dirección IP (`CF-Connecting-IP`) utilizando Cloudflare Cache API nativo.

6. **Sanitización contra XSS**:
   - El cuerpo del mensaje es escapado contra HTML (`&`, `<`, `>`, `"`, `'`) antes de incluirse en el correo o si se visualiza en logs/dashboards.

7. **Secretos de Entorno**:
   - Las claves de API (`RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`) nunca se exponen al frontend ni al repositorio; se inyectan como variables de entorno seguras.

---

## Opciones de Despliegue

### Opción A: Despliegue en Cloudflare Pages (Recomendado si usas Pages)
Si tu portafolio está desplegado con **Cloudflare Pages**:
1. El archivo en `functions/api/contact.js` se detecta y ejecuta automáticamente en la ruta `/api/contact`.
2. En el panel de Cloudflare:
   - Ve a **Workers & Pages** > Selecciona tu proyecto de Pages > **Settings** > **Environment variables**.
   - Añade las siguientes variables de producción:
     - `RESEND_API_KEY`: Tu clave API de [Resend](https://resend.com) (`re_...`).
     - `TURNSTILE_SECRET_KEY`: Tu clave secreta de Turnstile obtenida de Cloudflare.
     - `DESTINATION_EMAIL`: `miguelaranguren19x@outlook.com`.
     - `ALLOWED_ORIGINS`: Tu dominio (ej. `tu-dominio.pages.dev`).

### Opción B: Despliegue como Worker Independiente
Si prefieres un Worker independiente:
1. Instala o utiliza Wrangler:
   ```bash
   npx wrangler login
   ```
2. Configura los secretos:
   ```bash
   npx wrangler secret put RESEND_API_KEY
   npx wrangler secret put TURNSTILE_SECRET_KEY
   ```
3. Despliega el Worker:
   ```bash
   npx wrangler deploy
   ```
