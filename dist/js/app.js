(() => {
  const config = window.VOID_CONFIG;
  const translations = window.VOID_TRANSLATIONS;
  const savedLanguage = localStorage.getItem("void-site-language");
  const locale = savedLanguage || ((navigator.language || "").toLowerCase().startsWith("de") ? "de" : "en");
  let language = ["de", "en"].includes(locale) ? locale : "en";
  let statusTimer = null;

  const t = (key) => translations[language][key] || key;
  const $ = (selector, root = document) => root.querySelector(selector);

  function icon(name) {
    const paths = {
      arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
      bolt: '<path d="m13 2-9 12h7l-1 8 10-13h-7z"/>',
      discord: '<path d="M19.5 5.5A16.4 16.4 0 0 0 15.4 4l-.5 1.1a15.2 15.2 0 0 0-5.8 0L8.6 4a16.5 16.5 0 0 0-4.1 1.5C1.9 9.3 1.2 13 1.5 16.7A16.6 16.6 0 0 0 6.5 19l1.2-1.7a9.8 9.8 0 0 1-1.9-.9l.5-.4c3.6 1.7 7.7 1.7 11.3 0l.5.4c-.6.4-1.3.7-1.9.9l1.2 1.7a16.6 16.6 0 0 0 5-2.3c.4-4.4-.7-8.1-2.9-11.2ZM8.9 14.5c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm6.2 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z"/>',
      server: '<rect x="3" y="4" width="18" height="6" rx="2"/><rect x="3" y="14" width="18" height="6" rx="2"/><path d="M7 7h.01M7 17h.01M11 7h6M11 17h6"/>',
      download: '<path d="M12 3v12m0 0 4-4m-4 4-4-4M4 21h16"/>',
      check: '<path d="m5 12 4 4L19 6"/>'
    };
    return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name] || ""}</svg>`;
  }

  function renderStatic() {
    document.documentElement.lang = language;
    document.title = `VOID — ${t("heroTitle")}`;
    document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = t(node.dataset.i18n); });
    document.querySelectorAll("[data-i18n-aria]").forEach((node) => { node.setAttribute("aria-label", t(node.dataset.i18nAria)); });
    $("#language-current").textContent = language.toUpperCase();
    $("#language-menu").querySelectorAll("button").forEach((button) => button.classList.toggle("is-active", button.dataset.lang === language));
    renderServers();
    renderProducts();
  }

  function renderServers(apiServers = null, apiStatus = null) {
    const cards = $("#server-cards");
    const source = Array.isArray(apiServers) && apiServers.length ? apiServers : config.servers;
    cards.innerHTML = source.map((server, index) => {
      const apiServer = Array.isArray(apiServers) ? apiServers.find((item) => item.id === server.id) || server : server;
      const isOnline = apiStatus === "ONLINE" || apiServer.status === "ONLINE" || apiServer.state === "ONLINE";
      const isOffline = apiStatus && apiStatus !== "ONLINE";
      const state = isOnline ? "online" : isOffline ? "offline" : "unknown";
      const stateText = state === "online" ? t("serverOnline") : state === "offline" ? t("serverOffline") : t("serverUnknown");
      const players = Number.isFinite(Number(apiServer.playerCount)) ? `${apiServer.playerCount}${apiServer.maxPlayers ? ` / ${apiServer.maxPlayers}` : ""}` : t("unknown");
      const name = server.modeKey ? t(server.modeKey) : apiServer.name || `VOID ${index + 1}`;
      // These cards are re-rendered on every status refresh.  Marking them
      // visible at creation prevents the reveal animation from leaving the
      // refreshed cards transparent after the IntersectionObserver has run.
      return `<article class="server-card reveal is-visible" style="--delay:${index * 90}ms"><div class="server-card__top"><span class="status-dot status-dot--${state}"></span><span>${stateText}</span></div><div class="server-card__icon">${icon("server")}</div><h3>${name}</h3><dl><div><dt>${t("region")}</dt><dd>${apiServer.region || server.region || "EU"}</dd></div><div><dt>${t("players")}</dt><dd>${players}</dd></div></dl></article>`;
    }).join("");
  }

  function renderProducts() {
    $("#product-cards").innerHTML = config.products.map((product, index) => `<article class="product-card reveal" style="--delay:${index * 80}ms"><h3>${t(product.titleKey)}</h3><p class="product-card__price">${product.price}</p><ul>${product.benefitKeys.map((key) => `<li>${icon("check")}<span>${t(key)}</span></li>`).join("")}</ul></article>`).join("");
  }

  function updateStatusUi(state, detail) {
    const badge = $("#api-status");
    badge.className = `api-status api-status--${state}`;
    badge.querySelector("strong").textContent = state === "online" ? t("statusLive") : state === "checking" ? t("statusChecking") : t("statusUnknown");
    $("#status-detail").textContent = detail || t("statusApiOffline");
  }

  async function refreshStatus() {
    if (!config.apiBaseUrl) {
      updateStatusUi("unknown", t("statusApiOffline"));
      renderServers(null, null);
      return;
    }
    updateStatusUi("checking", t("statusChecking"));
    const timeout = AbortSignal.timeout ? AbortSignal.timeout(5000) : undefined;
    try {
      const statusUrl = `${config.apiBaseUrl}${config.statusEndpoint}`;
      const serverUrl = `${config.apiBaseUrl}${config.serversEndpoint}`;
      const [statusResult, serversResult] = await Promise.all([fetch(statusUrl, { signal: timeout }), fetch(serverUrl, { signal: timeout })]);
      if (!statusResult.ok || !serversResult.ok) throw new Error("api-unavailable");
      const statusPayload = await statusResult.json();
      const serverPayload = await serversResult.json();
      const status = statusPayload.status || statusPayload.server?.status || "UNKNOWN";
      const servers = Array.isArray(serverPayload) ? serverPayload : serverPayload.servers;
      const state = status === "ONLINE" ? "online" : "offline";
      updateStatusUi(state, `${t("apiLabel")}: ${status}`);
      renderServers(servers, status);
    } catch (_) {
      updateStatusUi("unknown", t("statusApiOffline"));
      renderServers(null, null);
    }
  }

  function showNotice(message) {
    const notice = $("#notice");
    notice.textContent = message;
    notice.hidden = false;
    window.clearTimeout(showNotice.timer);
    showNotice.timer = window.setTimeout(() => { notice.hidden = true; }, 6000);
  }

  function setLanguage(nextLanguage) {
    language = nextLanguage;
    localStorage.setItem("void-site-language", language);
    renderStatic();
    refreshStatus();
  }

  function setNavOpen(isOpen) {
    $("#site-nav").classList.toggle("is-open", isOpen);
    $("#nav-toggle").setAttribute("aria-expanded", String(isOpen));
  }

  document.addEventListener("click", (event) => {
    const languageButton = event.target.closest("[data-lang]");
    if (languageButton) { setLanguage(languageButton.dataset.lang); return; }
    if (event.target.closest("#language-toggle")) { $("#language-menu").classList.toggle("is-open"); return; }
    if (event.target.closest("#nav-toggle")) { setNavOpen(!$("#site-nav").classList.contains("is-open")); return; }
    if (event.target.closest("[data-discord]")) { window.open(config.discordInviteUrl, "_blank", "noopener,noreferrer"); return; }
    if (event.target.closest("[data-download]")) {
      window.location.assign(config.launcherDownloadUrl);
      return;
    }
    if (event.target.closest("[data-store]")) { showNotice(t("storeNote")); return; }
    const navLink = event.target.closest(".site-nav a");
    if (navLink) setNavOpen(false);
    if (!event.target.closest(".language-picker")) $("#language-menu").classList.remove("is-open");
  });

  document.addEventListener("DOMContentLoaded", () => {
    $(".year").textContent = new Date().getFullYear();
    renderStatic();
    refreshStatus();
    statusTimer = window.setInterval(refreshStatus, config.statusRefreshMs);
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("is-visible"); }), { threshold: 0.1 });
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
  });

  window.addEventListener("beforeunload", () => { if (statusTimer) window.clearInterval(statusTimer); });
})();

