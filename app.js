/* RoboLingo - navigation and lesson screens
   Ana ekran tasarimi korunur. Bu dosya sadece ekran gecislerini yonetir.
*/
(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const homeView = $('homeView');
  const lessonsView = $('lessonsView');
  const lessonDetail = $('lessonDetail');
  const backHome = $('backHome');
  const toast = $('toast');

  const detailTitle = $('detailTitle');
  const detailText = $('detailText');
  const wordEmoji = $('wordEmoji');
  const wordEnglish = $('wordEnglish');

  if (!homeView || !lessonsView || !lessonDetail) return;

  const lessonData = {
    'Hello!': { emoji: '👋', word: 'Hello', tr: 'Merhaba', count: 7, text: 'İlk İngilizce kelimelerini ve selamlaşmaları öğrenmeye hazır mısın?' },
    'Numbers': { emoji: '🔢', word: 'One', tr: 'Bir', count: 10, text: 'Sayıları İngilizce söylemeyi eğlenceli şekilde öğrenelim!' },
    'Animals': { emoji: '🐱', word: 'Cat', tr: 'Kedi', count: 10, text: 'Sevimli hayvanların İngilizce isimlerini birlikte keşfedelim!' },
    'Colors': { emoji: '🎨', word: 'Red', tr: 'Kırmızı', count: 8, text: 'Renkleri İngilizce söylemeyi öğrenelim!' },
    'Food': { emoji: '🍎', word: 'Apple', tr: 'Elma', count: 8, text: 'En sevdiğimiz yiyeceklerin İngilizce isimlerini öğrenelim!' },
    'Family': { emoji: '👨‍👩‍👧', word: 'Family', tr: 'Aile', count: 8, text: 'Aile üyelerini İngilizce tanımaya başlayalım!' }
  };

  let currentView = 'home';
  let previousView = 'home';
  let currentLesson = null;

  function setActive(section) {
    document.querySelectorAll('.bottom-nav button').forEach((button) => {
      button.classList.toggle('active', button.dataset.section === section);
    });
  }

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showView(view, activeSection = 'Ana Sayfa', remember = true) {
    if (remember && currentView !== view) previousView = currentView;

    [homeView, lessonsView, lessonDetail].forEach((el) => el.classList.add('hidden'));

    if (view === 'home') homeView.classList.remove('hidden');
    if (view === 'lessons') lessonsView.classList.remove('hidden');
    if (view === 'detail') lessonDetail.classList.remove('hidden');

    currentView = view;
    setActive(activeSection);
    if (backHome) backHome.style.display = view === 'home' ? 'none' : 'block';
    scrollTop();
  }

  function openLessons() {
    showView('lessons', 'Dersler');
  }

  function openLesson(name) {
    const data = lessonData[name] || lessonData['Hello!'];
    currentLesson = name || 'Hello!';

    if (detailTitle) detailTitle.textContent = currentLesson;
    if (detailText) detailText.textContent = data.text;
    if (wordEmoji) wordEmoji.textContent = data.emoji;
    if (wordEnglish) wordEnglish.textContent = data.word;

    showView('detail', 'Dersler');
  }

  function goBack() {
    // Detay -> Dersler, Dersler -> Ana Sayfa.
    if (currentView === 'detail') {
      showView('lessons', 'Dersler', false);
      return;
    }
    if (currentView === 'lessons') {
      showView('home', 'Ana Sayfa', false);
      return;
    }
    showView('home', 'Ana Sayfa', false);
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 1800);
  }

  // Tek bir event sistemi: dinamik/HTML icindeki butonlar da garanti calisir.
  document.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;

    // Ana ekran ve alt menudeki Dersler butonlari
    const section = button.dataset.section;
    if (section === 'Dersler') {
      event.preventDefault();
      openLessons();
      return;
    }

    if (section === 'Ana Sayfa') {
      event.preventDefault();
      showView('home', 'Ana Sayfa', false);
      return;
    }

    // Ana ekrandaki Let's Learn ve tum dersler
    if (button.id === 'startBtn' || button.id === 'allLessons') {
      event.preventDefault();
      openLessons();
      return;
    }

    // Tum ders kartlari
    if (button.dataset.lesson) {
      event.preventDefault();
      openLesson(button.dataset.lesson);
      return;
    }

    if (button.id === 'backHome') {
      event.preventDefault();
      goBack();
      return;
    }

    if (button.id === 'speakWord') {
      event.preventDefault();
      const text = wordEnglish ? wordEnglish.textContent : '';
      if ('speechSynthesis' in window && text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.82;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      } else {
        showToast('Seslendirme bu cihazda desteklenmiyor');
      }
      return;
    }

    if (button.id === 'beginLesson') {
      event.preventDefault();
      showToast(`${currentLesson || 'Ders'} dersi hazırlanıyor 🚀`);
      return;
    }

    // Henüz yapilmayan ana menu bolumleri
    if (section && section !== 'Dersler' && section !== 'Ana Sayfa') {
      event.preventDefault();
      showToast(`${section} bölümü sırada 🤖`);
    }
  });

  // Android geri tusu / tarayici geri tusu icin de dogru ekran gecisi.
  window.addEventListener('popstate', () => {
    if (currentView === 'detail') {
      showView('lessons', 'Dersler', false);
    } else if (currentView === 'lessons') {
      showView('home', 'Ana Sayfa', false);
    } else {
      showView('home', 'Ana Sayfa', false);
    }
  });

  // Baslangic: ana ekran.
  showView('home', 'Ana Sayfa', false);
})();
