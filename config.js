// ============================================================
//  НАСТРОЙКИ МАГАЗИНА И ТОВАРЫ
//  Тексты страниц — в файле i18n.js
// ============================================================

const SHOP = {
  name: "MONACO KG ESSENTIALS",
  shortName: "MONACO KG",
  currency: "€",            // знак валюты для цен

  // ID формы Formspree (см. README.md). Пример: "xyzabcd"
  formspreeId: "",

  email: "[hello@domain]",  // почта для покупателей (страница «Контакты»)
  whatsapp: "",             // номер в международном формате, например "+33612345678"
  instagram: "",            // ник без @, например "monacokg"
  tiktok: "",               // ник без @

  heroImage: "images/hero.jpg", // фото первого экрана
  aboutImage: "",           // большое фото на странице «О бренде»
  closingImage: "images/hero.jpg", // большое фото внизу главной, перед подвалом
  howImage: "images/cat-men.jpg",  // фото первого экрана страницы «Как работает предзаказ»
  genderImages: {           // две большие картинки «Мужское / Женское» на главной
    men: "images/cat-men.jpg", women: "images/cat-women.jpg",
  },
};

// ============================================================
//  СТРАНЫ И ЯЗЫКИ (окно «Страна / регион»)
//  region: intl | europe | cis | mideast | americas
//  langs: языки, доступные для страны (первый — основной). Есть: en, ru, fr
//  Сайт по умолчанию открывается на английском (страна INT).
// ============================================================

const COUNTRIES = [
  { code: "INT", region: "intl", langs: ["en"], name: { en: "International", ru: "Другие страны", fr: "International" } },

  { code: "MC", region: "europe", langs: ["fr", "en"], name: { en: "Monaco", ru: "Монако", fr: "Monaco" } },
  { code: "FR", region: "europe", langs: ["fr", "en"], name: { en: "France", ru: "Франция", fr: "France" } },
  { code: "BE", region: "europe", langs: ["fr", "en"], name: { en: "Belgium", ru: "Бельгия", fr: "Belgique" } },
  { code: "CH", region: "europe", langs: ["fr", "en"], name: { en: "Switzerland", ru: "Швейцария", fr: "Suisse" } },
  { code: "GB", region: "europe", langs: ["en"], name: { en: "United Kingdom", ru: "Великобритания", fr: "Royaume-Uni" } },
  { code: "DE", region: "europe", langs: ["en"], name: { en: "Germany", ru: "Германия", fr: "Allemagne" } },
  { code: "IT", region: "europe", langs: ["en"], name: { en: "Italy", ru: "Италия", fr: "Italie" } },
  { code: "ES", region: "europe", langs: ["en"], name: { en: "Spain", ru: "Испания", fr: "Espagne" } },

  { code: "KG", region: "cis", langs: ["ru", "en"], name: { en: "Kyrgyzstan", ru: "Кыргызстан", fr: "Kirghizistan" } },
  { code: "KZ", region: "cis", langs: ["ru", "en"], name: { en: "Kazakhstan", ru: "Казахстан", fr: "Kazakhstan" } },
  { code: "UZ", region: "cis", langs: ["ru", "en"], name: { en: "Uzbekistan", ru: "Узбекистан", fr: "Ouzbékistan" } },
  { code: "RU", region: "cis", langs: ["ru", "en"], name: { en: "Russia", ru: "Россия", fr: "Russie" } },

  { code: "AE", region: "mideast", langs: ["en", "ru"], name: { en: "United Arab Emirates", ru: "ОАЭ", fr: "Émirats arabes unis" } },
  { code: "TR", region: "mideast", langs: ["en", "ru"], name: { en: "Turkey", ru: "Турция", fr: "Turquie" } },

  { code: "US", region: "americas", langs: ["en"], name: { en: "United States", ru: "США", fr: "États-Unis" } },
  { code: "CA", region: "americas", langs: ["en", "fr"], name: { en: "Canada", ru: "Канада", fr: "Canada" } },
];

// ============================================================
//  ТОВАРЫ — ПРИМЕРЫ. Замените на свои.
//  gender: men | women | unisex (unisex показывается и в «Мужском», и в «Женском»)
//  category: tops | hoodies | pants | accessories
//  price: число или null (будет «Цена уточняется»)
//  images: ["images/xxx-1.jpg", "images/xxx-2.jpg", ...] — первое фото в каталоге, второе при наведении
//  status: "preorder" или "soon"
//  name / description / composition — на трёх языках
// ============================================================

const COLORS = {
  black: { hex: "#111111", en: "Black", ru: "Чёрный", fr: "Noir" },
  grey:  { hex: "#BDBDBD", en: "Grey",  ru: "Серый",  fr: "Gris" },
  white: { hex: "#FFFFFF", en: "White", ru: "Белый",  fr: "Blanc" },
  olive: { hex: "#6B6A3E", en: "Olive", ru: "Оливковый", fr: "Olive" },
  navy:  { hex: "#1F2A44", en: "Navy",  ru: "Тёмно-синий", fr: "Marine" },
  red:   { hex: "#B3261E", en: "Red",   ru: "Красный", fr: "Rouge" },
  blue:  { hex: "#7FA3C7", en: "Light blue", ru: "Голубой", fr: "Bleu clair" },
};

const PRODUCTS = [
  {
    id: "tee-essential", gender: "unisex", category: "tops", price: null, status: "preorder", isNew: true,
    name: { en: "[Essential T-shirt]", ru: "[Базовая футболка]", fr: "[T-shirt Essential]" },
    colors: ["black", "white", "grey"], sizes: ["XS", "S", "M", "L", "XL"], images: [],
    description: { en: "[Product description]", ru: "[Описание товара]", fr: "[Description du produit]" },
    composition: { en: "[Composition, care]", ru: "[Состав, уход]", fr: "[Composition, entretien]" },
  },
  {
    id: "hoodie-half-zip", gender: "unisex", category: "hoodies", price: null, status: "preorder", isNew: true,
    name: { en: "[Half-zip hoodie]", ru: "[Худи на полумолнии]", fr: "[Sweat demi-zip]" },
    colors: ["olive", "black"], sizes: ["XS", "S", "M", "L", "XL"], images: [],
    description: { en: "[Product description]", ru: "[Описание товара]", fr: "[Description du produit]" },
    composition: { en: "[Composition, care]", ru: "[Состав, уход]", fr: "[Composition, entretien]" },
  },
  {
    id: "track-jacket", gender: "men", category: "hoodies", price: null, status: "preorder", isNew: true,
    name: { en: "[Zip track jacket]", ru: "[Спортивная куртка на молнии]", fr: "[Veste zippée]" },
    colors: ["navy", "black"], sizes: ["S", "M", "L", "XL"], images: [],
    description: { en: "[Product description]", ru: "[Описание товара]", fr: "[Description du produit]" },
    composition: { en: "[Composition, care]", ru: "[Состав, уход]", fr: "[Composition, entretien]" },
  },
  {
    id: "flared-pants", gender: "women", category: "pants", price: null, status: "preorder", isNew: true,
    name: { en: "[Flared pants]", ru: "[Брюки-клёш]", fr: "[Pantalon évasé]" },
    colors: ["black"], sizes: ["XS", "S", "M", "L"], images: [],
    description: { en: "[Product description]", ru: "[Описание товара]", fr: "[Description du produit]" },
    composition: { en: "[Composition, care]", ru: "[Состав, уход]", fr: "[Composition, entretien]" },
  },
  {
    id: "shorts", gender: "women", category: "pants", price: null, status: "preorder", isNew: false,
    name: { en: "[Shorts]", ru: "[Шорты]", fr: "[Short]" },
    colors: ["black", "red"], sizes: ["XS", "S", "M", "L", "XL"], images: [],
    description: { en: "[Product description]", ru: "[Описание товара]", fr: "[Description du produit]" },
    composition: { en: "[Composition, care]", ru: "[Состав, уход]", fr: "[Composition, entretien]" },
  },
  {
    id: "denim-jacket", gender: "men", category: "hoodies", price: null, status: "soon", isNew: false,
    name: { en: "[Denim jacket]", ru: "[Джинсовая куртка]", fr: "[Veste en jean]" },
    colors: ["blue", "black"], sizes: ["S", "M", "L", "XL"], images: [],
    description: { en: "[Product description]", ru: "[Описание товара]", fr: "[Description du produit]" },
    composition: { en: "[Composition, care]", ru: "[Состав, уход]", fr: "[Composition, entretien]" },
  },
  {
    id: "longsleeve", gender: "unisex", category: "tops", price: null, status: "preorder", isNew: false,
    name: { en: "[Longsleeve]", ru: "[Лонгслив]", fr: "[T-shirt manches longues]" },
    colors: ["black", "white"], sizes: ["XS", "S", "M", "L", "XL"], images: [],
    description: { en: "[Product description]", ru: "[Описание товара]", fr: "[Description du produit]" },
    composition: { en: "[Composition, care]", ru: "[Состав, уход]", fr: "[Composition, entretien]" },
  },
  {
    id: "socks", gender: "unisex", category: "accessories", price: null, status: "preorder", isNew: false,
    name: { en: "[Socks]", ru: "[Носки]", fr: "[Chaussettes]" },
    colors: ["white", "black"], sizes: ["One size"], images: [],
    description: { en: "[Product description]", ru: "[Описание товара]", fr: "[Description du produit]" },
    composition: { en: "[Composition, care]", ru: "[Состав, уход]", fr: "[Composition, entretien]" },
  },
];

// ============================================================
//  ТАБЛИЦА РАЗМЕРОВ (в сантиметрах; дюймы считаются сами)
//  [грудь, талия, бёдра, длина]; null = «—»
// ============================================================

const SIZE_CHART = {
  tops: {
    XS: [null, null, null, null], S: [null, null, null, null], M: [null, null, null, null],
    L: [null, null, null, null], XL: [null, null, null, null],
  },
  bottoms: {
    XS: [null, null, null, null], S: [null, null, null, null], M: [null, null, null, null],
    L: [null, null, null, null], XL: [null, null, null, null],
  },
};
