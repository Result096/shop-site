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

  heroImage: "",            // фото первого экрана, например "images/hero.jpg"
  aboutImage: "",           // большое фото на странице «О бренде»
  communityImages: [],      // 4 фото для блока «Одна семья», например ["images/c1.jpg", ...]
};

// ============================================================
//  ТОВАРЫ — ПРИМЕРЫ. Замените на свои.
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
    id: "tee-essential", category: "tops", price: null, status: "preorder", isNew: true,
    name: { en: "[Essential T-shirt]", ru: "[Базовая футболка]", fr: "[T-shirt Essential]" },
    colors: ["black", "white", "grey"], sizes: ["XS", "S", "M", "L", "XL"], images: [],
    description: { en: "[Product description]", ru: "[Описание товара]", fr: "[Description du produit]" },
    composition: { en: "[Composition, care]", ru: "[Состав, уход]", fr: "[Composition, entretien]" },
  },
  {
    id: "hoodie-half-zip", category: "hoodies", price: null, status: "preorder", isNew: true,
    name: { en: "[Half-zip hoodie]", ru: "[Худи на полумолнии]", fr: "[Sweat demi-zip]" },
    colors: ["olive", "black"], sizes: ["XS", "S", "M", "L", "XL"], images: [],
    description: { en: "[Product description]", ru: "[Описание товара]", fr: "[Description du produit]" },
    composition: { en: "[Composition, care]", ru: "[Состав, уход]", fr: "[Composition, entretien]" },
  },
  {
    id: "track-jacket", category: "hoodies", price: null, status: "preorder", isNew: true,
    name: { en: "[Zip track jacket]", ru: "[Спортивная куртка на молнии]", fr: "[Veste zippée]" },
    colors: ["navy", "black"], sizes: ["S", "M", "L", "XL"], images: [],
    description: { en: "[Product description]", ru: "[Описание товара]", fr: "[Description du produit]" },
    composition: { en: "[Composition, care]", ru: "[Состав, уход]", fr: "[Composition, entretien]" },
  },
  {
    id: "flared-pants", category: "pants", price: null, status: "preorder", isNew: true,
    name: { en: "[Flared pants]", ru: "[Брюки-клёш]", fr: "[Pantalon évasé]" },
    colors: ["black"], sizes: ["XS", "S", "M", "L"], images: [],
    description: { en: "[Product description]", ru: "[Описание товара]", fr: "[Description du produit]" },
    composition: { en: "[Composition, care]", ru: "[Состав, уход]", fr: "[Composition, entretien]" },
  },
  {
    id: "shorts", category: "pants", price: null, status: "preorder", isNew: false,
    name: { en: "[Shorts]", ru: "[Шорты]", fr: "[Short]" },
    colors: ["black", "red"], sizes: ["XS", "S", "M", "L", "XL"], images: [],
    description: { en: "[Product description]", ru: "[Описание товара]", fr: "[Description du produit]" },
    composition: { en: "[Composition, care]", ru: "[Состав, уход]", fr: "[Composition, entretien]" },
  },
  {
    id: "denim-jacket", category: "hoodies", price: null, status: "soon", isNew: false,
    name: { en: "[Denim jacket]", ru: "[Джинсовая куртка]", fr: "[Veste en jean]" },
    colors: ["blue", "black"], sizes: ["S", "M", "L", "XL"], images: [],
    description: { en: "[Product description]", ru: "[Описание товара]", fr: "[Description du produit]" },
    composition: { en: "[Composition, care]", ru: "[Состав, уход]", fr: "[Composition, entretien]" },
  },
  {
    id: "longsleeve", category: "tops", price: null, status: "preorder", isNew: false,
    name: { en: "[Longsleeve]", ru: "[Лонгслив]", fr: "[T-shirt manches longues]" },
    colors: ["black", "white"], sizes: ["XS", "S", "M", "L", "XL"], images: [],
    description: { en: "[Product description]", ru: "[Описание товара]", fr: "[Description du produit]" },
    composition: { en: "[Composition, care]", ru: "[Состав, уход]", fr: "[Composition, entretien]" },
  },
  {
    id: "socks", category: "accessories", price: null, status: "preorder", isNew: false,
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
