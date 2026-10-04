/* Central public configuration. Change URLs here when production services are ready. */
window.VOID_CONFIG = Object.freeze({
  siteName: "VOID",
  discordInviteUrl: "https://discord.gg/QCfjCvfub6",
  // Relative path keeps the Windows installer download working both on
  // http://void/ and on GitHub Pages at /VOID/. Visitors receive a setup
  // program, not a portable launcher executable.
  launcherDownloadUrl: "./download/VOID-Setup.exe",
  launcherVersion: "2.00",
  // GitHub Pages uses the public Render API. No visitor-facing request uses
  // a machine-specific address.
  apiBaseUrl: "https://void-backend-nitn.onrender.com",
  statusEndpoint: "/api/status",
  serversEndpoint: "/api/servers",
  developmentMode: false,
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
