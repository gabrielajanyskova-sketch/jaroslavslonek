// Cloudflare Pages middleware — běží před každým požadavkem, obsah webu nemění.
// Hlavní adresa webu je https://www.jaroslavslonek.cz:
//   - jaroslavslonek.cz bez www se trvale (301) přesměruje na www,
//   - /index.html se přesměruje na /,
//   - jiné adresy (*.pages.dev, náhledy) běží, ale nesmí se indexovat — duplicitní obsah.
const PRIMARY = 'www.jaroslavslonek.cz';

const SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=31536000',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
};

export async function onRequest({ request, next }) {
  const url = new URL(request.url);

  if (url.hostname === PRIMARY.replace(/^www\./, '')) {
    return Response.redirect(`https://${PRIMARY}${url.pathname}${url.search}`, 301);
  }
  if (url.pathname === '/index.html') {
    return Response.redirect(`${url.origin}/${url.search}`, 301);
  }

  const res = await next();
  const out = new Response(res.body, res);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) out.headers.set(k, v);
  if (url.hostname !== PRIMARY && url.hostname !== 'localhost') out.headers.set('X-Robots-Tag', 'noindex');
  return out;
}
