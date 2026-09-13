/**
 * Cloudflare Pages Function: /api/contact
 * Endpoint seguro para recepción y procesamiento de mensajes de contacto.
 */

// Función auxiliar para escapar entidades HTML (Prevención XSS)
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Función para sanitizar cabeceras (Prevención CRLF / SMTP Header Injection)
function sanitizeHeader(str) {
  if (!str) return '';
  return String(str).replace(/[\r\n\t]/g, ' ').trim();
}

// Validación estricta de formato de correo electrónico (RFC 5322 simplificado)
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  if (email.length > 254) return false;
  // Comprueba que no tenga saltos de línea ni caracteres de control
  if (/[\r\n]/.test(email)) return false;
  const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailPattern.test(email);
}

// Verificación de Origin / Referer contra dominios permitidos
function isAllowedOrigin(request, env) {
  const origin = request.headers.get('Origin');
  const referer = request.headers.get('Referer');
  const host = request.headers.get('Host');

  // Si hay lista explícita en variables de entorno (separadas por coma)
  const allowedList = env.ALLOWED_ORIGINS 
    ? env.ALLOWED_ORIGINS.split(',').map(s => s.trim().toLowerCase()) 
    : [];

  const requestDomain = origin 
    ? (() => { try { return new URL(origin).host.toLowerCase(); } catch (_) { return null; } })() 
    : (referer ? (() => { try { return new URL(referer).host.toLowerCase(); } catch (_) { return null; } })() : null);

  if (!requestDomain) {
    return false;
  }

  // Permitir localhost en desarrollo
  if (requestDomain.startsWith('localhost') || requestDomain.startsWith('127.0.0.1')) {
    return true;
  }

  // Si coincide con el propio Host del request (mismo dominio)
  if (host && requestDomain === host.toLowerCase()) {
    return true;
  }

  // Si está en la lista configurada
  if (allowedList.length > 0) {
    return allowedList.some(allowed => requestDomain === allowed || requestDomain.endsWith('.' + allowed));
  }

  // Por defecto, permitir si proviene de *.pages.dev o *.workers.dev
  return requestDomain.includes('pages.dev') || requestDomain.includes('workers.dev');
}

// Rate Limiting por IP usando Cache API de Cloudflare (Máx 3 envíos por hora)
async function checkRateLimit(clientIp) {
  if (!clientIp) return true;

  try {
    const cache = caches.default;
    const cacheKey = new Request(`https://rate-limit.local/ip/${encodeURIComponent(clientIp)}`, { method: 'GET' });
    
    const cached = await cache.match(cacheKey);
    let count = 0;
    
    if (cached) {
      const data = await cached.json();
      count = data.count || 0;
      if (count >= 3) {
        return false;
      }
    }

    count += 1;
    const responseToCache = new Response(JSON.stringify({ count }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600'
      }
    });

    await cache.put(cacheKey, responseToCache);
  } catch (e) {
    console.warn('Cache API rate limit check bypassed:', e);
  }

  return true;
}

// Verificación de Cloudflare Turnstile Token
async function verifyTurnstile(token, clientIp, secretKey) {
  if (!token) return false;

  const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
  const formData = new FormData();
  formData.append('secret', secretKey);
  formData.append('response', token);
  if (clientIp) formData.append('remoteip', clientIp);

  try {
    const result = await fetch(url, {
      method: 'POST',
      body: formData
    });
    const outcome = await result.json();
    return outcome.success === true;
  } catch (err) {
    console.error('Error al verificar Turnstile:', err);
    return false;
  }
}

export async function onRequestPost({ request, env }) {
  const clientIp = request.headers.get('CF-Connecting-IP') || '127.0.0.1';

  // 1. Validar Origin / Referer
  if (!isAllowedOrigin(request, env)) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Acceso no autorizado: origen no permitido.' 
    }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 2. Parsear Payload
  let body;
  try {
    body = await request.json();
  } catch (_) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Formato de solicitud inválido (JSON esperado).' 
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const { name, email, message, hp_company_website } = body || {};
  const turnstileToken = body ? body['cf-turnstile-response'] : null;

  // 3. Protección Honeypot: Si el campo oculto contiene texto, simular éxito y descartar
  if (hp_company_website && String(hp_company_website).trim() !== '') {
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Mensaje recibido correctamente.' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 4. Validar campos obligatorios
  if (!name || !email || !message) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Todos los campos son obligatorios.' 
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 5. Validar formato de email estricto y prevención de inyección CRLF
  if (!isValidEmail(email)) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'La dirección de correo electrónico proporcionada no es válida.' 
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 6. Rate Limiting por IP (Máx 3 por hora)
  const isAllowedRate = await checkRateLimit(clientIp);
  if (!isAllowedRate) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Has alcanzado el límite de 3 mensajes por hora. Por favor inténtalo más tarde.' 
    }), {
      status: 429,
      headers: { 
        'Content-Type': 'application/json',
        'Retry-After': '3600'
      }
    });
  }

  // 7. Validación de Cloudflare Turnstile
  const turnstileSecret = env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA';
  if (turnstileSecret) {
    const isTurnstileValid = await verifyTurnstile(turnstileToken, clientIp, turnstileSecret);
    if (!isTurnstileValid) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Error en la verificación de seguridad (Turnstile). Por favor recarga e intenta nuevamente.' 
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // 8. Sanitización de datos para la plantilla y cabeceras
  const safeName = sanitizeHeader(name);
  const safeEmail = sanitizeHeader(email);
  const escapedMessage = escapeHtml(message).replace(/\n/g, '<br>');
  const destinationEmail = env.DESTINATION_EMAIL || 'miguelaranguren19x@outlook.com';

  // 9. Envío de Correo mediante Resend API (Secreto de entorno)
  const resendApiKey = env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.warn('RESEND_API_KEY no configurada. Simulando recepción en entorno de pruebas.');
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Mensaje recibido con éxito (modo simulación activo sin RESEND_API_KEY).' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const emailPayload = {
      from: env.FROM_EMAIL || 'Portafolio <onboarding@resend.dev>',
      to: [destinationEmail],
      reply_to: safeEmail,
      subject: `Nuevo contacto de ${safeName} vía Portafolio`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #111; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px; padding: 24px;">
          <h2 style="color: #e27d24; border-bottom: 2px solid #e27d24; padding-bottom: 8px; margin-top: 0;">Nuevo Mensaje del Portafolio</h2>
          <p><strong>Remitente:</strong> ${escapeHtml(safeName)}</p>
          <p><strong>Email:</strong> <a href="mailto:${escapeHtml(safeEmail)}">${escapeHtml(safeEmail)}</a></p>
          <p><strong>Fecha/Hora (UTC):</strong> ${new Date().toISOString()}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <h3 style="color: #333; margin-bottom: 8px;">Mensaje:</h3>
          <div style="background: #f9f9f9; padding: 16px; border-radius: 6px; white-space: pre-wrap; word-break: break-word;">${escapedMessage}</div>
        </div>
      `
    };

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailPayload)
    });

    if (!resendResponse.ok) {
      const errText = await resendResponse.text();
      console.error('Error al enviar correo con Resend:', errText);
      throw new Error('No se pudo entregar el correo al servidor de mensajería.');
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Mensaje enviado y entregado exitosamente.' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error durante el envío de correo:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Error interno al procesar el envío. Por favor usa el enlace directo de correo.' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
