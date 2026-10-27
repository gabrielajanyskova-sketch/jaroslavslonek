# Ing. Jaroslav Slonek — web finančního poradce

Statický jednostránkový web na **Cloudflare Pages**. Nasazuje se samo při každém
pushi do `main` (bez build příkazu, výstupní složka = kořen repozitáře).

Texty webu se upravují v **`/admin`** — admin ukládá `content.json` přes GitHub API
(potřebuje GitHub token, ukládá se jen v prohlížeči správce) a stránka si obsah
při načtení doplní z `content.json`.

## Struktura

```
index.html                  celý web (styly, skripty a schema.org přímo v souboru)
content.json                obsah upravovaný v adminu (texty, recenze, FAQ, kontakty)
admin.html                  administrace obsahu
ochrana-osobnich-udaju.html zásady ochrany osobních údajů (noindex)
404.html                    stránka „nenalezeno“ (noindex) — bez ní by Pages vracel úvod
functions/_middleware.js    www přesměrování, noindex mimo hlavní doménu, HSTS
_headers                    bezpečnostní hlavičky a cache statických souborů
_redirects                  přesměrování starých adres (gdpr.html → /ochrana-osobnich-udaju)
robots.txt, sitemap.xml     pro vyhledávače (v sitemapě jen indexovatelné stránky)
llms.txt                    přehled pro AI vyhledávače (ChatGPT, Perplexity, Gemini…)
```

## SEO, schema.org a AI vyhledávače

- Hlavní adresa je `https://www.jaroslavslonek.cz`: na ni míří canonical, sitemap,
  Open Graph i schema.org. `jaroslavslonek.cz` bez www se přesměruje (301),
  `/index.html` → `/`. Na jiných adresách (`*.pages.dev`) web běží s `noindex`.
- Odkazy na podstránky píšeme **bez `.html`** (`/ochrana-osobnich-udaju`) —
  Cloudflare adresy s `.html` přesměrovává a Google je pak hlásí jako „Stránka
  s přesměrováním“.
- Do `sitemap.xml` patří jen stránky, které se mají indexovat (ne `noindex`).
- Hlavička: title, description, canonical, robots `max-image-preview:large`,
  Open Graph (`og-image.jpg` 1200×630 + alt), Twitter card, theme-color.
- JSON-LD graf: `Person`, `FinancialService` (adresa, IČO, oblast, mapa),
  `WebSite`, `WebPage`, `FAQPage`. **Bez** vlastního `aggregateRating`/`review` —
  Google hodnocení, které firma uvádí sama o sobě, nepovoluje.
- Česká typografie: nezlomitelná mezera po jednopísmenných předložkách a spojkách
  a mezi číslem a `Kč`/`%`. V HTML je doplněná přímo, texty z adminu upraví
  funkce `czTypo` po načtení `content.json`.
- `llms.txt` drží služby, postup a časté otázky — při větší změně textů v adminu
  ho aktualizovat.
- Formulace: nepoužívat „nezávislý poradce/poradenství“ — je to regulovaný pojem.

## Bezpečnost

- `_headers`: nosniff, Referrer-Policy, X-Frame-Options, HSTS, Permissions-Policy.
- Admin: `no-store`, `noindex`, `X-Frame-Options: DENY` a vlastní
  Content-Security-Policy (skripty jen z webu, spojení jen na web a `api.github.com`).
- Heslo do adminu je jen v prohlížeči — skutečnou ochranou je GitHub token,
  nikde ho nesdílet.

## Po změnách / kontrola

- Google Search Console a Bing Webmaster Tools: odeslat `sitemap.xml`.
- Firemní profil Google: stejný název, adresa a telefon jako na webu.
- „Alternativní stránka se správným kanonickým tagem“ a „Stránka s přesměrováním“
  pro varianty bez www / přes http / s `?fbclid=` jsou v Search Console normální.

## Lokální náhled

```bash
python3 -m http.server 8000      # bez middleware
npx wrangler pages dev .         # včetně functions/ a _headers
```
