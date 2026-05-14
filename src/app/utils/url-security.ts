const PLACEHOLDER = 'https://via.placeholder.com/320x320.png?text=Producto';

/**
 * Solo permite URLs http(s) para imágenes; evita javascript: y otros esquemas en datos de catálogo.
 */
export function trustedHttpImageUrl(url: string | undefined | null): string {
  if (!url || typeof url !== 'string') {
    return PLACEHOLDER;
  }
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return PLACEHOLDER;
  }
  if (/[\u0000-\u001F\u007F]/.test(trimmed) || trimmed.length > 2048) {
    return PLACEHOLDER;
  }
  return trimmed;
}

/** Texto plano seguro para mensajes (WhatsApp, logs): sin caracteres de control. */
export function sanitizePlainText(text: string | undefined | null, maxLength: number): string {
  if (!text || typeof text !== 'string') {
    return '';
  }
  return text.replace(/[\u0000-\u001F\u007F]/g, '').trim().slice(0, maxLength);
}
