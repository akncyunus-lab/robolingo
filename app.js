(() => {
  const app = document.querySelector('.app');
  const nav = document.querySelector('.bottom-nav');
  const toast = document.getElementById('toast');
  if (!app || !nav) return;

  const homeMarkup = app.innerHTML;
  let currentPage = 'home';

  const lessons = [
    { icon:'👋', title:'Hello!', count:7, subtitle:'Selamlaşma ve tanışma' },
    { icon:'🔢', title:'Numbers', count:10, subtitle:'Sayıları öğren' },
    { icon:'🐱', title:'Animals', count:10, subtitle:'Hayvanları öğren' },
    { icon:'🎨', title:'Colors', count:8, subtitle:'Renkleri öğren' },
    { icon:'🍎', title:'Food', count:8, subtitle:'Yiyecekleri öğren' }
  ];

  function showToast(message){
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(window.__roboToast);
    window.__roboToast = setTimeout(() => toast.classList.remove('show'), 1600);
  }

  function setActive(section){
    nav.querySelectorAll('button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.section === section);
    });
  }

  function pageShell(title, subtitle, content){
    return `
      <section class="robo-page">
        <div class="robo-page-head">
          <button class="robo-back" id="pageBack" aria-label="Geri">‹</button>
          <div><h2>${title}</h2><p>${subtitle}</p></div>
        </div>
        ${content}
      </section>`;
  }

  function renderLessons(){
    currentPage = 'lessons';
    setActive('Dersler');
    app.innerHTML = pageShell('Dersler 📚', 'İngilizce öğrenmeye başlayalım!', `
      <div class="lesson-list">
        ${lessons.map((l,i) => `
          <button class="lesson-card" data-lesson="${i}">
            <span class="lesson-card-icon">${l.icon}</span>
            <span class="lesson-card-text"><b>${l.title}</b><small>${l.subtitle}</small><em>0 / ${l.count} ⭐</em></span>
            <span class="lesson-arrow">›</span>
          </button>`).join('')}
      </div>
    `);
    bindPageEvents();
  }

  function renderLessonDetail(index){
    const l = lessons[index] || lessons[0];
    currentPage = 'lesson-detail';
    setActive('Dersler');
    app.innerHTML = pageShell(`${l.icon} ${l.title}`, l.subtitle, `
      <div class="lesson-detail">
        <div class="detail-robo">🤖</div>
        <h3>Let's learn ${l.title}</h3>
        <p>Bu derste temel İngilizce kelimeleri ve ifadeleri eğlenceli şekilde öğreneceğiz.</p>
        <div class="word-preview">
          <div><b>Hello</b><span>Merhaba</span></div>
          <div><b>Hi</b><span>Selam</span></div>
          <div><b>Goodbye</b><span>Hoşça kal</span></div>
        </div>
        <button class="big-start" id="beginLesson">Derse Başla 🚀</button>
      </div>
    `);
    bindPageEvents();
    document.getElementById('beginLesson')?.addEventListener('click', () => showToast('Ders başlıyor! 🚀'));
  }

  function renderSimplePage(type){
    const data = {
      'Konuş': ['Konuşma 💬','İngilizce konuşma pratiği','Robo ile konuşma pratiği yakında burada!'],
      'Oyunlar': ['Oyunlar 🎮','Oynayarak pekiştir','Kelime oyunları ve mini görevler yakında!'],
      'Başarılar': ['Başarılar 🏆','Kazandığın rozetler','İlerledikçe yeni başarıların burada görünecek.'],
      'Ayarlar': ['Ayarlar ⚙️','RoboLingo ayarları','Dil, bildirimler ve uygulama seçenekleri yakında burada.']
    }[type];
    if (!data) return;
    currentPage = type;
    setActive(type);
    app.innerHTML = pageShell(data[0], data[1], `<div class="placeholder-page"><div class="placeholder-icon">${type==='Konuş'?'💬':type==='Oyunlar'?'🎮':type==='Başarılar'?'🏆':'⚙️'}</div><h3>${data[1]}</h3><p>${data[2]}</p></div>`);
    bindPageEvents();
  }

  function goHome(){
    currentPage = 'home';
    app.innerHTML = homeMarkup;
    setActive('Ana Sayfa');
    bindHomeEvents();
  }

  function bindPageEvents(){
    document.getElementById('pageBack')?.addEventListener('click', goHome);
    document.querySelectorAll('.lesson-card').forEach(card => {
      card.addEventListener('click', () => renderLessonDetail(Number(card.dataset.lesson)));
    });
  }

  function bindHomeEvents(){
    document.getElementById('startBtn')?.addEventListener('click', renderLessons);
    document.querySelectorAll('.feature').forEach(btn => {
      btn.addEventListener('click', () => {
        const section = btn.dataset.section;
        if (section === 'Dersler') renderLessons();
        else if (section === 'Konuşma') renderSimplePage('Konuş');
        else if (section === 'Oyunlar') renderSimplePage('Oyunlar');
        else if (section === 'İlerlemem') renderSimplePage('Başarılar');
      });
    });
    document.querySelectorAll('.lesson').forEach((lesson, index) => {
      lesson.addEventListener('click', () => renderLessonDetail(index));
    });
    document.getElementById('allLessons')?.addEventListener('click', renderLessons);
    document.getElementById('challengeBtn')?.addEventListener('click', () => showToast('Günlük görev: 5 yeni kelime öğren! 🚀'));
  }

  nav.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const section = btn.dataset.section;
      if (section === 'Ana Sayfa') goHome();
      else if (section === 'Dersler') renderLessons();
      else if (section === 'Konuş') renderSimplePage('Konuş');
      else if (section === 'Oyunlar') renderSimplePage('Oyunlar');
      else if (section === 'Başarılar') renderSimplePage('Başarılar');
      else if (section === 'Ayarlar') renderSimplePage('Ayarlar');
    });
  });

  bindHomeEvents();
})();
