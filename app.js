/* RoboLingo - navigation + Hello! mini lesson */
(() => {
'use strict';
const $=id=>document.getElementById(id);
const homeView=$('homeView'),lessonsView=$('lessonsView'),lessonDetail=$('lessonDetail'),lessonPlay=$('lessonPlay');
const backHome=$('backHome'),toast=$('toast'),detailTitle=$('detailTitle'),detailText=$('detailText'),wordEmoji=$('wordEmoji'),wordEnglish=$('wordEnglish'),wordTurkish=$('wordTurkish');
if(!homeView||!lessonsView||!lessonDetail||!lessonPlay)return;

const lessonData={
'Hello!':{emoji:'👋',word:'Hello',tr:'Merhaba',count:7,text:'İlk İngilizce kelimelerini ve selamlaşmaları öğrenmeye hazır mısın?'},
'Numbers':{emoji:'🔢',word:'One',tr:'Bir',count:10,text:'Sayıları İngilizce söylemeyi eğlenceli şekilde öğrenelim!'},
'Animals':{emoji:'🐱',word:'Cat',tr:'Kedi',count:10,text:'Sevimli hayvanların İngilizce isimlerini birlikte keşfedelim!'},
'Colors':{emoji:'🎨',word:'Red',tr:'Kırmızı',count:8,text:'Renkleri İngilizce söylemeyi öğrenelim!'},
'Food':{emoji:'🍎',word:'Apple',tr:'Elma',count:8,text:'En sevdiğimiz yiyeceklerin İngilizce isimlerini öğrenelim!'},
'Family':{emoji:'👨‍👩‍👧',word:'Family',tr:'Aile',count:8,text:'Aile üyelerini İngilizce tanımaya başlayalım!'}
};
let currentView='home',currentLesson=null,stars=0,answeredMatch=false,answeredQuestion=false;

function active(s){document.querySelectorAll('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.section===s))}
function top(){window.scrollTo({top:0,behavior:'smooth'})}
function view(v,s='Ana Sayfa'){
[homeView,lessonsView,lessonDetail,lessonPlay].forEach(e=>e.classList.add('hidden'));
if(v==='home')homeView.classList.remove('hidden');
if(v==='lessons')lessonsView.classList.remove('hidden');
if(v==='detail')lessonDetail.classList.remove('hidden');
if(v==='play')lessonPlay.classList.remove('hidden');
currentView=v;active(s);if(backHome)backHome.style.display=v==='home'?'none':'block';top();
}
function lessons(){view('lessons','Dersler')}
function openLesson(name){
const d=lessonData[name]||lessonData['Hello!'];currentLesson=name||'Hello!';
if(detailTitle)detailTitle.textContent=currentLesson;
if(detailText)detailText.textContent=d.text;
if(wordEmoji)wordEmoji.textContent=d.emoji;
if(wordEnglish)wordEnglish.textContent=d.word;
if(wordTurkish)wordTurkish.textContent=d.tr;
view('detail','Dersler');
}
function speak(t){
if('speechSynthesis'in window&&t){const u=new SpeechSynthesisUtterance(t);u.lang='en-US';u.rate=.82;speechSynthesis.cancel();speechSynthesis.speak(u)}
else toastMsg('Seslendirme bu cihazda desteklenmiyor');
}
function toastMsg(m){if(!toast)return;toast.textContent=m;toast.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>toast.classList.remove('show'),1800)}
function startHello(){
if(currentLesson!=='Hello!'){toastMsg('Bu mini ders yakında geliyor 🤖');return}
stars=0;answeredMatch=false;answeredQuestion=false;
$('playStars').textContent='0';$('playStep').textContent='1';$('lessonProgressBar').style.width='14%';
$('sayHint').textContent='Önce kelimeyi dinle, sonra sen söyle!';
['listenStep','repeatStep','matchStep','questionStep','completeStep'].forEach(id=>$(id).classList.add('hidden'));
$('listenStep').classList.remove('hidden');view('play','Dersler');
}
function step(n){
['listenStep','repeatStep','matchStep','questionStep','completeStep'].forEach(id=>$(id).classList.add('hidden'));
const ids=['','listenStep','repeatStep','matchStep','questionStep','completeStep'];
$(ids[Math.min(n,5)]).classList.remove('hidden');
$('playStep').textContent=String(Math.min(n,7));$('lessonProgressBar').style.width=Math.min(n*14.28,100)+'%';
if(n===2)$('sayHint').textContent='Şimdi sen söyle! Sesli olarak tekrar et.';
if(n===3)$('sayHint').textContent='Doğru resmi seçerek ilerle!';
if(n===4)$('sayHint').textContent='Bildiğini seç ve yıldızını kazan!';
top();
}
function back(){
if(currentView==='play')return view('detail','Dersler');
if(currentView==='detail')return lessons();
if(currentView==='lessons')return view('home','Ana Sayfa');
view('home','Ana Sayfa');
}

document.addEventListener('click',e=>{
const b=e.target.closest('button');if(!b)return;
const s=b.dataset.section;
if(s==='Dersler'){e.preventDefault();lessons();return}
if(s==='Ana Sayfa'){e.preventDefault();view('home','Ana Sayfa');return}
if(b.id==='startBtn'||b.id==='allLessons'){e.preventDefault();lessons();return}
if(b.dataset.lesson){e.preventDefault();openLesson(b.dataset.lesson);return}
if(b.id==='backHome'){e.preventDefault();back();return}
if(b.id==='speakWord'){e.preventDefault();speak(wordEnglish?.textContent||'');return}
if(b.id==='beginLesson'){e.preventDefault();startHello();return}
if(b.id==='backToDetail'){e.preventDefault();view('detail','Dersler');return}
if(b.id==='playSpeak'||b.id==='repeatSpeak'){e.preventDefault();speak('Hello');return}
if(b.id==='afterListen'){e.preventDefault();step(2);return}
if(b.id==='afterRepeat'){e.preventDefault();step(3);return}
if(b.classList.contains('choice')){
e.preventDefault();
if(b.dataset.correct==='true'){
if(!answeredMatch)stars++;answeredMatch=true;
document.querySelectorAll('#matchChoices .choice').forEach(x=>x.classList.remove('selected-correct','selected-wrong'));
b.classList.add('selected-correct');$('matchFeedback').textContent='Doğru! 🎉 ⭐';$('matchFeedback').classList.add('correct');
setTimeout(()=>step(4),600);
}else{b.classList.add('selected-wrong');$('matchFeedback').textContent='Bir daha düşünelim 🤖';$('matchFeedback').classList.remove('correct')}
return;
}
if(b.classList.contains('answer')){
e.preventDefault();
if(b.dataset.correct==='true'){
if(!answeredQuestion)stars++;answeredQuestion=true;
document.querySelectorAll('#answerChoices .answer').forEach(x=>x.classList.remove('selected-correct','selected-wrong'));
b.classList.add('selected-correct');$('questionFeedback').textContent='Doğru! 🎉 ⭐';$('questionFeedback').classList.add('correct');$('playStars').textContent=stars;
setTimeout(()=>{$('earnedStars').textContent=stars;step(5)},600);
}else{b.classList.add('selected-wrong');$('questionFeedback').textContent='Bir daha düşünelim 🤖';$('questionFeedback').classList.remove('correct')}
return;
}
if(b.id==='finishLesson'){e.preventDefault();lessons();toastMsg('Hello! tamamlandı! ⭐');return}
if(s&&s!=='Dersler'&&s!=='Ana Sayfa'){e.preventDefault();toastMsg(s+' bölümü sırada 🤖')}
});
window.addEventListener('popstate',back);
view('home','Ana Sayfa');
})();