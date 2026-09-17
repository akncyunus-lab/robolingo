/* RoboLingo - navigation + Hello! mini lesson + voice practice */
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
let recognition=null, listening=false;

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
function toastMsg(m){if(!toast)return;toast.textContent=m;toast.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>toast.classList.remove('show'),2200)}

function nativePlugin(name){
  try{
    const cap=window.Capacitor;
    if(!cap)return null;
    if(cap.Plugins?.[name]) return cap.Plugins[name];
    if(typeof cap.registerPlugin==='function') return cap.registerPlugin(name);
  }catch(e){ console.warn('Plugin erişimi başarısız:',name,e); }
  return null;
}

function getNativeTTS(){ return nativePlugin('TextToSpeech'); }
function getNativeSpeech(){ return nativePlugin('SpeechRecognition'); }

async function nativeTTS(text){
  const tts=getNativeTTS();
  if(!tts?.speak) return false;
  try{
    let voiceIndex;
    if(typeof tts.getSupportedVoices==='function'){
      const data=await tts.getSupportedVoices();
      const voices=Array.isArray(data?.voices)?data.voices:[];
      const idx=voices.findIndex(v=>/^en(?:-|_)/i.test(String(v?.lang||'')));
      if(idx>=0) voiceIndex=idx;
    }
    const options={text,lang:'en-US',rate:0.82,pitch:1.0,volume:1.0,queueStrategy:0};
    if(Number.isInteger(voiceIndex)) options.voice=voiceIndex;
    await tts.speak(options);
    return true;
  }catch(err){
    console.warn('Native TTS hata:',err);
    return false;
  }
}

function browserTTS(text){
return new Promise(resolve=>{
  if(!('speechSynthesis' in window)){resolve(false);return}
  const speakNow=()=>{
    try{
      const voices=speechSynthesis.getVoices();
      const voice=voices.find(v=>/^en(-|_)/i.test(v.lang))||voices.find(v=>/english/i.test(v.name));
      const u=new SpeechSynthesisUtterance(text);
      u.lang=voice?.lang||'en-US';u.rate=.82;u.pitch=1;u.volume=1;
      if(voice)u.voice=voice;
      u.onend=()=>resolve(true);u.onerror=()=>resolve(false);
      speechSynthesis.cancel();speechSynthesis.speak(u);
      setTimeout(()=>resolve(true),1200);
    }catch(e){resolve(false)}
  };
  if(speechSynthesis.getVoices().length)speakNow();
  else{
    speechSynthesis.onvoiceschanged=speakNow;
    setTimeout(speakNow,500);
  }
});
}

async function speak(text){
  const nativeOK=await nativeTTS(text);
  if(nativeOK)return;
  const browserOK=await browserTTS(text);
  if(!browserOK)toastMsg('Android TTS kullanılamadı. Telefonda Metinden sese / TTS ayarlarını kontrol et.');
}

function shuffleChoices(){
  ['matchChoices','answerChoices'].forEach(id=>{
    const box=$(id); if(!box)return;
    const items=Array.from(box.children);
    for(let i=items.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      box.appendChild(items[j]);
      items.splice(j,1);
    }
  });
}

function startHello(){
if(currentLesson!=='Hello!'){toastMsg('Bu mini ders yakında geliyor 🤖');return}
stars=0;answeredMatch=false;answeredQuestion=false;
shuffleChoices();
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
if(n===2)$('sayHint').textContent='Şimdi sen söyle! Mikrofonla konuşabilir veya kendin tekrar edebilirsin.';
if(n===3)$('sayHint').textContent='Doğru resmi seçerek ilerle!';
if(n===4)$('sayHint').textContent='Bildiğini seç ve yıldızını kazan!';
top();
}

async function listenAndCheck(){
  const sr=getNativeSpeech();
  if(sr?.start){
    try{
      const perm0=typeof sr.checkPermissions==='function' ? await sr.checkPermissions() : null;
      let state=perm0?.speechRecognition;
      if(state==='denied'){
        toastMsg('Mikrofon izni kapalı. Android Ayarlar > Uygulamalar > RoboLingo > İzinler bölümünden Mikrofonu aç.');
        return;
      }
      if(state!=='granted' && typeof sr.requestPermissions==='function'){
        const perm=await sr.requestPermissions();
        state=perm?.speechRecognition;
        if(state==='denied'){
          toastMsg('Mikrofon izni verilmedi. Android ayarlarından Mikrofon iznini aç.');
          return;
        }
      }
      if(typeof sr.available==='function'){
        const a=await sr.available();
        if(a?.available===false){
          toastMsg('Bu telefonda konuşma tanıma kullanılamıyor. Google konuşma hizmetini kontrol et.');
          return;
        }
      }

      listening=true;
      $('repeatSpeak').textContent='⏹️ Dinleniyor...';
      $('sayHint').textContent='Şimdi “Hello” de; telefon seni dinliyor 🤖';

      // Android sistem konuşma ekranını kullanıyoruz: izin + sonuç alma daha güvenilir.
      const result=await sr.start({
        language:'en-US',
        maxResults:5,
        prompt:'Say Hello',
        partialResults:false,
        popup:true
      });
      const matches=(result?.matches||[]).map(x=>String(x).trim().toLowerCase()).filter(Boolean);
      const ok=matches.some(x=>x.includes('hello')||x.replace(/[^a-z]/g,'').includes('hello'));
      if(ok){
        $('sayHint').textContent='Harika söyledin! 🎉';
        toastMsg('Harika! “Hello” doğru duyuldu ⭐');
        setTimeout(()=>step(3),700);
      }else{
        $('sayHint').textContent=`Robo “${matches[0]||'bir şey'}” duydu. Bir daha deneyelim!`;
        toastMsg('Hello kelimesini bir kez daha söyle 🤖');
      }
    }catch(err){
      console.warn('Native speech hata:',err);
      const msg=String(err?.message||err).toLowerCase();
      if(msg.includes('permission')||msg.includes('denied'))
        toastMsg('Mikrofon izni verilmedi. Android ayarlarından Mikrofon iznini aç.');
      else
        toastMsg('Konuşma tanıma başlatılamadı. Google konuşma hizmetini kontrol et.');
    }finally{
      listening=false;
      if($('repeatSpeak'))$('repeatSpeak').textContent='🎤 Hello — Konuş';
    }
    return;
  }

  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){toastMsg('Mikrofonla konuşma bu APK/WebView sürümünde desteklenmiyor.');return}
  if(listening){recognition?.stop();return}
  try{
    recognition=new SR();recognition.lang='en-US';recognition.continuous=false;recognition.interimResults=false;recognition.maxAlternatives=3;
    listening=true;$('repeatSpeak').textContent='⏹️ Dinleniyor...';
    $('sayHint').textContent='Hello de ve mikrofonu bırakınca bekle 🤖';
    recognition.onresult=e=>{
      const heard=Array.from(e.results).map(r=>r[0].transcript).join(' ').trim().toLowerCase();
      const ok=heard.includes('hello')||heard.replace(/[^a-z]/g,'').includes('hello');
      if(ok){$('sayHint').textContent='Harika söyledin! 🎉';toastMsg('Harika! “Hello” doğru duyuldu ⭐');setTimeout(()=>step(3),700)}
      else{$('sayHint').textContent=`Robo “${heard||'...'}” duydu. Bir daha deneyelim!`;toastMsg('Bir daha deneyelim 🤖')}
    };
    recognition.onerror=e=>{if(e.error==='not-allowed'||e.error==='service-not-allowed')toastMsg('Mikrofon izni verilmedi. Android ayarlarından mikrofon iznini aç.');else toastMsg('Mikrofon dinleme başlatılamadı.')};
    recognition.onend=()=>{listening=false;if($('repeatSpeak'))$('repeatSpeak').textContent='🎤 Hello — Konuş'};
    recognition.start();
  }catch(e){listening=false;$('repeatSpeak').textContent='🎤 Hello — Konuş';toastMsg('Mikrofon başlatılamadı.')}
}
function back(){
if(currentView==='play'){if(listening)recognition?.stop();return view('detail','Dersler')}
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
if(b.id==='playSpeak'){e.preventDefault();speak('Hello');return}
if(b.id==='afterListen'){e.preventDefault();step(2);return}
if(b.id==='repeatSpeak'){e.preventDefault();listenAndCheck();return}
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