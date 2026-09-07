(() => {
  const toast = document.getElementById("toast");
  const starsEl = document.getElementById("stars");
  const streakEl = document.getElementById("streak");

  let stars = Number(localStorage.getItem("robo_stars") ?? 12);
  let streak = Number(localStorage.getItem("robo_streak") ?? 5);

  starsEl.textContent = stars;
  streakEl.textContent = streak;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 1800);
  }

  function activateSection(section) {
    document.querySelectorAll(".bottom-nav button").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.section === section);
    });

    if (section === "Ana Sayfa") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    showToast(`${section} bölümü yakında! 🤖`);
  }

  document.querySelectorAll("[data-section]").forEach(button => {
    button.addEventListener("click", () => {
      activateSection(button.dataset.section);
    });
  });

  document.getElementById("startBtn").addEventListener("click", () => {
    stars += 1;
    starsEl.textContent = stars;
    localStorage.setItem("robo_stars", stars);
    showToast("Harika! İlk derse başlayalım 🚀");
  });

  document.getElementById("allLessons").addEventListener("click", () => {
    showToast("Tüm dersler yakında burada! 📚");
  });

  document.getElementById("challengeBtn").addEventListener("click", () => {
    stars += 2;
    starsEl.textContent = stars;
    localStorage.setItem("robo_stars", stars);
    showToast("Günlük meydan okuma tamamlandı! ⭐");
  });

  document.querySelectorAll(".lesson").forEach(lesson => {
    lesson.addEventListener("click", () => {
      showToast(`${lesson.dataset.lesson} dersi seçildi 📚`);
    });
  });
})();
