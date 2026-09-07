(() => {
  const toast = document.getElementById("toast");
  const starsEl = document.getElementById("stars");
  const streakEl = document.getElementById("streak");
  let stars = Number(localStorage.getItem("robo_stars") ?? 12);
  let streak = Number(localStorage.getItem("robo_streak") ?? 5);
  starsEl.textContent = stars; streakEl.textContent = streak;

  const screens = {
    "Ana Sayfa":"homeScreen","Dersler":"lessonsScreen","Konuş":"speakScreen",
    "Oyunlar":"gamesScreen","Başarılar":"achievementsScreen","Ayarlar":"settingsScreen"
  };

  function showToast(message){
    toast.textContent=message; toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer=setTimeout(()=>toast.classList.remove("show"),1800);
  }
  function activateSection(section){
    document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
    const target=document.getElementById(screens[section]||"homeScreen");
    if(target) target.classList.add("active");
    document.querySelectorAll(".bottom-nav button").forEach(b=>{
      b.classList.toggle("active",b.dataset.section===section);
    });
    window.scrollTo({top:0,behavior:"smooth"});
  }

  document.querySelectorAll("[data-section]").forEach(b=>{
    b.addEventListener("click",()=>activateSection(b.dataset.section));
  });
  document.getElementById("startBtn").addEventListener("click",()=>activateSection("Dersler"));
  document.getElementById("allLessons").addEventListener("click",()=>activateSection("Dersler"));
  document.querySelectorAll(".lesson").forEach(b=>{
    b.addEventListener("click",()=>{activateSection("Dersler");showToast(`${b.dataset.lesson} dersine başlayalım 📚`);});
  });
  document.querySelectorAll(".course-card").forEach(b=>{
    b.addEventListener("click",()=>showToast(`${b.dataset.course} dersi yakında başlıyor 🚀`));
  });
})();