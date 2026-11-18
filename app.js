(function () {
  "use strict";

  // ---------- helpers ----------
  const app = document.getElementById("app");
  const LS_KEY = "mkg-lang";
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
  const price = (p) => (p.price == null ? t("price_tba") : p.price.toLocaleString(lang) + " " + SHOP.currency);
  const colorName = (c) => (COLORS[c] ? COLORS[c][lang] || COLORS[c].en : c);
  const byId = (id) => PRODUCTS.find((p) => p.id === id);

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
    return `<a class="card" href="${href("product/" + p.id)}">
      <div class="card__media">${media(p, 0)}${second}
        <span class="badge">${esc(p.status === "soon" ? t("badge_soon") : t("badge_preorder"))}</span></div>
      <div class="card__info">
        <div class="card__row"><span class="card__name">${esc(L(p.name))}</span><span>${esc(price(p))}</span></div>
        ${swatches(p)}
      </div></a>`;
  }

  // ---------- layout ----------
  function header(active) {
    const links = [["shop", "nav_shop"], ["about", "nav_about"], ["how", "nav_how"], ["contact", "nav_contact"]];
    const nav = links.map(([p, k]) => `<a href="${href(p)}"${active === p ? ' aria-current="page"' : ""}>${esc(t(k))}</a>`).join("");
    const opts = Object.keys(LANGS).map((l) => `<option value="${l}"${l === lang ? " selected" : ""}>${l.toUpperCase()}</option>`).join("");
    return `
      <div class="announce">${esc(t("announce"))}</div>
      <header class="header">
        <button class="icon-btn menu-btn" id="menu-btn" aria-label="${esc(t("menu"))}" aria-expanded="false">
          <svg width="20" height="14" viewBox="0 0 20 14" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M0 1h20M0 7h20M0 13h20"/></svg>
        </button>
        <nav class="nav" aria-label="Main">${nav}</nav>
        <a class="logo" href="${href("")}">${esc(SHOP.name)}</a>
        <label class="lang"><span class="sr">Language</span><select id="lang-select">${opts}</select></label>
      </header>
      <nav class="drawer" id="drawer" hidden>${nav}</nav>`;
  }

  function footer() {
    const soc = [];
    if (SHOP.instagram) soc.push(`<a href="https://instagram.com/${esc(SHOP.instagram)}" target="_blank" rel="noopener">Instagram</a>`);
    if (SHOP.tiktok) soc.push(`<a href="https://tiktok.com/@${esc(SHOP.tiktok)}" target="_blank" rel="noopener">TikTok</a>`);
    if (!soc.length) soc.push(`<span>Instagram</span>`, `<span>TikTok</span>`);
    return `<footer class="footer">
      <div class="footer__grid">
        <div><p class="footer__brand">${esc(SHOP.shortName)}</p><p class="muted">${t("hero_title")}</p></div>
        <div><p class="footer__h">${esc(t("f_shop"))}</p><a href="${href("shop")}">${esc(t("f_all_products"))}</a><a href="${href("shop")}">${esc(t("f_new"))}</a></div>
        <div><p class="footer__h">${esc(t("f_help"))}</p><a href="${href("how")}">${esc(t("nav_how"))}</a><a href="${href("how?s=faq")}">FAQ</a><a href="${href("size")}">${esc(t("size_guide"))}</a><a href="${href("contact")}">${esc(t("nav_contact"))}</a></div>
        <div><p class="footer__h">${esc(t("f_follow"))}</p>${soc.join("")}</div>
      </div>
      <div class="footer__bottom"><span>© ${new Date().getFullYear()} ${esc(SHOP.name)}</span>
        <span><a href="${href("legal/privacy")}">${esc(t("legal_tabs").privacy)}</a><a href="${href("legal/terms")}">${esc(t("terms"))}</a></span></div>
    </footer>`;
  }

  function langBanner() {
    if (store.get(LS_KEY)) return "";
    const nav = (navigator.languages || [navigator.language || "en"]).map((l) => l.slice(0, 2).toLowerCase());
    const pref = nav.find((l) => LANGS[l]);
    if (!pref || pref === lang) return "";
    return `<div class="lang-banner" id="lang-banner">
      <span>${esc(T[pref].lang_banner.replace("{lang}", LANGS[pref]))}</span>
      <button class="ulink" data-lang="${pref}">${esc(T[pref].lang_switch)}</button>
      <button class="ulink muted-link" data-stay="1">${esc(t("lang_stay"))}</button>
    </div>`;
  }

  // ---------- pages ----------
  const pages = {};

  pages.home = () => {
    const fresh = PRODUCTS.filter((p) => p.isNew).slice(0, 4);
    const list = (fresh.length ? fresh : PRODUCTS.slice(0, 4)).map(card).join("");
    const comm = [0, 1, 2, 3].map((i) => photoOr(SHOP.communityImages[i], t("community_ph"), "sq")).join("");
    return `
    <section class="hero" ${SHOP.heroImage ? `style="background-image:url('${esc(SHOP.heroImage)}')"` : ""}>
      <div class="hero__content">
        <h1 class="hero__title">${t("hero_title")}</h1>
        <a class="btn btn--light" href="${href("shop")}">${esc(t("hero_cta"))}</a>
      </div>
    </section>
    <section class="block center">
      <p class="eyebrow">${esc(t("vision_eyebrow"))}</p>
      <p class="lead">${esc(t("vision_text"))}</p>
      <a class="ulink" href="${href("about")}">${esc(t("our_story"))} →</a>
    </section>
    <section class="block">
      <div class="row-head"><h2 class="h2">${esc(t("new_arrivals"))}</h2><a class="ulink" href="${href("shop")}">${esc(t("view_all"))}</a></div>
      <div class="grid">${list}</div>
    </section>
    <section class="band">
      <div class="block">
        <p class="eyebrow">${esc(t("how_eyebrow"))}</p>
        <h2 class="h2">${esc(t("how_title"))}</h2>
        <div class="steps">${t("steps3").map(([h, d], i) => `<div><span class="num">0${i + 1}</span><h3>${esc(h)}</h3><p>${esc(d)}</p></div>`).join("")}</div>
        <a class="btn btn--ghost" href="${href("how")}">${esc(t("learn_more"))}</a>
      </div>
    </section>
    <section class="block center">
      <h2 class="h2 h2--big">${t("community_title")}</h2>
      <div class="comm">${comm}</div>
      ${SHOP.instagram ? `<a class="btn btn--ghost" href="https://instagram.com/${esc(SHOP.instagram)}" target="_blank" rel="noopener">${esc(t("follow_us"))} @${esc(SHOP.instagram)}</a>` : ""}
    </section>`;
  };

  // Shop state lives in the URL query: #/en/shop?cat=tops&color=black&size=M&sort=new
  pages.shop = (_, q) => {
    const cat = q.get("cat") || "all", color = q.get("color") || "", size = q.get("size") || "", sort = q.get("sort") || "new";
    let list = PRODUCTS.filter((p) => (cat === "all" || p.category === cat) && (!color || p.colors.includes(color)) && (!size || p.sizes.includes(size)));
    if (sort === "low" || sort === "high") {
      list = list.slice().sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
      if (sort === "high") list.reverse();
    } else list = list.slice().sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));

    const cats = ["all", ...Object.keys(T.en.cats).filter((c) => PRODUCTS.some((p) => p.category === c))];
    const chip = (c) => `<button class="chip" data-q="cat" data-v="${c}" aria-pressed="${c === cat}">${esc(c === "all" ? t("cat_all") : t("cats")[c])}</button>`;
    const colors = [...new Set(PRODUCTS.flatMap((p) => p.colors))];
    const sizes = [...new Set(PRODUCTS.flatMap((p) => p.sizes))];
    const sel = (name, label, items, cur, lab) => `<label class="sel">${esc(label)}<select data-q="${name}">
      ${items.map(([v, txt]) => `<option value="${esc(v)}"${v === cur ? " selected" : ""}>${esc(txt)}</option>`).join("")}</select></label>`;
    return `
    <section class="block page-head">
      <p class="eyebrow"><a href="${href("")}">${esc(t("crumbs_home"))}</a> / ${esc(t("shop_title"))}</p>
      <h1 class="h1">${esc(t("shop_title"))}</h1>
      <p class="muted">${esc(t("shop_sub"))}</p>
    </section>
    <section class="block toolbar-wrap">
      <div class="chips" role="group" aria-label="Category">${cats.map(chip).join("")}</div>
      <div class="toolbar">
        <div class="toolbar__l">
          ${sel("color", t("f_colour"), [["", t("f_all")], ...colors.map((c) => [c, colorName(c)])], color)}
          ${sel("size", t("f_size"), [["", t("f_all")], ...sizes.map((s) => [s, s])], size)}
        </div>
        <div class="toolbar__r">
          <span class="muted">${esc(t("n_products", { n: list.length }))}</span>
          ${sel("sort", t("sort"), [["new", t("sort_new")], ["low", t("sort_low")], ["high", t("sort_high")]], sort)}
        </div>
      </div>
    </section>
    <section class="grid grid--edge">${list.length ? list.map(card).join("") : `<p class="block muted">${esc(t("empty"))}</p>`}</section>`;
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

        <button class="btn btn--full" id="open-preorder" ${canOrder ? "" : "disabled"}>${esc(canOrder ? t("preorder_btn") : t("badge_soon"))}</button>
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
    <section class="grid grid--edge">${more.map(card).join("")}</section>
    ${preorderDialog(p)}`;
  };

  const COUNTRY_CODES = "AF AX AL DZ AD AO AI AG AR AM AW AU AT AZ BS BH BD BB BY BE BZ BJ BM BT BO BA BW BR BN BG BF BI CV KH CM CA KY CF TD CL CN CO KM CG CD CR CI HR CU CW CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FO FJ FI FR GF PF GA GM GE DE GH GI GR GL GD GP GU GT GG GN GW GY HT HN HK HU IS IN ID IR IQ IE IM IL IT JM JP JE JO KZ KE KI KW KG LA LV LB LS LR LY LI LT LU MO MG MW MY MV ML MT MH MQ MR MU YT MX FM MD MC MN ME MS MA MZ MM NA NR NP NL NC NZ NI NE NG MK NO OM PK PW PS PA PG PY PE PH PL PT PR QA RE RO RU RW BL KN LC MF PM VC WS SM ST SA SN RS SC SL SG SX SK SI SB SO ZA KR SS ES LK SD SR SE CH SY TW TJ TZ TH TL TG TO TT TN TR TM TC TV UG UA AE GB US UY UZ VU VA VE VN VG VI WF EH YE ZM ZW".split(" ");
  function countryOptions() {
    let dn = null;
    try { dn = new Intl.DisplayNames([lang], { type: "region" }); } catch {}
    const list = COUNTRY_CODES.map((c) => [c, dn ? dn.of(c) : c]).sort((a, b) => a[1].localeCompare(b[1], lang));
    return `<option value="">${esc(t("choose_country"))}</option>` + list.map(([c, n]) => `<option value="${esc(n)}">${esc(n)}</option>`).join("");
  }
  const req = (label) => `${esc(label)} *`;
  const opt = (label) => `${esc(label)} <span class="muted">(${esc(t("optional"))})</span>`;
  const consent = () => `<label class="check"><input type="checkbox" name="consent" value="yes" required><span>${t("consent", { privacy: `<a href="${href("legal/privacy")}" target="_blank">${esc(t("privacy_link"))}</a>` })} *</span></label>`;

  function preorderDialog(p) {
    return `<dialog class="modal" id="po-modal" aria-labelledby="po-title">
      <form class="modal__body" id="po-form" novalidate>
        <button type="button" class="modal__close" data-close aria-label="${esc(t("close"))}"><svg width="14" height="14" viewBox="0 0 14 14" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M1 1l12 12M13 1L1 13"/></svg></button>
        <div><h2 id="po-title" class="h3">${esc(t("po_title"))}</h2><p class="muted small">${esc(t("po_sub"))}</p></div>
        <div class="po-item"><div class="po-item__img">${media(p, 0)}</div><div><strong>${esc(L(p.name))}</strong><br><span class="muted">${esc(price(p))}</span></div></div>
        <div class="fields fields--3">
          <label class="field">${esc(t("colour"))}<select name="colour" id="po-colour">${p.colors.map((c) => `<option value="${c}">${esc(colorName(c))}</option>`).join("")}</select></label>
          <label class="field">${esc(t("size"))}<select name="size" id="po-size">${p.sizes.map((s) => `<option>${esc(s)}</option>`).join("")}</select></label>
          <label class="field">${esc(t("quantity"))}<select name="quantity">${[1, 2, 3, 4, 5].map((n) => `<option>${n}</option>`).join("")}</select></label>
        </div>
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
    </dialog>`;
  }

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
        ${row(o.product, o.price)}${row(t("colour_size"), o.colour + " / " + o.size + (o.quantity > 1 ? " × " + o.quantity : ""))}
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

  pages.how = () => `
    <section class="block page-head">
      <p class="eyebrow">${esc(t("how_eyebrow"))}</p>
      <h1 class="h1">${esc(t("how_page_title"))}</h1>
      <p class="lead-s">${esc(t("how_page_sub"))}</p>
    </section>
    <section class="block"><ol class="steps4">${t("steps4").map(([h, d], i) => `<li><span class="muted">${esc(t("step"))} ${i + 1}</span><h2 class="h3">${esc(h)}</h2><p>${esc(d)}</p></li>`).join("")}</ol></section>
    <section class="band" id="faq"><div class="block faq">
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
      <div class="table-wrap"><table class="table"><thead><tr>${cols.map((c, i) => `<th scope="col">${esc(c)}${i ? ` (${unit})` : ""}</th>`).join("")}</tr></thead><tbody>${rows}</tbody></table></div>
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
  function detectLang() {
    const saved = store.get(LS_KEY);
    if (saved && LANGS[saved]) return saved;
    const nav = (navigator.languages || [navigator.language || "en"]).map((l) => l.slice(0, 2).toLowerCase());
    return nav.find((l) => LANGS[l]) || "en";
  }

  function render() {
    const raw = location.hash.replace(/^#\/?/, "");
    const [pathPart, qs] = raw.split("?");
    const parts = pathPart.split("/").filter(Boolean);
    if (!parts.length || !LANGS[parts[0]]) {
      location.replace("#/" + detectLang() + (parts.length ? "/" + parts.join("/") : ""));
      return;
    }
    lang = parts[0];
    const page = parts[1] || "home";
    const args = parts.slice(2);
    const q = new URLSearchParams(qs || "");
    const fn = pages[page] || pages.notfound;

    document.documentElement.lang = lang;
    const titles = { shop: "nav_shop", about: "nav_about", how: "nav_how", contact: "nav_contact", size: "size_guide" };
    document.title = (titles[page] ? t(titles[page]) + " — " : "") + SHOP.name;

    app.innerHTML = langBanner() + header(page) + `<main id="main">${fn(args, q)}</main>` + footer();
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

    document.getElementById("lang-select").onchange = (e) => switchLang(e.target.value);
    const banner = document.getElementById("lang-banner");
    if (banner) banner.onclick = (e) => {
      const b = e.target.closest("button"); if (!b) return;
      if (b.dataset.lang) switchLang(b.dataset.lang);
      else { store.set(LS_KEY, lang); banner.remove(); }
    };

    document.querySelectorAll("[data-q]").forEach((el) => {
      if (el.tagName === "SELECT") el.onchange = () => setQuery(el.dataset.q, el.value);
      else if (el.tagName === "BUTTON") el.onclick = () => setQuery(el.dataset.q, el.dataset.v === "all" ? "" : el.dataset.v);
    });

    if (page === "product") bindProduct();
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

    const modal = document.getElementById("po-modal");
    const form = document.getElementById("po-form");
    document.getElementById("open-preorder").onclick = () => {
      if (!size) { document.getElementById("size-err").hidden = false; return; }
      form.querySelector("#po-colour").value = color;
      form.querySelector("#po-size").value = size;
      modal.showModal();
    };
    modal.querySelector("[data-close]").onclick = () => modal.close();
    modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });

    form.onsubmit = async (e) => {
      e.preventDefault();
      const ref = "MKG-" + Date.now().toString(36).toUpperCase().slice(-6);
      const colourName = colorName(form.colour.value);
      const ok = await sendForm(form, {
        product: L(p.name) + " (" + p.id + ")", price: price(p), colour_name: colourName,
        preorder_number: ref, language: lang, _subject: "Pre-order " + ref + ": " + L(p.name),
      });
      if (!ok) return;
      try {
        sessionStorage.setItem("mkg-last-order", JSON.stringify({
          ref, name: form.name.value, email: form.email.value, product: L(p.name), price: price(p),
          colour: colourName, size: form.size.value, quantity: +form.quantity.value, city: form.city.value, country: form.country.value,
        }));
      } catch {}
      modal.close();
      location.hash = href("thanks");
    };
  }

  function switchLang(l) {
    store.set(LS_KEY, l);
    location.hash = location.hash.replace(/^#\/[a-z]{2}/, "#/" + l);
  }

  window.addEventListener("hashchange", render);
  render();
})();
