/* Central public configuration. Change URLs here when production services are ready. */
window.VOID_CONFIG = Object.freeze({
  siteName: "VOID",
  discordInviteUrl: "https://discord.gg/QCfjCvfub6",
  // Relative path keeps the Windows installer download working both on
  // http://void/ and on GitHub Pages at /VOID/. Visitors receive a setup
  // program, not a portable launcher executable.
  launcherDownloadUrl: "./download/VOID-Setup.exe",
  launcherVersion: "1.3.13",
  // The local launcher backend is intentionally never requested by visitors
  // to the public website. On GitHub Pages the public UI stays available and
  // shows the server state as unknown until a public API is configured.
  apiBaseUrl: ["void", "localhost", "127.0.0.1"].includes(window.location.hostname) ? "http://127.0.0.1:3551" : "",
  statusEndpoint: "/api/status",
  serversEndpoint: "/api/servers",
  developmentMode: true,
  statusRefreshMs: 30000,
  servers: [
    { id: "lategame-arena", region: "EU", modeKey: "serverModeLateGame" },
    { id: "solo", region: "EU", modeKey: "serverModeSolo" }
  ],
  products: [
    { id: "green", titleKey: "productGreen", price: "5 €", benefitKeys: ["benefitStarterOne", "benefitStarterTwo", "benefitStarterThree"] },
    { id: "epic", titleKey: "productEpic", price: "10 €", featured: true, benefitKeys: ["benefitSupporterOne", "benefitSupporterTwo", "benefitSupporterThree"] },
    { id: "ultimate", titleKey: "productUltimate", price: "50 €", benefitKeys: ["benefitLegendOne", "benefitLegendTwo", "benefitLegendThree"] }
  ]
});

