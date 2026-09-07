(() => {
  "use strict";

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(() => {
    const app = document.querySelector(".app");
    const nav = document.querySelector(".bottom-nav");
    if (!app || !nav) return;

    const toast = document.getElementById("toast");

    function showToast(message) {
      if (!toast) return;
      toast.textContent = message;
      toast.classList.add("show");
      clearTimeout(showToast.timer);
      showToast.timer = setTimeout(() => toast.classList.remove("show"), 1800);
    }

    // Dersler ekranı yoksa kendimiz oluşturuyoruz.
    // Böylece eski index.html ile bile "Dersler" butonu boş/mavi ekran bırakmaz.
    let lessons = document.getElementById("lessonsScreen");
    if (!lessons) {
      lessons = document.createElement("section");
      lessons.id = "lessonsScreen";
      lessons.className = "lessons-page";
      lessons.innerHTML = `
        <header style="display:flex;align-items:center;gap:10px;min-height:64px">
          <button id="lessonBack" style="width:42px;height:42px;border:0;border-radius:14px;background:#fff;color:#173f72;font-size:34px;line-height:1">‹</button>
          <div>
            <h2 style="font-size:28px;font-weight:500;color:#173f72">Dersler 📚</h2>
            <p style="font-size:13px;color:#47739e;margin-top:3px">Robo ile İngilizce öğren!</p>
          </div>
          <div style="margin-left:auto;font-size:34px">🤖</div>
        </header>

        <div style="margin-top:12px;padding:17px 18px;border-radius:24px;background:rgba(255,255,255,.94);display:flex;align-items:center;justify-content:space-between;box-shadow:0 6px 15px rgba(52,115,153,.08)">
          <div style="display:flex;flex-direction:column;gap:5px">
            <b style="font-size:18px;color:#173f72">Bugün ne öğrenmek istersin?</b>
            <span style="font-size:13px;color:#6f8297">Bir ders seç ve başlayalım 🚀</span>
          </div>
          <span style="font-size:35px">⭐</span>
        </div>

        <div style="margin-top:15px;display:grid;gap:11px">
          ${[
            ["👋","Hello!","Selamlaşmalar • 7 ders","#8050e8"],
            ["🔢","Numbers","Sayılar • 10 ders","#1687f8"],
            ["🐱","Animals","Hayvanlar • 10 ders","#16c979"],
            ["🎨","Colors","Renkler • 8 ders","#ffa313"],
            ["🍎","Food","Yiyecekler • 8 ders","#f34c6c"]
          ].map(([icon,title,sub,bg]) => `
            <button class="dynamic-course" data-course="${title}" style="min-height:82px;border:0;border-radius:23px;padding:12px 14px;background:${bg};color:#fff;display:grid;grid-template-columns:58px 1fr 28px;align-items:center;text-align:left;box-shadow:0 6px 0 rgba(55,91,113,.16)">
              <span style="font-size:35px;text-align:center">${icon}</span>
              <span style="display:flex;flex-direction:column;gap:4px">
                <b style="font-size:20px;font-weight:500">${title}</b>
                <small style="font-size:12px">${sub}</small>
              </span>
              <strong style="font-size:31px;font-weight:300;text-align:right">›</strong>
            </button>
          `).join("")}
        </div>
      `;
      app.insertBefore(lessons, nav);
    }

    const screenIds = new Set([
      "lessonsScreen", "speakScreen", "gamesScreen",
      "achievementsScreen", "settingsScreen"
    ]);

    function showHome() {
      Array.from(app.children).forEach(el => {
        if (el === nav || el.id === "toast" || screenIds.has(el.id)) return;
        el.style.display = "";
      });
      screenIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.setProperty("display", "none", "important");
      });
    }

    function showLessons() {
      Array.from(app.children).forEach(el => {
        if (el === nav || el.id === "toast" || el.id === "lessonsScreen") return;
        el.style.setProperty("display", "none", "important");
      });
      lessons.style.setProperty("display", "block", "important");
      window.scrollTo(0, 0);
    }

    function activate(section) {
      if (section === "Dersler") {
        showLessons();
      } else if (section === "Ana Sayfa") {
        showHome();
        window.scrollTo(0, 0);
      } else {
        // Diğer ekranlar henüz hazırlanmadıysa ana ekranı kaybetmiyoruz.
        showToast(`${section} ekranını sıradaki adımda yapıyoruz 🚀`);
        showHome();
        return;
      }

      nav.querySelectorAll("button").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.section === section);
      });
    }

    nav.querySelectorAll("button[data-section]").forEach(btn => {
      btn.addEventListener("click", () => activate(btn.dataset.section));
    });

    const start = document.getElementById("startBtn");
    if (start) start.addEventListener("click", () => activate("Dersler"));

    const all = document.getElementById("allLessons");
    if (all) all.addEventListener("click", () => activate("Dersler"));

    document.querySelectorAll(".lesson").forEach(btn => {
      btn.addEventListener("click", () => activate("Dersler"));
    });

    document.getElementById("lessonBack")?.addEventListener("click", () => activate("Ana Sayfa"));

    document.querySelectorAll(".dynamic-course").forEach(btn => {
      btn.addEventListener("click", () => showToast(`${btn.dataset.course} dersi yakında başlıyor 📚`));
    });

    // Başlangıçta ana ekran görünür.
    showHome();
  });
})();