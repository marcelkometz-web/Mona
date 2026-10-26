# Alte Mona-Webseite stillgelegt

Die alte Garten-App unter `/Mona/` wurde am 26. Oktober 2026 aus dem veröffentlichten Stand entfernt. Ohne `index.html` liefert GitHub Pages dort HTTP 404 mit einem Verweis auf die aktuellen Apps.

- Garten: https://marcelkometz-web.github.io/newgarten/
- Rezepte: https://marcelkometz-web.github.io/rezepte/

Der bisherige Quellcode ist unverändert im Branch `archive/mona-before-retirement-2026-10-26` und im Git-Verlauf erhalten. Es wurden keine Datenbanken verändert.

`sw.js` ist ausschließlich zur Stilllegung alter Browser-Service-Worker vorhanden. Er entfernt nur den früheren Mona-Cache `ramonas-garten-v4` und meldet den alten Worker ab. Die Caches und Sitzungen der aktuellen Apps werden nicht gelöscht.
