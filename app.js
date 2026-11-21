(function () {
  "use strict";

  // ---------- helpers ----------
  const app = document.getElementById("app");
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  };
  let lang = "en";
  const t = (key, vars) => {
    let s = (T[lang] && T[lang][key]) ?? T.en[key] ?? key;
    if (vars && typeof s === "string") for (const k in vars) s = s.split("{" + k + "}").join(vars[k]);
    return s;
  };
  const L = (obj) => (obj && (obj[lang] ?? obj.en)) || "";
  const href = (path) => "#/" + lang + (path ? "/" + path : "");
  // "$000" is the placeholder until real prices are set in config.js
  const price = (p) => SHOP.currency + (p.price == null ? "000" : p.price.toLocaleString("en-US"));
  const colorName = (c) => (COLORS[c] ? COLORS[c][lang] || COLORS[c].en : c);
  const byId = (id) => PRODUCTS.find((p) => p.id === id);
  // Bag (pre-order basket) lives in localStorage: [{ id, color, size, qty }]
  const BAG_KEY = "mkg-bag";
  const bagGet = () => { try { return (JSON.parse(store.get(BAG_KEY) || "[]") || []).filter((i) => byId(i.id)); } catch { return []; } };
  const bagSet = (items) => { store.set(BAG_KEY, JSON.stringify(items)); document.querySelectorAll("[data-bag-count]").forEach((e) => (e.textContent = pad2(bagCount(items)))); };
  const pad2 = (n) => String(n).padStart(2, "0");
  const bagCount = (items = bagGet()) => items.reduce((n, i) => n + i.qty, 0);
  function bagAdd(id, color, size) {
    const items = bagGet();
    const same = items.find((i) => i.id === id && i.color === color && i.size === size);
    if (same) same.qty = Math.min(same.qty + 1, 9); else items.push({ id, color, size, qty: 1 });
    bagSet(items);
  }

  function media(p, i = 0, cls = "") {
    const src = p.images && p.images[i];
    if (src) return `<img class="${cls}" src="${esc(src)}" alt="${esc(L(p.name))}" loading="lazy">`;
    return `<div class="ph ${cls}"><span>${esc(L(p.name).replace(/[\[\]]/g, ""))}</span></div>`;
  }
  function photoOr(src, label, cls = "") {
    return src ? `<img class="${cls}" src="${esc(src)}" alt="" loading="lazy">` : `<div class="ph ${cls}"><span>${esc(label)}</span></div>`;
  }
  function swatches(p) {
    return `<div class="swatches" aria-label="${esc(t("colour"))}">${p.colors
      .map((c) => `<span class="sw" style="background:${COLORS[c] ? COLORS[c].hex : "#ccc"}" title="${esc(colorName(c))}"></span>`)
      .join("")}</div>`;
  }
  function card(p) {
    const second = p.images && p.images[1] ? media(p, 1, "card__alt") : "";
    // name → short description (2 lines) → colours → price → Pre-order link at the very bottom
    return `<a class="card" href="${href("product/" + p.id)}">
      <div class="card__media">${media(p, 0)}${second}</div>
      <div class="card__info">
        <span class="card__name">${esc(L(p.name))}</span>
        ${p.short ? `<p class="card__desc">${esc(L(p.short))}</p>` : ""}
        ${swatches(p)}
        <span class="card__price">${esc(price(p))}</span>
        <span class="card__btn${p.status === "soon" ? " card__btn--soon" : ""}">${esc(p.status === "soon" ? t("badge_soon") : t("badge_preorder"))}</span>
      </div></a>`;
  }

  // ---------- layout ----------
  // Header from the Figma mock-up: COLLECTION + MENU on the left, CONTACT + language on the right.
  // mode "home": transparent over the hero, no logo (the big logo sits in the hero itself);
  // mode "over": transparent over a page photo with the white logo; "" : white sticky bar.
  function header(active, mode) {
    const links = [["shop", "nav_collection"], ["about", "nav_about"], ["how", "nav_how"], ["size", "size_guide"], ["contact", "nav_contact"]];
    const nav = links.map(([p, k]) => `<a href="${href(p)}"${active === p ? ' aria-current="page"' : ""}>${esc(t(k))}</a>`).join("");
    const logo = mode === "home" ? `<span></span>`
      : `<a class="logo" href="${href("")}"><img src="${mode ? "images/logo-hero.png" : "images/logo-header.png"}" alt="${esc(SHOP.name)}" width="${mode ? 600 : 368}" height="${mode ? 569 : 240}"></a>`;
    return `
      <div class="announce">${esc(t("announce"))}</div>
      <div class="top${mode ? " top--over" : ""}">
        <header class="header">
          <div class="header__l">
            <a class="hlink hlink--d" href="${href("shop")}"${active === "shop" ? ' aria-current="page"' : ""}>${esc(t("nav_collection"))}</a>
            <button class="hlink" id="menu-btn" aria-expanded="false" aria-controls="drawer">${esc(t("menu"))}</button>
          </div>
          ${logo}
          <div class="header__r">
            <a class="hlink hlink--d" href="${href("contact")}"${active === "contact" ? ' aria-current="page"' : ""}>${esc(t("nav_contact"))}</a>
            <a class="hlink" href="${href("bag")}"${active === "bag" ? ' aria-current="page"' : ""}>${esc(t("nav_bag"))} [<span data-bag-count>${pad2(bagCount())}</span>]</a>
          </div>
        </header>
        <nav class="drawer" id="drawer" hidden>${nav}</nav>
      </div>`;
  }

  // Footer: numbered info strip → black brand block from the mock-up (two texts + logo) →
  // the earlier accordion sections (Contact / Shop / Help / Follow / Legal) + language → copyright.
  // Numbered info strip "01 No payment now · 02 Worldwide shipping · 03 Size guide"
  // (on home it sits between Category and the closing photo, elsewhere right above the footer)
  function strip() {
    const links = ["how", "how?s=faq", "size"];
    return `<nav class="strip" aria-label="Info">${t("strip").map((s, i) => `<a class="ulink" href="${href(links[i])}">0${i + 1} ${esc(s)}</a>`).join("")}</nav>`;
  }

  function footer(home) {
    const soc = [];
    if (SHOP.instagram) soc.push(`<a href="https://instagram.com/${esc(SHOP.instagram)}" target="_blank" rel="noopener">Instagram</a>`);
    if (SHOP.tiktok) soc.push(`<a href="https://tiktok.com/@${esc(SHOP.tiktok)}" target="_blank" rel="noopener">TikTok</a>`);
    if (!soc.length) soc.push(`<span>Instagram</span>`, `<span>TikTok</span>`);
    const lt = t("legal_tabs");
    const acc = (title, links) => `<details class="facc"><summary>${esc(title)}</summary><div class="facc__links">${links}</div></details>`;
    const contact = [
      SHOP.email.startsWith("[") ? `<span>${esc(SHOP.email)}</span>` : `<a href="mailto:${esc(SHOP.email)}">${esc(SHOP.email)}</a>`,
      SHOP.whatsapp ? `<a href="https://wa.me/${esc(SHOP.whatsapp.replace(/\D/g, ""))}" target="_blank" rel="noopener">WhatsApp</a>` : "",
      `<a href="${href("contact")}">${esc(t("contact_title"))}</a>`,
    ].join("");
    return `
    ${home ? "" : strip()}
    <footer class="footer">
      <!-- Figma frame "Footer" (3:5): title + tag, three text columns, motto under column 2, star logo on the right -->
      <div class="ft">
        <div class="ft__head"><p class="ft__h">${esc(SHOP.name)}</p><p class="ft__tag">${esc(t("brand_tag"))}</p></div>
        <p class="ft__c1">${esc(t("brand_left")[0])}</p>
        <p class="ft__c2">${esc(t("brand_left")[1])}</p>
        <div class="ft__c3"><p>${esc(t("brand_right")[0])}</p><p class="ft__b">${esc(t("brand_right")[1])}</p></div>
        <p class="ft__tag ft__motto">${esc(t("brand_motto"))}</p>
        <picture class="ft__logo"><source media="(max-width: 899px)" srcset="images/logo-star-tight.png"><img src="images/logo-star.png" alt="${esc(SHOP.name)}" width="900" height="854" loading="lazy"></picture>
      </div>
      <div class="footer__cols">
        ${acc(t("f_contact"), contact)}
        ${acc(t("f_shop"), `<a href="${href("shop")}">${esc(t("f_all_products"))}</a><a href="${href("shop?g=men")}">${esc(t("genders").men)}</a><a href="${href("shop?g=women")}">${esc(t("genders").women)}</a>`)}
        ${acc(t("f_help"), `<a href="${href("how")}">${esc(t("nav_how"))}</a><a href="${href("how?s=faq")}">FAQ</a><a href="${href("size")}">${esc(t("size_guide"))}</a>`)}
        ${acc(t("f_follow"), soc.join(""))}
        ${acc(t("f_legal"), Object.keys(lt).map((k) => `<a href="${href("legal/" + k)}">${esc(lt[k])}</a>`).join(""))}
      </div>
      <div class="footer__bottom"><span>© ${new Date().getFullYear()} ${esc(SHOP.name)}</span></div>
    </footer>`;
  }


  // ---------- pages ----------
  const pages = {};

  // Home = Figma "Home" (0:3, 1920 artboard): hero (texts left/right, small logo + Shop now in the centre) →
  // New collection (6 tiles) → Category (Men / Women) → info strip 01/02/03 → closing photo → shared footer.
  const bg = (src) => (src ? ` style="background-image:url('${esc(src)}')"` : "");
  pages.home = () => {
    const items = PRODUCTS.slice().sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)).slice(0, 6);
    const tiles = items.map((p) => `<a class="tile" href="${href("product/" + p.id)}">
        <div class="tile__media">${media(p, 0)}</div>
        <span class="tile__cap"><span>${esc(L(p.name))}</span><span>${esc(price(p))}</span></span></a>`).join("");
    const cats = ["men", "women"].map((g) => `<a class="hc__tile hc__tile--${g}" href="${href("shop?g=" + g)}">
        ${SHOP.genderImages[g] ? `<img src="${esc(SHOP.genderImages[g])}" alt="" loading="lazy">` : ""}
        <span class="hc__label"><b>${esc(t("genders")[g])}</b><span class="hc__shop">${esc(t("shop_now"))}</span></span></a>`).join("");

    return `
    <section class="hh"${bg(SHOP.heroImage)}>
      <span class="hh__logo"><img src="images/logo-hero.png" alt="${esc(SHOP.name)}" width="600" height="569"></span>
      <div class="hh__l"><h1 class="hh__t">${esc(t("hero_l"))}</h1><p class="hh__p">${esc(t("hero_sub"))}</p></div>
      <p class="hh__t hh__r">${esc(t("hero_r"))}</p>
      <a class="hh__shop" href="${href("shop")}">${esc(t("shop_now"))}</a>
    </section>

    <section class="hn">
      <div class="hhead"><h2 class="hhead__t">${esc(t("new_collection"))}</h2><a class="hhead__a" href="${href("shop")}">${esc(t("shop_now"))}</a></div>
      <div class="hn__row">${tiles}</div>
    </section>

    <section class="hc">
      <div class="hhead"><h2 class="hhead__t">${esc(t("category"))}</h2><span class="hhead__note">${esc(t("season_label"))}</span></div>
      <div class="hc__grid">${cats}</div>
    </section>
    ${strip()}
    <section class="hp"${bg(SHOP.closingImage)} role="img" aria-label="${esc(SHOP.name)}"></section>`;
  };

  // Catalogue: 400px photo screen with the title → bar with All / Men / Women + count → 4-up grid.
  // Only two categories for now (few pieces), no filters. State in the URL: #/en/shop?g=men
  pages.shop = (_, q) => {
    const g = t("genders")[q.get("g")] ? q.get("g") : "";
    // unisex pieces show up under both Men and Women; new pieces first
    const list = PRODUCTS.filter((p) => !g || p.gender === g || p.gender === "unisex")
      .sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    const tab = (v, label, on) => `<button class="pl-link" data-q="g" data-v="${v}" aria-pressed="${on}">${esc(label)}</button>`;
    return `
    <section class="pl-hero"${bg(SHOP.shopImage)}>
      <h1 class="hh__t">${esc(g ? t("genders")[g] : t("nav_collection"))}</h1>
    </section>
    <div class="pl-bar">
      <nav class="pl-tabs" aria-label="${esc(t("gender"))}">
        ${tab("all", t("f_all"), !g)}${Object.entries(t("genders")).map(([k, v]) => tab(k, v, g === k)).join("")}
      </nav>
      <span class="pl-count">[${esc(t("n_products", { n: list.length }))}]</span>
    </div>
    <section class="pl-grid">${list.length ? list.map(card).join("") : `<p class="pl-empty">${esc(t("empty"))}</p>`}</section>`;
  };

  pages.product = ([id]) => {
    const p = byId(id);
    if (!p) return pages.notfound();
    const imgs = p.images && p.images.length ? p.images.map((_, i) => media(p, i)) : [media(p, 0), `<div class="ph"></div>`, `<div class="ph"></div>`, `<div class="ph"></div>`];
    const more = PRODUCTS.filter((x) => x.id !== p.id).sort((a, b) => (b.category === p.category) - (a.category === p.category)).slice(0, 4);
    const canOrder = p.status === "preorder";
    return `
    <div class="block crumbs"><p class="eyebrow"><a href="${href("")}">${esc(t("crumbs_home"))}</a> / <a href="${href("shop")}">${esc(t("shop_title"))}</a> / <a href="${href("shop?cat=" + p.category)}">${esc(t("cats")[p.category] || "")}</a> / ${esc(L(p.name))}</p></div>
    <section class="pdp">
      <div class="pdp__gallery">${imgs.join("")}</div>
      <div class="pdp__info" id="pdp" data-id="${esc(p.id)}">
        <span class="badge badge--inline">${esc(canOrder ? t("badge_preorder") : t("badge_soon"))}</span>
        <h1 class="pdp__name">${esc(L(p.name))}</h1>
        <p class="pdp__price">${esc(price(p))}</p>

        <div class="opt">
          <p>${esc(t("colour"))}: <strong id="color-label">${esc(colorName(p.colors[0]))}</strong></p>
          <div class="opt__row" role="radiogroup" aria-label="${esc(t("colour"))}">
            ${p.colors.map((c, i) => `<button class="dot" role="radio" aria-checked="${i === 0}" data-color="${c}" aria-label="${esc(colorName(c))}"><span style="background:${COLORS[c] ? COLORS[c].hex : "#ccc"}"></span></button>`).join("")}
          </div>
        </div>

        <div class="opt">
          <div class="opt__head"><p>${esc(t("size"))}: <strong id="size-label">${esc(p.sizes.length === 1 ? p.sizes[0] : t("select_size"))}</strong></p><a class="ulink" href="${href("size")}">${esc(t("size_guide"))}</a></div>
          <div class="opt__row" role="radiogroup" aria-label="${esc(t("size"))}">
            ${p.sizes.map((s) => `<button class="sz" role="radio" aria-checked="${p.sizes.length === 1}" data-size="${esc(s)}">${esc(s)}</button>`).join("")}
          </div>
          <p class="err" id="size-err" hidden>${esc(t("pick_size_first"))}</p>
        </div>

        <button class="btn btn--full" id="add-to-bag" ${canOrder ? "" : "disabled"}>${esc(canOrder ? t("add_to_bag") : t("badge_soon"))}</button>
        <p class="added" id="added" hidden>${esc(t("added_to_bag"))} — <a class="ulink" href="${href("bag")}">${esc(t("view_bag"))}</a></p>
        <p class="note">${esc(t("preorder_note"))}</p>

        <div class="acc-group">
          <details open><summary>${esc(t("d_description"))}</summary><p>${esc(L(p.description))}</p></details>
          <details><summary>${esc(t("d_composition"))}</summary><p>${esc(L(p.composition))}</p></details>
          <details><summary>${esc(t("d_shipping"))}</summary><p>${esc(t("shipping_text"))}</p></details>
        </div>
      </div>
    </section>
    <section class="block">
      <h2 class="h2">${esc(t("also_like"))}</h2>
    </section>
    <section class="grid grid--edge">${more.map(card).join("")}</section>`;
  };

  const COUNTRY_CODES = "AF AX AL DZ AD AO AI AG AR AM AW AU AT AZ BS BH BD BB BY BE BZ BJ BM BT BO BA BW BR BN BG BF BI CV KH CM CA KY CF TD CL CN CO KM CG CD CR CI HR CU CW CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FO FJ FI FR GF PF GA GM GE DE GH GI GR GL GD GP GU GT GG GN GW GY HT HN HK HU IS IN ID IR IQ IE IM IL IT JM JP JE JO KZ KE KI KW KG LA LV LB LS LR LY LI LT LU MO MG MW MY MV ML MT MH MQ MR MU YT MX FM MD MC MN ME MS MA MZ MM NA NR NP NL NC NZ NI NE NG MK NO OM PK PW PS PA PG PY PE PH PL PT PR QA RE RO RU RW BL KN LC MF PM VC WS SM ST SA SN RS SC SL SG SX SK SI SB SO ZA KR SS ES LK SD SR SE CH SY TW TJ TZ TH TL TG TO TT TN TR TM TC TV UG UA AE GB US UY UZ VU VA VE VN VG VI WF EH YE ZM ZW".split(" ");
  function countryOptions() {
    let dn = null;
    try { dn = new Intl.DisplayNames([lang], { type: "region" }); } catch {}
    const list = COUNTRY_CODES.map((c) => [c, dn ? dn.of(c) : c]).sort((a, b) => a[1].localeCompare(b[1], lang));
    return `<option value="">${esc(t("choose_country"))}</option>` + list.map(([c, n]) => `<option value="${esc(n)}">${esc(n)}</option>`).join("");
  }
  const req = (label) => `${esc(label)} *`;
  const opt = (label) => `${esc(label)} <span class="muted">[${esc(t("optional"))}]</span>`;
  const consent = () => `<label class="check"><input type="checkbox" name="consent" value="yes" required><span>${t("consent", { privacy: `<a href="${href("legal/privacy")}" target="_blank">${esc(t("privacy_link"))}</a>` })} *</span></label>`;

  // Bag page: items on the left (photo, name, colour / size, qty, price, remove), pre-order form on the right
  pages.bag = () => {
    const items = bagGet();
    const head = `<section class="pl-head bag-head"><h1 class="hhead__t">${esc(t("bag_title"))}</h1><span class="pl-count">[${bagCount(items)}]</span></section>`;
    if (!items.length) return head + `<section class="bag-empty"><p>${esc(t("bag_empty"))}</p><a class="hhead__a" href="${href("shop")}">${esc(t("shop_now"))}</a></section>`;
    const rows = items.map((it, n) => {
      const p = byId(it.id);
      return `<li class="bag-item">
        <a class="bag-item__img" href="${href("product/" + p.id)}">${media(p, 0)}</a>
        <div class="bag-item__info">
          <a class="card__name" href="${href("product/" + p.id)}">${esc(L(p.name))}</a>
          <span class="muted">${esc(colorName(it.color))} / ${esc(it.size)}</span>
          <label class="bag-item__qty">${esc(t("quantity"))}<select data-qty="${n}">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((q) => `<option${q === it.qty ? " selected" : ""}>${q}</option>`).join("")}</select></label>
          <span class="card__price">${esc(price(p))}</span>
          <button type="button" class="card__btn bag-item__rm" data-remove="${n}">${esc(t("remove"))}</button>
        </div></li>`;
    }).join("");
    return head + `
    <section class="bag">
      <ul class="bag-list" id="bag-list">${rows}</ul>
      <form class="bag-form form" id="bag-form" novalidate>
        <div><h2 class="h3">${esc(t("bag_form_title"))}</h2><p class="muted small">${esc(t("bag_form_sub"))}</p></div>
        <div class="fields">
          <label class="field">${req(t("full_name"))}<input name="name" required autocomplete="name"></label>
          <label class="field">${req(t("email"))}<input name="email" type="email" required autocomplete="email"></label>
          <label class="field">${opt(t("phone"))}<input name="phone" type="tel" autocomplete="tel"></label>
          <label class="field">${req(t("country"))}<select name="country" required autocomplete="country-name">${countryOptions()}</select></label>
          <label class="field">${req(t("city"))}<input name="city" required autocomplete="address-level2"></label>
          <label class="field">${esc(t("postal"))}<input name="postal" autocomplete="postal-code"></label>
        </div>
        <label class="field">${req(t("address"))}<input name="address" required autocomplete="street-address"></label>
        <label class="field">${opt(t("comment"))}<textarea name="comment" rows="2"></textarea></label>
        ${consent()}
        <button type="submit" class="btn btn--full">${esc(t("send_preorder"))}</button>
        <p class="status" role="status"></p>
      </form>
    </section>`;
  };
  pages.thanks = () => {
    let o = null;
    try { o = JSON.parse(sessionStorage.getItem("mkg-last-order") || "null"); } catch {}
    if (!o) return `<section class="block narrow"><h1 class="h1">${esc(t("thanks_empty"))}</h1><a class="btn" href="${href("shop")}">${esc(t("continue"))}</a></section>`;
    const row = (k, v) => `<div class="sum-row"><span class="muted">${esc(k)}</span><span>${esc(v)}</span></div>`;
    return `<section class="block narrow thanks">
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M7.5 12.5l3 3 6-6.5"/></svg>
      <h1 class="h1">${t("thanks_title", { name: esc(o.name) })}</h1>
      <p class="lead-s">${t("thanks_text", { email: `<strong>${esc(o.email)}</strong>` })}</p>
      <div class="summary"><p class="eyebrow">${esc(t("your_preorder"))}</p>
        ${(o.items || [{ product: o.product, colour: o.colour, size: o.size, qty: o.quantity || 1, price: o.price }]).map((l) => row(l.product + (l.qty > 1 ? " × " + l.qty : ""), l.colour + " / " + l.size + " · " + l.price)).join("")}
        ${row(t("ship_to"), o.city + ", " + o.country)}${row(t("po_number"), "#" + o.ref)}</div>
      <a class="btn" href="${href("shop")}">${esc(t("continue"))}</a>
      <p>${esc(t("welcome"))}${SHOP.instagram ? ` <a class="ulink" href="https://instagram.com/${esc(SHOP.instagram)}" target="_blank" rel="noopener">Instagram</a>` : ""}</p>
    </section>`;
  };

  pages.about = () => {
    const b = t("about_blocks");
    return `
    <section class="hero hero--short" ${SHOP.aboutImage ? `style="background-image:url('${esc(SHOP.aboutImage)}')"` : ""}>
      <div class="hero__content"><p class="eyebrow eyebrow--light">${esc(t("about_title"))}</p><h1 class="hero__title">${esc(SHOP.name)}</h1></div>
    </section>
    ${b.map(([h, p], i) => `<section class="block split ${i % 2 ? "split--rev" : ""}">
      <div><p class="eyebrow">0${i + 1}</p><h2 class="h2">${esc(h)}</h2><p class="body">${esc(p)}</p></div>
      ${i === 0 ? "" : `<div class="ph split__img"><span>${esc(t("about_hero_ph"))}</span></div>`}
    </section>`).join("")}
    <section class="band"><div class="block center">
      <h2 class="h2 h2--big">${esc(t("about_motto"))}</h2>
      <p class="muted">${esc(t("about_sign"))}</p>
      <a class="btn" href="${href("shop")}">${esc(t("hero_cta"))}</a>
    </div></section>
    <section class="block split">
      <div class="ph split__img"><span>${esc(t("founder"))}</span></div>
      <div><p class="eyebrow">${esc(t("founder"))}</p><h2 class="h2">${esc(t("founder_name"))}</h2><p class="body">${esc(t("founder_story"))}</p></div>
    </section>`;
  };

  // Pre-order page: first screen = photo + page title (same type as the home hero), then a white info block.
  pages.how = () => `
    <section class="pgh"${bg(SHOP.howImage)}>
      <div class="pgh__in"><p class="pgh__eyebrow">${esc(SHOP.name)}</p><h1 class="hh__t">${esc(t("nav_how"))}</h1></div>
    </section>
    <section class="block info-head">
      <h2 class="hhead__t">${esc(t("how_page_title"))}</h2>
      <p class="lead-s">${esc(t("how_page_sub"))}</p>
    </section>
    <section class="block"><ol class="steps4">${t("steps4").map(([h, d], i) => `<li><span class="muted">${esc(t("step"))} ${i + 1}</span><h2 class="h3">${esc(h)}</h2><p>${esc(d)}</p></li>`).join("")}</ol></section>
    <section id="faq"><div class="block faq">
      <div><p class="eyebrow">${esc(t("faq"))}</p><h2 class="h2">${esc(t("questions"))}</h2><p class="muted">${esc(t("didnt_find"))} <a class="ulink" href="${href("contact")}">${esc(t("contact_us"))}</a></p></div>
      <div class="acc-group">${t("faqs").map(([q, a], i) => `<details${i === 0 ? " open" : ""}><summary>${esc(q)}</summary><p>${esc(a).replace("{sizeguide}", `<a class="ulink" href="${href("size")}">${esc(t("size_guide").toLowerCase())}</a>`)}</p></details>`).join("")}</div>
    </div></section>
    <section class="block center"><h2 class="h2">${esc(t("ready"))}</h2><a class="btn" href="${href("shop")}">${esc(t("hero_cta"))}</a></section>`;

  pages.contact = () => {
    const wa = SHOP.whatsapp ? `<a class="ulink" href="https://wa.me/${esc(SHOP.whatsapp.replace(/\D/g, ""))}" target="_blank" rel="noopener">${esc(SHOP.whatsapp)}</a>` : `<span>[+…]</span>`;
    return `<section class="block contact">
      <div>
        <p class="eyebrow">${esc(t("nav_contact"))}</p>
        <h1 class="h1">${esc(t("contact_title"))}</h1>
        <p class="lead-s">${esc(t("contact_sub"))}</p>
        <dl class="dl"><dt>Email</dt><dd>${SHOP.email.startsWith("[") ? esc(SHOP.email) : `<a class="ulink" href="mailto:${esc(SHOP.email)}">${esc(SHOP.email)}</a>`}</dd>
          <dt>WhatsApp</dt><dd>${wa}</dd>
          <dt>${esc(t("f_follow"))}</dt><dd>${SHOP.instagram ? `<a class="ulink" href="https://instagram.com/${esc(SHOP.instagram)}" target="_blank" rel="noopener">Instagram</a> ` : "Instagram "}${SHOP.tiktok ? `<a class="ulink" href="https://tiktok.com/@${esc(SHOP.tiktok)}" target="_blank" rel="noopener">TikTok</a>` : "TikTok"}</dd></dl>
      </div>
      <form class="form" id="contact-form" novalidate>
        <div class="fields">
          <label class="field">${req(t("full_name"))}<input name="name" required autocomplete="name"></label>
          <label class="field">${req(t("email"))}<input name="email" type="email" required autocomplete="email"></label>
        </div>
        <label class="field">${esc(t("topic"))}<select name="topic">${t("topics").map((x) => `<option>${esc(x)}</option>`).join("")}</select></label>
        <label class="field">${req(t("message"))}<textarea name="message" rows="5" required></textarea></label>
        ${consent()}
        <button type="submit" class="btn">${esc(t("send_message"))}</button>
        <p class="status" role="status"></p>
      </form>
    </section>`;
  };

  pages.size = (_, q) => {
    const unit = q.get("unit") === "in" ? "in" : "cm";
    const cat = q.get("cat") === "bottoms" ? "bottoms" : "tops";
    const cols = t("sg_cols");
    const val = (v) => (v == null ? "—" : unit === "in" ? (v / 2.54).toFixed(1) : v);
    const rows = Object.entries(SIZE_CHART[cat]).map(([s, v]) => `<tr><th scope="row">${esc(s)}</th>${v.map((x) => `<td>${val(x)}</td>`).join("")}</tr>`).join("");
    const seg = (k, v, label, cur) => `<button class="chip" data-q="${k}" data-v="${v}" aria-pressed="${v === cur}">${esc(label)}</button>`;
    return `<section class="block page-head">
      <p class="eyebrow">${esc(t("f_help"))}</p><h1 class="h1">${esc(t("sg_title"))}</h1></section>
    <section class="block">
      <div class="toolbar toolbar--plain">
        <div class="chips">${seg("cat", "tops", t("sg_tops"), cat)}${seg("cat", "bottoms", t("sg_bottoms"), cat)}</div>
        <div class="chips">${seg("unit", "cm", "cm", unit)}${seg("unit", "in", "in", unit)}</div>
      </div>
      <div class="table-wrap"><table class="table"><thead><tr>${cols.map((c, i) => `<th scope="col">${esc(c)}${i ? ` [${unit}]` : ""}</th>`).join("")}</tr></thead><tbody>${rows}</tbody></table></div>
    </section>
    <section class="block split">
      <div><h2 class="h2">${esc(t("sg_how"))}</h2><p class="body">${esc(t("sg_how_text"))}</p>
        <p>${esc(t("sg_between"))} <a class="ulink" href="${href("contact")}">${esc(t("sg_ask"))}</a></p></div>
      <div class="ph split__img"><span>[${esc(t("sg_how"))}]</span></div>
    </section>`;
  };

  pages.legal = ([tab]) => {
    const tabs = t("legal_tabs");
    const cur = tabs[tab] ? tab : "privacy";
    const secs = t(cur + "_sections");
    return `<section class="block legal">
      <nav class="chips" aria-label="Legal">${Object.keys(tabs).map((k) => `<a class="chip" href="${href("legal/" + k)}" aria-pressed="${k === cur}">${esc(tabs[k])}</a>`).join("")}</nav>
      <h1 class="h1">${esc(tabs[cur])}</h1>
      <p class="muted">${esc(t("last_updated"))}</p>
      <p class="note">${esc(t("legal_note"))}</p>
      ${secs.map(([h, p]) => `<h2 class="h3">${esc(h)}</h2><p class="body">${esc(p)}</p>`).join("")}
    </section>`;
  };

  pages.notfound = () => `<section class="block narrow nf">
    <p class="nf__code">404</p><h1 class="h1">${esc(t("nf_title"))}</h1><p class="lead-s">${esc(t("nf_sub"))}</p>
    <div class="row-btns"><a class="btn" href="${href("shop")}">${esc(t("go_shop"))}</a><a class="btn btn--ghost" href="${href("")}">${esc(t("home"))}</a></div>
  </section>`;

  // ---------- router ----------
  // English only for now. RU / FR texts stay in i18n.js: add their codes to ACTIVE_LANGS to bring them back.
  const ACTIVE_LANGS = ["en"];
  const detectLang = () => "en";

  function render() {
    const raw = location.hash.replace(/^#\/?/, "");
    const [pathPart, qs] = raw.split("?");
    const parts = pathPart.split("/").filter(Boolean);
    if (!parts.length || !ACTIVE_LANGS.includes(parts[0])) {
      if (parts.length && LANGS[parts[0]]) parts.shift(); // old #/ru/... or #/fr/... links → English
      location.replace("#/" + detectLang() + (parts.length ? "/" + parts.join("/") : "") + (qs ? "?" + qs : ""));
      return;
    }
    lang = parts[0];
    const page = parts[1] || "home";
    const args = parts.slice(2);
    const q = new URLSearchParams(qs || "");
    const fn = pages[page] || pages.notfound;

    document.documentElement.lang = lang;
    const titles = { bag: "nav_bag", shop: "nav_collection", about: "nav_about", how: "nav_how", contact: "nav_contact", size: "size_guide" };
    document.title = (titles[page] ? t(titles[page]) + " — " : "") + SHOP.name;

    app.innerHTML = header(page, fn === pages.home ? "home" : fn === pages.how ? "over" : "") +`<main id="main">${fn(args, q)}</main>` + footer(fn === pages.home);
    const target = q.get("s") && document.getElementById(q.get("s"));
    if (target) target.scrollIntoView(); else window.scrollTo(0, 0);
    bind(page, q);
  }

  function setQuery(key, value) {
    const [path, qs] = location.hash.split("?");
    const q = new URLSearchParams(qs || "");
    if (value) q.set(key, value); else q.delete(key);
    const s = q.toString();
    const y = window.scrollY;
    history.replaceState(null, "", path + (s ? "?" + s : ""));
    render();
    window.scrollTo(0, y);
  }

  // ---------- behaviour ----------
  async function sendForm(form, extra) {
    const status = form.querySelector(".status");
    const btn = form.querySelector("[type=submit]");
    if (!form.checkValidity()) { form.reportValidity(); return false; }
    if (!SHOP.formspreeId) { status.className = "status err"; status.textContent = t("err_config"); return false; }
    const data = new FormData(form);
    for (const k in extra) data.append(k, extra[k]);
    btn.disabled = true; status.className = "status"; status.textContent = t("sending");
    try {
      const res = await fetch("https://formspree.io/f/" + encodeURIComponent(SHOP.formspreeId), { method: "POST", body: data, headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(String(res.status));
      return true;
    } catch {
      btn.disabled = false; status.className = "status err"; status.textContent = t("err_send");
      return false;
    }
  }

  function bind(page, q) {
    const drawer = document.getElementById("drawer");
    const menuBtn = document.getElementById("menu-btn");
    menuBtn.onclick = () => { drawer.hidden = !drawer.hidden; menuBtn.setAttribute("aria-expanded", String(!drawer.hidden)); };


    document.querySelectorAll("[data-q]").forEach((el) => {
      if (el.tagName === "SELECT") el.onchange = () => setQuery(el.dataset.q, el.value);
      else if (el.tagName === "BUTTON") el.onclick = () => setQuery(el.dataset.q, el.dataset.v === "all" ? "" : el.dataset.v);
    });

    if (page === "product") bindProduct();
    if (page === "bag") bindBag();
    if (page === "contact") {
      const f = document.getElementById("contact-form");
      f.onsubmit = async (e) => {
        e.preventDefault();
        if (await sendForm(f, { _subject: "Contact: " + (f.topic.value || ""), language: lang })) {
          f.reset(); const s = f.querySelector(".status"); s.className = "status ok"; s.textContent = t("msg_sent");
          f.querySelector("[type=submit]").disabled = false;
        }
      };
    }
  }

  function bindProduct() {
    const box = document.getElementById("pdp");
    if (!box) return; // unknown product id → 404 page, nothing to bind
    const p = byId(box.dataset.id);
    let color = p.colors[0];
    let size = p.sizes.length === 1 ? p.sizes[0] : null;

    box.querySelectorAll("[data-color]").forEach((b) => (b.onclick = () => {
      color = b.dataset.color;
      box.querySelectorAll("[data-color]").forEach((x) => x.setAttribute("aria-checked", String(x === b)));
      document.getElementById("color-label").textContent = colorName(color);
    }));
    box.querySelectorAll("[data-size]").forEach((b) => (b.onclick = () => {
      size = b.dataset.size;
      box.querySelectorAll("[data-size]").forEach((x) => x.setAttribute("aria-checked", String(x === b)));
      document.getElementById("size-label").textContent = size;
      document.getElementById("size-err").hidden = true;
    }));

    // Add to bag: needs a size; shows "Added to bag — View bag" under the button
    const added = document.getElementById("added");
    document.getElementById("add-to-bag").onclick = () => {
      if (!size) { document.getElementById("size-err").hidden = false; return; }
      bagAdd(p.id, color, size);
      added.hidden = false;
    };
  }

  // Bag page: change quantity / remove, then send one pre-order for everything in the bag
  function bindBag() {
    const list = document.getElementById("bag-list");
    if (!list) return;
    list.addEventListener("change", (e) => {
      const s = e.target.closest("[data-qty]"); if (!s) return;
      const items = bagGet(); items[+s.dataset.qty].qty = +s.value; bagSet(items); render();
    });
    list.addEventListener("click", (e) => {
      const b = e.target.closest("[data-remove]"); if (!b) return;
      const items = bagGet(); items.splice(+b.dataset.remove, 1); bagSet(items); render();
    });
    const form = document.getElementById("bag-form");
    form.onsubmit = async (e) => {
      e.preventDefault();
      const items = bagGet();
      const ref = "MKG-" + Date.now().toString(36).toUpperCase().slice(-6);
      const lines = items.map((i) => ({ product: L(byId(i.id).name), colour: colorName(i.color), size: i.size, qty: i.qty, price: price(byId(i.id)) }));
      const ok = await sendForm(form, {
        items: lines.map((l) => `${l.product} — ${l.colour} / ${l.size} × ${l.qty} [${l.price}]`).join("\n"),
        preorder_number: ref, _subject: "Pre-order " + ref + " (" + bagCount(items) + " pcs)",
      });
      if (!ok) return;
      try {
        sessionStorage.setItem("mkg-last-order", JSON.stringify({ ref, name: form.name.value, email: form.email.value, items: lines, city: form.city.value, country: form.country.value }));
      } catch {}
      bagSet([]);
      location.hash = href("thanks");
    };
  }

  window.addEventListener("hashchange", render);
  render();
})();
