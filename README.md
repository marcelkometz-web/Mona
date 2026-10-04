# Ramonas Garten Anzucht 🌱

Eine interaktive, leichtgewichtige Offline-Webanwendung zur strukturierten Planung, Erfassung und Begleitung der Pflanzenanzucht – von der Aussaat bis zur Ernte.

---

## 📖 Übersicht

Ramonas Garten Anzucht hilft dabei, den optimalen Überblick über Aussaat-, Pikier- und Erntezeiten im Gartenjahr zu behalten. Das Tool bündelt alle relevanten Kulturen (Gemüse, Kräuter, Nutzpflanzen) in einer übersichtlichen Oberfläche, lässt sich komplett offline bedienen und bietet praktische Export-Funktionen direkt für das Klemmbrett im Gewächshaus oder Gartenbeet.

---

## ✨ Features & Funktionen

- **Umfassende Pflanzendatenbank:**
  - Integrierte Übersicht für Gemüse, Kräuter und Nutzpflanzen.
  - Wichtige Kennzahlen je Sorte: Voranzucht (Fensterbank/Gewächshaus), Direktsaat, Saattiefe, Pflanzabstand, Keimdauer und Erntezeitraum.
- **Interaktiver Anzuchtkalender:**
  - Schnelle Filterung und Monatsansichten für alle anstehenden Arbeiten.
- **Druck- & PDF-Export:**
  - Integrierte Funktion zum direkten Ausdrucken oder Speichern als PDF mit nur einem Klick.
  - Speziell optimiertes Druck-Styling (@media print): Navigations- und Bedienelemente werden automatisch ausgeblendet, sodass nur saubere Tabellen und Listen auf Papier oder im PDF landen.
- **Individuelles Design:**
  - Personalisierte Oberfläche („Ramonas Garten Anzucht“) mit klar lesbarer Typografie und intuitiver Benutzerführung.
- **100 % Offline-Fähig:**
  - Standalone-Lösung: Läuft direkt im Browser ohne Webserver, Cloud-Zwang oder externe Abhängigkeiten.
- **Responsive Layout:**
  - Saubere Darstellung auf dem Desktop, Tablet oder unterwegs auf dem Smartphone.

---

## 🛠️ Technische Details

- **Frontend:** HTML5, CSS3 (inkl. Print-Stylesheets)
- **Logik:** Reines JavaScript (Vanilla JS – window.print()-Integration)
- **Kompatibilität:** Getestet und lauffähig in allen modernen Browsern (Chrome, Safari, Firefox, Edge)

---

## 🚀 Schnellstart

1. Das Projektverzeichnis öffnen.
2. Die Datei index.html per Doppelklick im Standard-Webbrowser starten.
3. Über den Button „Drucken / PDF erstellen“ den aktuellen Plan als PDF archivieren oder direkt für das Beet ausdrucken.

---

## 📂 Projektstruktur

| Datei | Beschreibung |
| :--- | :--- |
| index.html | Gesamte Anwendung (Struktur, Styles & Anwendungslogik) |
| README.md | Projektdokumentation & Anleitung |

---

## 🏗️ Projektentwicklung & Evolution

Die Entwicklung der Anwendung erfolgte iterativ mit dem Ziel, ein absolut praxistaugliches, ausfallsicheres und unkompliziertes Werkzeug für den Gartenalltag bereitzustellen.

### Entstehungsphasen:

1. **Konzeption & Anforderungsanalyse:**
   - Definition des Bedarfs an einer zentralen Übersicht statt unübersichtlicher Notizen und Samentütchen.
   - Festlegung auf eine schlanke, frameworkfreie Standalone-Architektur (Offline-First).

2. **Datenmodellierung & UI-Design:**
   - Zusammenstellung der botanischen Eckdaten (Saattiefen, Keimzeiten, Abstände, Voranzucht- und Erntefenster).
   - Entwurf eines aufgeräumten, benutzerfreundlichen Interfaces mit individuellem Header-Branding („Ramonas Garten Anzucht“).

3. **Interaktive Logik & Filterung:**
   - Implementierung performanter Filter- und Suchmechanismen in Vanilla JavaScript für schnellen Zugriff auf Monats- und Sortenansichten.

4. **Praxis-Optimierung (Druck- & PDF-Engine):**
   - Integration eines dedizierten Druck-Buttons zur Übergabe an die systemeigene Druck-/PDF-Pipeline (window.print()).
   - Implementierung maßgeschneiderter @media print-Regeln zur Bereinigung der Ansicht für Ausdrucke und laminierte Garten-Klemmbretter.

---

## 👨‍💻 Projektbeteiligte

- **Idee, Konzept & Entwicklung:** Marcel Kometz
- **Widmung:** Entwickelt für Ramona zur perfekten Organisation der jährlichen Garten- und Beetanzucht.
