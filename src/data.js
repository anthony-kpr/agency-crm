export const CITY_OPTIONS = [
  'Adana','Adıyaman','Afyonkarahisar','Ağrı','Amasya','Ankara','Antalya','Artvin','Aydın','Balıkesir','Bilecik','Bingöl','Bitlis','Bolu','Burdur','Bursa','Çanakkale','Çankırı','Çorum','Denizli','Diyarbakır','Edirne','Elazığ','Erzincan','Erzurum','Eskişehir','Gaziantep','Giresun','Gümüşhane','Hakkari','Hatay','Isparta','Mersin','İstanbul','İzmir','Kars','Kastamonu','Kayseri','Kırklareli','Kırşehir','Kocaeli','Konya','Kütahya','Malatya','Manisa','Kahramanmaraş','Mardin','Muğla','Muş','Nevşehir','Niğde','Ordu','Rize','Sakarya','Samsun','Siirt','Sinop','Sivas','Tekirdağ','Tokat','Trabzon','Tunceli','Şanlıurfa','Uşak','Van','Yozgat','Zonguldak','Aksaray','Bayburt','Karaman','Kırıkkale','Batman','Şırnak','Bartın','Ardahan','Iğdır','Yalova','Karabük','Kilis','Osmaniye','Düzce','Yurt Dışı','Belirtilmedi'
];

export const GENDER_OPTIONS = [
  'Kadın',
  'Erkek',
  'Non-binary',
  'Belirtmek istemiyor',
  'Diğer',
  'Belirtilmedi'
];

export const HAIR_COLOR_OPTIONS = [
  'Siyah',
  'Koyu Kahverengi',
  'Kahverengi',
  'Açık Kahverengi',
  'Kumral',
  'Koyu Kumral',
  'Açık Kumral',
  'Sarı',
  'Koyu Sarı',
  'Platin Sarı',
  'Kızıl',
  'Bakır',
  'Auburn / Kızıl Kahve',
  'Gri',
  'Beyaz',
  'Boyalı',
  'Renkli / Fantastik',
  'Kel',
  'Belirtilmedi'
];

export const EYE_COLOR_OPTIONS = [
  'Kahverengi',
  'Koyu Kahverengi',
  'Açık Kahverengi',
  'Ela',
  'Yeşil',
  'Mavi',
  'Gri',
  'Bal Rengi',
  'Siyah',
  'Kehribar',
  'Farklı Renkli',
  'Lens Kullanıyor',
  'Belirtilmedi'
];

export const TYPE_OPTIONS = [
  'Model',
  'Oyuncu',
  'Figüran',
  'Host',
  'Hostes',
  'Promotör',
  'Dansçı',
  'Influencer',
  'Reklam Yüzü',
  'Seslendirme',
  'Çocuk Oyuncu',
  'Sporcu',
  'Müzisyen',
  'Diğer',
  'Belirtilmedi'
];

export const FIELDS = [
  { key: 'adSoyad', label: 'Ad Soyad', type: 'text', required: true, placeholder: 'Örn. Ayşe Yılmaz' },
  { key: 'cinsiyet', label: 'Cinsiyet', type: 'select', options: GENDER_OPTIONS },
  { key: 'yas', label: 'Yaş', type: 'number', min: 0, max: 120 },
  { key: 'sehir', label: 'Şehir', type: 'select', options: CITY_OPTIONS },
  { key: 'boyCm', label: 'Boy (cm)', type: 'number', min: 0, max: 260 },
  { key: 'kiloKg', label: 'Kilo (kg)', type: 'number', min: 0, max: 300 },
  { key: 'sacRengi', label: 'Saç Rengi', type: 'select', options: HAIR_COLOR_OPTIONS },
  { key: 'gozRengi', label: 'Göz Rengi', type: 'select', options: EYE_COLOR_OPTIONS },
  { key: 'tur', label: 'Tür', type: 'select', options: TYPE_OPTIONS },
  { key: 'tcNo', label: 'TC No', type: 'text', placeholder: 'İsteğe bağlı' },
  { key: 'telefonNo', label: 'Telefon No', type: 'tel', placeholder: 'İsteğe bağlı' },
  { key: 'adayNo', label: 'Aday No', type: 'text', placeholder: 'İsteğe bağlı' },
  { key: 'kartNo', label: 'Kart No', type: 'text', placeholder: 'İsteğe bağlı' },
  { key: 'notlar', label: 'Notlar', type: 'textarea', placeholder: 'Ek notlar' }
];

export const SYSTEM_FIELDS = [
  { key: 'id', label: 'ID' },
  { key: 'createdAt', label: 'Oluşturulma Tarihi' },
  { key: 'updatedAt', label: 'Güncellenme Tarihi' }
];

export const ALL_EXPORT_FIELDS = [
  ...SYSTEM_FIELDS,
  ...FIELDS.map(({ key, label }) => ({ key, label }))
];

export const DEFAULT_VISIBLE_COLUMNS = [
  'adSoyad',
  'cinsiyet',
  'yas',
  'sehir',
  'boyCm',
  'kiloKg',
  'sacRengi',
  'gozRengi',
  'tur',
  'telefonNo'
];

export function getField(key) {
  return FIELDS.find((field) => field.key === key) || SYSTEM_FIELDS.find((field) => field.key === key);
}

export function getLabel(key) {
  return getField(key)?.label || key;
}
