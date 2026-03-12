# Polarnest

Statische Premium-Website fuer die Marke `Polarnest` mit Startseite, Impressum und Datenschutz.

## Projektstruktur

- `index.html`: Homepage mit allen Marken-, Inhalts- und Kontaktbereichen
- `impressum.html`: gestaltete Impressum-Seite
- `datenschutz.html`: gestaltete Datenschutz-Seite
- `styles.css`: gemeinsames Designsystem fuer alle Seiten
- `script.js`: Navigation, Scroll-Reveals, Slider, FAQ und Formularlogik
- `assets/images/`: lokal gespeicherte Bildassets
- `robots.txt` und `sitemap.xml`: einfache SEO-Basics

## Lokal starten

```bash
python3 -m http.server 4173
```

Danach im Browser `http://localhost:4173` oeffnen.

## Formular

Das Anfrageformular ist aktuell bewusst ohne Server-Backend umgesetzt.

- Beim Absenden wird eine vorbefuellte E-Mail an `info@gut-bau.com` vorbereitet.
- Dadurch gibt es keinen stillen "Fake Submit" und keinen kaputten Button.

Wenn spaeter echte serverseitige Verarbeitung gewuenscht ist, bieten sich zwei saubere Wege an:

1. Vercel Function fuer Formularannahme und Validierung
2. Formularservice wie Formspree oder Resend fuer den E-Mail-Versand

## Deployment

Das Projekt ist als statische Website fuer GitHub und Vercel ausgelegt.

- Push nach `main`
- Vercel deployed automatisch
