# Aday Takip Sistemi

Windows ve Android'de tarayıcı üzerinden çalışan, offline-first aday takip uygulaması.

## Özellikler

- Türkçe arayüz
- Aday ekleme, düzenleme, silme
- Masaüstünde tablo görünümü
- Mobilde kart görünümü
- Cinsiyet, şehir, saç rengi, göz rengi ve tür için dropdown seçenekleri
- Genel arama
- Filtreler ve aralık filtreleri
- Sütun görünürlüğü ayarı
- IndexedDB ile lokal/offline veri saklama
- CSV dışa aktarma
- CSV içe aktarma: birleştir/güncelle veya tüm veriyi değiştir
- PWA manifest ve service worker dosyaları

## Geliştirme

```bash
npm install
npm run dev
```

Tarayıcıda Vite'ın verdiği adresi aç.

## Production build

```bash
npm run build
npm run preview
```

PWA olarak yayınlamak için `dist` klasörünü herhangi bir statik hostinge koyabilirsin.

## Not

CSV dosyaları düz metindir. Telefon, TC No gibi kişisel veriler varsa CSV dosyasını güvenli yerde sakla.
