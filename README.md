# Green Forest — strona wizytówka

Strona wizytówkowa dla firmy **Green Forest** (Kuba Szczerba) — arborystyka, wycinka drzew, zagospodarowanie terenów zielonych i sprzedaż drewna na opał. Puławy i okolice, dojazd do 150 km.

Projekt WM Web Solutions — autorski kod, WebGL/scroll-driven, deploy na Cloudflare Workers.

## Zakres

- Pakiet podstawowy (wizytówka) + utrzymanie
- Pozycjonowanie / SEO lokalne (Puławy, arborysta, wycinka drzew, drewno opałowe)

## Stack

- Statyczny front (HTML / CSS / vanilla JS)
- WebGL / Three.js dla hero (opcjonalnie, ładowane leniwie)
- Hosting: Cloudflare Workers (static assets, `wrangler`)

## Struktura

```
green-forest/
├── public/            # to, co serwuje Worker (static assets)
│   ├── index.html
│   ├── styles.css
│   ├── main.js
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── img/           # zdjęcia, logo, OG image
│   └── assets/        # rolki / wideo z pracy Kuby
├── wrangler.jsonc
├── package.json
└── README.md
```

## Strony (zbudowane wg SEO-plan-tresci.md)

Usługi:
- `/` — wizytówka (strona główna)
- `/wycinka-drzew/` — wycinka drzew Puławy
- `/drewno-opalowe/` — drewno opałowe Puławy
- `/pielegnacja-zieleni/` — pielęgnacja zieleni i ogrodów
- `/tereny-zielone/` — karczowanie i zagospodarowanie terenów
- `/drewno-tartaczne/` — skup/sprzedaż drewna tartacznego + zrębkowanie
- `/wycinka-drzew-lublin/` — geo-landing (Lublin)

Blog:
- `/blog/` — lista wpisów
- `/blog/ile-kosztuje-wycinka-drzewa/`
- `/blog/pozwolenie-na-wycinke-drzew/`
- `/blog/jakie-drewno-na-opal/`
- `/blog/kiedy-przycinac-drzewa-zywoploty/`

Każda strona: meta + OG, schema (Service/Article + Breadcrumb + FAQ), linkowanie wewnętrzne, spójna nawigacja/stopka/FAB. Wpisane w `sitemap.xml`.

## Uruchomienie na nowym komputerze

Minimum, by tylko zobaczyć stronę: **Git** + **Node.js**.

1. Zainstaluj [Git](https://git-scm.com/downloads) i [Node.js](https://nodejs.org) (wersja LTS).
2. Склonuj repo (prywatne — wymaga dostępu do konta / zalogowanego `gh` lub Git):

```bash
git clone https://github.com/barmed555-spec/green-forest.git
cd green-forest
```

3. Odpal podgląd — patrz sekcja niżej. Do samego podglądu **nie trzeba** `npm install`
   (`server.js` nie ma zależności). `npm install` jest potrzebne dopiero dla drogi z wranglerem/deployem.

| Cel | Co potrzebne |
|---|---|
| Склonować repo | Git + dostęp do repo |
| Tylko zobaczyć stronę | Node.js → `node server.js` |
| Środowisko Cloudflare / deploy | Node.js + npm → `npm install`, potem `npm run dev` / `npm run deploy` (+ `wrangler login`) |

## Podgląd lokalny (najprościej — bez instalacji)

Kliknij dwukrotnie **`start-preview.cmd`** (albo w terminalu `node server.js`).
Serwer wystartuje na **http://localhost:8080** i sam otworzy przeglądarkę.
Obsługuje „ładne" adresy (`/wycinka-drzew/`, `/blog/...`). Wymaga tylko Node.js.
Zatrzymanie: `Ctrl+C` lub zamknij okno.

## Uruchomienie przez wrangler (jak na produkcji)

```bash
npm install
npm run dev      # wrangler dev -> podgląd zgodny z Cloudflare Workers
```

## Deploy

```bash
npm run deploy   # wrangler deploy
```

## Dane wprowadzone (z Confluence / FB)

- [x] Usługi (9 pozycji) + treść sekcji i ton marki
- [x] Kontakt: tel. 694 757 680, e-mail green.forest33@op.pl
- [x] Obszar działania (Puławy + miejscowości, dojazd do 150 km)
- [x] Schema LocalBusiness + SEO meta/keywords
- [x] Link do Facebooka w stopce

## Do uzupełnienia (materiały od Kuby)

- [ ] Logo + kolory marki (jest „zaktualizowane logo" na Confluence → `public/img/`)
- [ ] Zdjęcia realizacji + rolki wideo (do sekcji „Realizacje") — z Confluence/FB
- [ ] OG image (`public/img/og-image.jpg`) + favicon (`public/img/favicon.svg`)
- [ ] Opinie klientów (inspiracja: Timber Fuel)
- [ ] NIP / dane rejestrowe do stopki (placeholder `000-000-00-00`)
- [ ] Godziny pracy (w schema wpisane orientacyjnie Mo-Sa 07:00-19:00)
- [ ] Google Business Profile (pod SEO lokalne)
- [ ] Domena docelowa (aktualizacja `canonical`, `sitemap.xml`, `robots.txt`, schema `url`)
