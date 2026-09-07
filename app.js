const toast = document.getElementById('toast');

function showToast(message){
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(()=>toast.classList.remove('show'),1800);
}

document.getElementById('startBtn').addEventListener('click', ()=>{
  showToast('Harika! İlk dersimiz: Hello! 👋');
});

document.querySelectorAll('[data-section]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.bottom-nav button').forEach(x=>x.classList.remove('active'));
    const nav = [...document.querySelectorAll('.bottom-nav button')]
      .find(x=>x.dataset.section === btn.dataset.section);
    if(nav) nav.classList.add('active');
    showToast(`${btn.dataset.section} yakında! 🤖`);
  });
});

document.querySelectorAll('.lesson').forEach(lesson=>{
  lesson.addEventListener('click', ()=>{
    showToast(`${lesson.querySelector('b').textContent} dersi seçildi! ⭐`);
  });
});

document.getElementById('allLessons').addEventListener('click', ()=>showToast('Tüm dersler hazırlanıyor! 📚'));
document.getElementById('challengeBtn').addEventListener('click', ()=>showToast('Günlük görev: 5 yeni kelime öğren! 🚀'));
