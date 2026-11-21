// ============================================================
//  НАСТРОЙКИ МАГАЗИНА И ТОВАРЫ
//  Тексты страниц — в файле i18n.js
// ============================================================

const SHOP = {
  name: "MONACO KG ESSENTIALS",
  shortName: "MONACO KG",
  currency: "$",            // знак валюты перед ценой: $120

  // ID формы Formspree (см. README.md). Пример: "xyzabcd"
  formspreeId: "",

  email: "[hello@domain]",  // почта для покупателей (страница «Контакты»)
  whatsapp: "",             // номер в международном формате, например "+33612345678"
  instagram: "",            // ник без @, например "monacokg"
  tiktok: "",               // ник без @

  heroImage: "images/hero.jpg", // фото первого экрана
  aboutImage: "",           // большое фото на странице «О бренде»
  shopImage: "images/hero.jpg",    // фото верхнего экрана каталога (400px), одно для All / Men / Women
  howImage: "images/cat-men.jpg",  // фото первого экрана страницы «Как работает предзаказ»
  genderImages: {           // две большие картинки «Мужское / Женское» на главной
    men: "images/cat-men.jpg", women: "images/cat-women.jpg",
  },
};

// ============================================================
//  ТОВАРЫ — ПРИМЕРЫ. Замените на свои.
//  gender: men | women | unisex (unisex показывается и в «Мужском», и в «Женском»)
//  category: tops | hoodies | pants | accessories
//  price: число, например 120 (будет $120), или null (будет $000)
//  images: ["images/xxx-1.jpg", "images/xxx-2.jpg", ...] — первое фото в каталоге, второе при наведении
//  status: "preorder" или "soon"
//  short — короткое описание для каталога (2–3 строки)
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
    short: { en: "[Everyday tee in soft heavyweight cotton. Relaxed fit with a small embroidered MKG logo on the chest.]" },
    description: { en: "[Product description]", ru: "[Описание товара]", fr: "[Description du produit]" },
    composition: { en: "[Composition, care]", ru: "[Состав, уход]", fr: "[Composition, entretien]" },
  },
  {
    id: "hoodie-half-zip", gender: "unisex", category: "hoodies", price: null, status: "preorder", isNew: true,
    name: { en: "[Half-zip hoodie]", ru: "[Худи на полумолнии]", fr: "[Sweat demi-zip]" },
    colors: ["olive", "black"], sizes: ["XS", "S", "M", "L", "XL"], images: [],
    short: { en: "[Half-zip hoodie in brushed fleece. Contrast stitching, kangaroo pocket and a stand-up collar.]" },
    description: { en: "[Product description]", ru: "[Описание товара]", fr: "[Description du produit]" },
    composition: { en: "[Composition, care]", ru: "[Состав, уход]", fr: "[Composition, entretien]" },
  },
  {
    id: "track-jacket", gender: "men", category: "hoodies", price: null, status: "preorder", isNew: true,
    name: { en: "[Zip track jacket]", ru: "[Спортивная куртка на молнии]", fr: "[Veste zippée]" },
    colors: ["navy", "black"], sizes: ["S", "M", "L", "XL"], images: [],
    short: { en: "[Zip track jacket with contrast piping along the seams. Lightweight, easy to layer.]" },
    description: { en: "[Product description]", ru: "[Описание товара]", fr: "[Description du produit]" },
    composition: { en: "[Composition, care]", ru: "[Состав, уход]", fr: "[Composition, entretien]" },
  },
  {
    id: "flared-pants", gender: "women", category: "pants", price: null, status: "preorder", isNew: true,
    name: { en: "[Flared pants]", ru: "[Брюки-клёш]", fr: "[Pantalon évasé]" },
    colors: ["black"], sizes: ["XS", "S", "M", "L"], images: [],
    short: { en: "[High-waisted flared pants with contrast stitching. Stretch fabric that moves with you.]" },
    description: { en: "[Product description]", ru: "[Описание товара]", fr: "[Description du produit]" },
    composition: { en: "[Composition, care]", ru: "[Состав, уход]", fr: "[Composition, entretien]" },
  },
  {
    id: "shorts", gender: "women", category: "pants", price: null, status: "preorder", isNew: false,
    name: { en: "[Shorts]", ru: "[Шорты]", fr: "[Short]" },
    colors: ["black", "red"], sizes: ["XS", "S", "M", "L", "XL"], images: [],
    short: { en: "[Fitted cycling-style shorts with contrast seams. Soft stretch jersey, high waist.]" },
    description: { en: "[Product description]", ru: "[Описание товара]", fr: "[Description du produit]" },
    composition: { en: "[Composition, care]", ru: "[Состав, уход]", fr: "[Composition, entretien]" },
  },
  {
    id: "denim-jacket", gender: "men", category: "hoodies", price: null, status: "soon", isNew: false,
    name: { en: "[Denim jacket]", ru: "[Джинсовая куртка]", fr: "[Veste en jean]" },
    colors: ["blue", "black"], sizes: ["S", "M", "L", "XL"], images: [],
    short: { en: "[Washed denim jacket with an all-over tonal print and leather back patch. Boxy fit.]" },
    description: { en: "[Product description]", ru: "[Описание товара]", fr: "[Description du produit]" },
    composition: { en: "[Composition, care]", ru: "[Состав, уход]", fr: "[Composition, entretien]" },
  },
  {
    id: "longsleeve", gender: "unisex", category: "tops", price: null, status: "preorder", isNew: false,
    name: { en: "[Longsleeve]", ru: "[Лонгслив]", fr: "[T-shirt manches longues]" },
    colors: ["black", "white"], sizes: ["XS", "S", "M", "L", "XL"], images: [],
    short: { en: "[Long-sleeve tee in fine cotton jersey. Slim fit, ribbed cuffs, small logo on the sleeve.]" },
    description: { en: "[Product description]", ru: "[Описание товара]", fr: "[Description du produit]" },
    composition: { en: "[Composition, care]", ru: "[Состав, уход]", fr: "[Composition, entretien]" },
  },
  {
    id: "socks", gender: "unisex", category: "accessories", price: null, status: "preorder", isNew: false,
    name: { en: "[Socks]", ru: "[Носки]", fr: "[Chaussettes]" },
    colors: ["white", "black"], sizes: ["One size"], images: [],
    short: { en: "[Ribbed cotton socks with a woven Monaco KG logo. Sold as a pair.]" },
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
