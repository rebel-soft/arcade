// Rebelsoft Arcade 大廳 — 讀 games.json 產生遊戲卡片。零框架、零外部請求。
(async function () {
  const grid = document.getElementById("games");
  let data;
  try {
    const res = await fetch("games.json", { cache: "no-cache" });
    data = await res.json();
  } catch (err) {
    grid.innerHTML = '<p class="hint">遊戲清單載入失敗，請稍後再試。</p>';
    return;
  }

  const frag = document.createDocumentFragment();
  for (const g of data.games) {
    const playable = g.status === "playable";
    const card = document.createElement(playable ? "a" : "div");
    card.className = "game-card" + (playable ? "" : " disabled");
    if (playable) card.href = g.path;
    card.innerHTML =
      '<span class="status-chip' + (playable ? " playable" : "") + '">' +
      (playable ? "可以玩" : "施工中") +
      "</span><h2></h2><p class=\"tagline\"></p>";
    card.querySelector("h2").textContent = g.title;
    card.querySelector(".tagline").textContent = g.tagline || "";
    frag.appendChild(card);
  }
  grid.replaceChildren(frag);

  // publish 時若有 build_info.json 就顯示建置版本（沒有也不報錯）
  try {
    const res = await fetch("build_info.json", { cache: "no-cache" });
    if (res.ok) {
      const info = await res.json();
      document.getElementById("build-info").textContent =
        "build " + (info.source_short_sha || "?") + " · " + (info.built_at || "");
    }
  } catch (_) { /* 靜默：本機開發時沒有 build_info.json 是正常的 */ }
})();
