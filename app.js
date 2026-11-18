(function () {
  const $ = (id) => document.getElementById(id);
  const fmt = (n) => n.toLocaleString("ru-RU") + " " + SHOP.currency;
  const STATUS = { soon: "Скоро", soldout: "Sold out" };

  // --- Тексты магазина ---
  document.title = SHOP.name + " — каталог";
  $("logo").textContent = SHOP.name;
  $("announce").textContent = SHOP.announcement || "";
  $("hero-title").textContent = SHOP.tagline;
  $("about").textContent = SHOP.about;
  if (SHOP.heroImage) $("hero").style.backgroundImage = `url("${SHOP.heroImage}")`;
  $("copyright").textContent = "© " + new Date().getFullYear() + " " + SHOP.name;

  const socials = $("socials");
  if (SHOP.instagram) socials.append(link("https://instagram.com/" + SHOP.instagram, "Instagram"));
  if (SHOP.telegram) socials.append(link("https://t.me/" + SHOP.telegram, "Telegram"));
  $("acc-socials").hidden = !socials.children.length;

  function link(href, text) {
    const a = document.createElement("a");
    a.href = href; a.textContent = text; a.target = "_blank"; a.rel = "noopener";
    return a;
  }

  function media(p) {
    if (p.image) {
      const img = document.createElement("img");
      img.src = p.image; img.alt = p.name; img.loading = "lazy";
      return img;
    }
    const ph = document.createElement("div");
    ph.className = "placeholder";
    ph.style.background = p.color || "#c9c9c7";
    ph.textContent = p.name.charAt(0);
    return ph;
  }

  // --- Категории: фильтр и меню ---
  const categories = ["Все", ...new Set(PRODUCTS.map((p) => p.category))];
  let current = "Все";
  const filters = $("filters");
  const chips = categories.map((c) => {
    const b = document.createElement("button");
    b.className = "chip"; b.textContent = c; b.setAttribute("role", "tab");
    b.onclick = () => setCategory(c);
    filters.append(b);
    return b;
  });

  function setCategory(c) {
    current = c;
    chips.forEach((b) => b.setAttribute("aria-selected", b.textContent === c));
    render();
  }

  const drawer = $("drawer");
  const menuBtn = $("menu-btn");
  categories.forEach((c) => {
    const a = document.createElement("a");
    a.href = "#catalog"; a.textContent = c;
    a.onclick = () => { setCategory(c); toggleMenu(false); };
    $("drawer-links").append(a);
  });
  function toggleMenu(open) {
    drawer.hidden = !open;
    menuBtn.setAttribute("aria-expanded", open);
  }
  menuBtn.onclick = () => toggleMenu(drawer.hidden);

  // --- Карточки ---
  function render() {
    const grid = $("grid");
    grid.innerHTML = "";
    const list = PRODUCTS.filter((p) => current === "Все" || p.category === current);
    $("count").textContent = "(" + list.length + ")";
    list.forEach((p) => {
      const open = p.status === "preorder";
      const card = document.createElement("article");
      card.className = "card" + (open ? "" : " card--off");

      const m = document.createElement("div");
      m.className = "card__media";
      m.append(media(p));
      if (STATUS[p.status]) {
        const badge = document.createElement("span");
        badge.className = "badge"; badge.textContent = STATUS[p.status];
        m.append(badge);
      }

      const info = document.createElement("div");
      info.className = "card__info";
      info.innerHTML =
        '<p class="label"></p><h3 class="card__name"></h3><p class="card__price"></p><span class="card__cta ulink"></span>';
      info.children[0].textContent = p.category;
      info.children[1].textContent = p.name;
      info.children[2].textContent = fmt(p.price);
      info.children[3].textContent = open ? "Предзаказ" : STATUS[p.status];

      card.append(m, info);
      if (open) {
        card.tabIndex = 0;
        card.onclick = () => openOrder(p);
        card.onkeydown = (e) => { if (e.key === "Enter") openOrder(p); };
      }
      grid.append(card);
    });
  }
  setCategory("Все");

  // --- Окно предзаказа ---
  const modal = $("modal");
  const form = $("order-form");
  let product = null;

  function fillSelect(sel, field, items) {
    sel.innerHTML = "";
    field.hidden = !items.length;
    items.forEach((v) => sel.append(new Option(v, v)));
  }

  function openOrder(p) {
    product = p;
    $("m-thumb").replaceChildren(media(p));
    $("m-cat").textContent = p.category;
    $("m-name").textContent = p.name;
    $("m-price").textContent = fmt(p.price);
    $("m-desc").textContent = p.description;
    fillSelect($("m-size"), $("size-field"), p.sizes || []);
    fillSelect($("m-color"), $("color-field"), p.colors || []);
    $("m-status").textContent = ""; $("m-status").className = "modal__status";
    $("m-submit").disabled = false;
    modal.showModal();
  }

  $("modal-close").onclick = () => modal.close();
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const status = $("m-status");
    if (!SHOP.formspreeId) {
      status.className = "modal__status err";
      status.textContent = "Форма ещё не настроена: добавьте formspreeId в config.js.";
      return;
    }
    const data = new FormData(form);
    data.append("product", product.name);
    data.append("price", fmt(product.price));
    data.append("_subject", "Предзаказ: " + product.name);
    $("m-submit").disabled = true;
    status.className = "modal__status"; status.textContent = "Отправляем…";
    try {
      const res = await fetch("https://formspree.io/f/" + SHOP.formspreeId, {
        method: "POST", body: data, headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      status.className = "modal__status ok";
      status.textContent = "Спасибо! Заявка отправлена, мы скоро свяжемся с вами.";
    } catch (err) {
      $("m-submit").disabled = false;
      status.className = "modal__status err";
      status.textContent = "Не удалось отправить. Попробуйте ещё раз чуть позже.";
    }
  });
})();
