RoboLingo v6 - Ses + Mikrofon + Soru FIX

Bu sürümde:
- Android native TTS daha sağlam şekilde çağrılır.
- İngilizce destekleyen TTS sesi varsa otomatik seçilir.
- TTS için Capacitor 7 uyumlu @capacitor-community/text-to-speech 6.1.0 kullanılır.
- Mikrofon izni kontrol edilir ve gerekiyorsa istenir.
- Konuşma tanıma için Android sistem konuşma ekranı kullanılır (popup=true).
- Hello sonucu alınır ve doğruysa 3. adıma geçer.
- Cevap seçenekleri ders başında karıştırılır; doğru cevap her zaman ilk sırada görünmez.
- Soru/cevaplarda başlangıçta hiçbir seçenek seçili değildir.
- Ana ekran tasarımı, Robo görseli ve workflow değiştirilmemiştir.

KULLANIM:
1) Bu ZIP içindeki dosyaları GitHub repo kök dizinine kopyala.
2) assets klasörüne dokunma.
3) .github/workflows/build-apk.yml dosyasına dokunma.
4) GitHub Actions ile yeni APK oluştur.
5) APK'yı kurup önce Dersler > Hello! > Derse Başla > Dinle testini yap.
6) Sonra Mikrofon düğmesine bas; Android konuşma ekranı açılmalı.
