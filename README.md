# VOID Website

Kostenlose statische offizielle VOID-Seite. Sie ist absichtlich vollständig vom WPF-Launcher und vom bestehenden Backend getrennt.

## Lokal ausführen

Die Einrichtung trägt `VOID` lokal als `127.0.0.1` ein und startet im finalen Prüfschritt den beiliegenden Server auf Port 80. Im Ordner `website` kann er später mit folgendem Befehl erneut gestartet werden:

```powershell
node dev-server.js
```

Danach `http://VOID/` öffnen.

## Zentrale Konfiguration

Alle öffentlichen Integrationswerte liegen in `dist/js/config.js`:

- `discordInviteUrl`: offizieller Discord-Link
- `launcherDownloadUrl`: echter, direkter Einzeldatei-Download innerhalb der Website (`./download/VOID.exe`)
- `apiBaseUrl`, `statusEndpoint`, `serversEndpoint`: bestehende VOID-API. Die API wird nur auf dem lokalen `http://void/` angesprochen; öffentliche Besucher erhalten keinen lokalen `localhost`-Aufruf.
- `servers` und `products`: Inhalte der Server- und Store-Karten

Die Seite ruft bei Verfügbarkeit `GET /api/status` und `GET /api/servers` ab. Kann die API nicht erreicht werden, bleiben LATEGAME ARENA und SOLO sichtbar, ihr Status bleibt neutral „Unbekannt“ und es werden keine Online-Spielerdaten erfunden.

## Keine Zahlungsabwicklung

Der Store ist derzeit eine reine Informationsansicht. Er löst keine Zahlung aus und enthält weder Zahlungsanbieter noch geheime Schlüssel.

## Veröffentlichung

Die Datei `.openai/hosting.json` beschreibt eine statische Veröffentlichung des Ordners `dist`. Für spätere Aktualisierungen ist kein Launcher- oder Backend-Build erforderlich.

## GitHub Pages

Die vollständige GitHub-Pages-Automatisierung liegt in `.github/workflows/deploy-pages.yml`. Sie veröffentlicht bei jedem Push auf `main` ausschließlich `dist` und ist für die Projektadresse `https://ninoantoniogradert-ui.github.io/VOID/` vorbereitet.

Für die erstmalige öffentliche Bereitstellung muss das GitHub-Konto `ninoantoniogradert-ui` einmalig ein leeres öffentliches Repository namens `VOID` bereitstellen und den Inhalt dieses Ordners in dessen `main`-Branch pushen. Danach in GitHub unter **Settings → Pages → Build and deployment → Source** die Option **GitHub Actions** wählen. Jeder weitere Push auf `main` veröffentlicht automatisch die aktuelle Seite.
