import { createOverlayController } from "../../dist/primitives/overlay-controller.js";

/* docs.js — Interactividad de demostración para la galería.
   Genérico y basado en data-attributes; no es parte de la librería (solo docs). */
(function () {
  "use strict";

  /* Inyecta el sprite de iconos para que <use href="#ro-i-..."> funcione
     en el mismo documento (sin fetch externo en cada <use>). */
  (function injectSprite() {
    var url = new URL("../dist/icons.svg", document.baseURI).href;
    fetch(url).then(function (r) { return r.ok ? r.text() : ""; }).then(function (svg) {
      if (!svg) return;
      var holder = document.createElement("div");
      holder.style.display = "none";
      holder.innerHTML = svg;
      document.body.insertBefore(holder, document.body.firstChild);
    }).catch(function () {});
  })();

  /* DROPDOWNS: [data-dropdown] contiene un trigger [data-dropdown-trigger]
     y un panel .ro-menu. Click = toggle; click fuera o Esc = cerrar. */
  function closeAllMenus(except) {
    document.querySelectorAll(".ro-menu.is-open, .ro-popover.is-open").forEach(function (m) {
      if (m !== except) m.classList.remove("is-open");
    });
  }
  document.querySelectorAll("[data-dropdown]").forEach(function (dd) {
    var trigger = dd.querySelector("[data-dropdown-trigger]");
    var menu = dd.querySelector(".ro-menu, .ro-popover");
    if (!trigger || !menu) return;
    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      var willOpen = !menu.classList.contains("is-open");
      closeAllMenus(menu);
      menu.classList.toggle("is-open", willOpen);
      trigger.setAttribute("aria-expanded", String(willOpen));
    });
    menu.addEventListener("click", function (e) {
      var item = e.target.closest(".ro-menu__item");
      if (!item) return;
      // selección única (workspace): marca aria-current si el grupo lo pide
      if (menu.hasAttribute("data-single")) {
        menu.querySelectorAll(".ro-menu__item").forEach(function (it) {
          it.setAttribute("aria-current", String(it === item));
        });
      }
      if (!item.hasAttribute("data-keep-open")) menu.classList.remove("is-open");
    });
  });
  document.addEventListener("click", function () { closeAllMenus(null); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAllMenus(null); });

  /* TABS: [data-tabs="id"] con .ro-tab[data-tab=key]
     + panel container [data-tab-panels="id"] con hijos [data-panel=key] */
  document.querySelectorAll("[data-tabs]").forEach(function (tabs) {
    var id = tabs.getAttribute("data-tabs");
    var panels = document.querySelector('[data-tab-panels="' + id + '"]');
    tabs.addEventListener("click", function (e) {
      var btn = e.target.closest(".ro-tab");
      if (!btn) return;
      tabs.querySelectorAll(".ro-tab").forEach(function (b) {
        b.classList.toggle("ro-tab--active", b === btn);
      });
      if (!panels) return;
      var key = btn.getAttribute("data-tab");
      panels.querySelectorAll("[data-panel]").forEach(function (p) {
        p.hidden = p.getAttribute("data-panel") !== key;
      });
    });
  });

  /* GRUPOS DE SELECCIÓN ÚNICA: pills y nav-links.
     [data-select="cls"] donde cls = la clase de modificador activo.
     Opcional: [data-output="<selector>"] para escribir el item elegido. */
  document.querySelectorAll("[data-select]").forEach(function (group) {
    var activeCls = group.getAttribute("data-select");          // p.ej. ro-pill--active
    var itemSel = "." + activeCls.split("--")[0];               // p.ej. .ro-pill
    var out = group.getAttribute("data-output")
      ? document.querySelector(group.getAttribute("data-output")) : null;
    var prefix = group.getAttribute("data-output-prefix") || "";
    group.addEventListener("click", function (e) {
      var item = e.target.closest(itemSel);
      if (!item || !group.contains(item)) return;
      e.preventDefault();
      group.querySelectorAll(itemSel).forEach(function (el) {
        el.classList.toggle(activeCls, el === item);
      });
      if (out) {
        var label = item.getAttribute("data-label") || item.textContent.trim();
        out.textContent = prefix + label;
      }
    });
  });

  /* OVERLAYS: la demo consume la primitiva pública generada. */
  var overlays = new Map();
  document.querySelectorAll("[data-ro-overlay-root]").forEach(function (root) {
    overlays.set(root.id, createOverlayController(root));
  });
  document.querySelectorAll("[data-ro-overlay-open]").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      var overlay = overlays.get(trigger.getAttribute("data-ro-overlay-open"));
      if (overlay) overlay.open(trigger);
    });
  });

  /* TOAST: [data-toast="success|error|info"] [data-toast-msg="..."] dispara un toast. */
  var TOAST_ICONS = { success: "circle-check", error: "triangle-alert", info: "info" };
  function ensureRegion() {
    var r = document.querySelector(".ro-toast-region");
    if (!r) { r = document.createElement("div"); r.className = "ro-toast-region"; document.body.appendChild(r); }
    return r;
  }
  function toast(variant, msg) {
    var el = document.createElement("div");
    el.className = "ro-toast ro-toast--" + variant;
    el.innerHTML =
      '<svg class="ro-icon ro-icon--sm ro-toast__icon"><use href="#ro-i-' + (TOAST_ICONS[variant] || "info") + '"></use></svg>' +
      '<div class="ro-toast__body">' + msg + '</div>' +
      '<button class="ro-toast__close" aria-label="Cerrar"><svg class="ro-icon ro-icon--xs"><use href="#ro-i-x"></use></svg></button>';
    ensureRegion().appendChild(el);
    var remove = function () { el.classList.add("is-leaving"); setTimeout(function () { el.remove(); }, 160); };
    el.querySelector(".ro-toast__close").addEventListener("click", remove);
    setTimeout(remove, 3500);
  }
  document.querySelectorAll("[data-toast]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      toast(btn.getAttribute("data-toast"), btn.getAttribute("data-toast-msg") || "Notificación de ejemplo");
    });
  });

  /* TAG removible: clic en .ro-tag__close elimina su .ro-tag. */
  document.addEventListener("click", function (e) {
    var close = e.target.closest(".ro-tag__close");
    if (close) { var t = close.closest(".ro-tag"); if (t) t.remove(); }
  });

  /* DEMO: botón con carga temporal [data-loading-demo]. */
  document.querySelectorAll("[data-loading-demo]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (btn.classList.contains("is-loading")) return;
      btn.classList.add("is-loading");
      setTimeout(function () { btn.classList.remove("is-loading"); }, 1600);
    });
  });

  /* ACCORDION: clic en .ro-accordion__head alterna .is-open del item. */
  document.querySelectorAll(".ro-accordion").forEach(function (acc) {
    var single = acc.hasAttribute("data-single");
    acc.addEventListener("click", function (e) {
      var head = e.target.closest(".ro-accordion__head");
      if (!head) return;
      var item = head.closest(".ro-accordion__item");
      var willOpen = !item.classList.contains("is-open");
      if (single) acc.querySelectorAll(".ro-accordion__item").forEach(function (i) { i.classList.remove("is-open"); });
      item.classList.toggle("is-open", willOpen);
    });
  });

  /* COMBOBOX: filtra opciones al escribir; clic en opción rellena el input. */
  document.querySelectorAll(".ro-combobox").forEach(function (cb) {
    var input = cb.querySelector("input");
    var list = cb.querySelector(".ro-combobox__list");
    var empty = cb.querySelector(".ro-combobox__empty");
    if (!input || !list) return;
    function filter() {
      var q = input.value.toLowerCase(); var visible = 0;
      list.querySelectorAll(".ro-combobox__option").forEach(function (op) {
        var match = op.textContent.toLowerCase().indexOf(q) !== -1;
        op.hidden = !match; if (match) visible++;
      });
      if (empty) empty.hidden = visible !== 0;
    }
    input.addEventListener("focus", function () { cb.classList.add("is-open"); });
    input.addEventListener("input", function () { cb.classList.add("is-open"); filter(); });
    list.addEventListener("click", function (e) {
      var op = e.target.closest(".ro-combobox__option");
      if (!op) return;
      input.value = op.textContent.trim(); cb.classList.remove("is-open");
    });
    document.addEventListener("click", function (e) { if (!cb.contains(e.target)) cb.classList.remove("is-open"); });
  });

  /* TAGS INPUT: Enter agrega un chip; Backspace en vacío borra el último. */
  document.querySelectorAll(".ro-tags-input").forEach(function (wrap) {
    var field = wrap.querySelector(".ro-tags-input__field");
    if (!field) return;
    function addTag(text) {
      var t = document.createElement("span");
      t.className = "ro-tag";
      t.innerHTML = text + ' <button class="ro-tag__close" aria-label="Quitar"><svg class="ro-icon ro-icon--xs"><use href="#ro-i-x"></use></svg></button>';
      wrap.insertBefore(t, field);
    }
    field.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && field.value.trim()) { e.preventDefault(); addTag(field.value.trim()); field.value = ""; }
      else if (e.key === "Backspace" && !field.value) {
        var tags = wrap.querySelectorAll(".ro-tag"); if (tags.length) tags[tags.length - 1].remove();
      }
    });
  });

  /* RATING: clic en estrella marca hasta esa posición. */
  document.querySelectorAll(".ro-rating").forEach(function (rt) {
    if (rt.classList.contains("ro-rating--readonly")) return;
    var stars = [].slice.call(rt.querySelectorAll(".ro-rating__star"));
    rt.addEventListener("click", function (e) {
      var star = e.target.closest(".ro-rating__star");
      if (!star) return;
      var idx = stars.indexOf(star);
      stars.forEach(function (s, i) { s.classList.toggle("is-active", i <= idx); });
    });
  });

  /* DROPZONE: estado de arrastre (demo). */
  document.querySelectorAll(".ro-dropzone").forEach(function (dz) {
    var input = dz.querySelector('input[type="file"]');
    dz.addEventListener("click", function () { if (input) input.click(); });
    ["dragenter", "dragover"].forEach(function (ev) {
      dz.addEventListener(ev, function (e) { e.preventDefault(); dz.classList.add("is-dragover"); });
    });
    ["dragleave", "drop"].forEach(function (ev) {
      dz.addEventListener(ev, function (e) { e.preventDefault(); dz.classList.remove("is-dragover"); });
    });
  });

  /* SLIDER: refleja el valor en [data-slider-output]. */
  document.querySelectorAll(".ro-slider[data-output]").forEach(function (sl) {
    var out = document.querySelector(sl.getAttribute("data-output"));
    var sync = function () { if (out) out.textContent = sl.value; };
    sl.addEventListener("input", sync); sync();
  });

  /* CALENDAR: renderiza [data-calendar] con year/month(0-based)/today/selected. */
  var MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  document.querySelectorAll("[data-calendar]").forEach(function (cal) {
    var grid = cal.querySelector(".ro-calendar__grid");
    var title = cal.querySelector(".ro-calendar__title");
    var y = +cal.dataset.year, m = +cal.dataset.month;
    var today = +cal.dataset.today || 0, sel = +cal.dataset.selected || 0;
    if (title) title.textContent = MONTHS[m] + " " + y;
    var html = ["L","M","X","J","V","S","D"].map(function (d) { return '<div class="ro-calendar__dow">' + d + "</div>"; }).join("");
    var first = (new Date(y, m, 1).getDay() + 6) % 7;          // lunes primero
    var days = new Date(y, m + 1, 0).getDate();
    for (var i = 0; i < first; i++) html += "<div></div>";
    for (var d = 1; d <= days; d++) {
      var cls = "ro-calendar__day";
      if (d === today) cls += " ro-calendar__day--today";
      if (d === sel) cls += " ro-calendar__day--selected";
      html += '<button class="' + cls + '">' + d + "</button>";
    }
    grid.innerHTML = html;
    grid.addEventListener("click", function (e) {
      var day = e.target.closest(".ro-calendar__day"); if (!day) return;
      grid.querySelectorAll(".ro-calendar__day--selected").forEach(function (s) { s.classList.remove("ro-calendar__day--selected"); });
      day.classList.add("ro-calendar__day--selected");
      var dp = cal.closest("[data-datepicker]");
      if (dp) { var inp = dp.querySelector("input"); if (inp) inp.value = day.textContent + " " + MONTHS[m] + " " + y;
        var menu = cal.closest(".ro-popover"); if (menu) menu.classList.remove("is-open"); }
    });
  });

  /* COMMAND PALETTE: abre con [data-cmdk-open] o ⌘K/Ctrl+K; filtra; Esc cierra. */
  document.querySelectorAll(".ro-cmdk-overlay").forEach(function (ov) {
    var input = ov.querySelector("input");
    function open() { ov.classList.add("is-open"); if (input) { input.value = ""; filter(); setTimeout(function () { input.focus(); }, 30); } }
    function close() { ov.classList.remove("is-open"); }
    function filter() {
      var q = (input ? input.value : "").toLowerCase(); var any = false;
      ov.querySelectorAll(".ro-cmdk__item").forEach(function (it) {
        var match = it.textContent.toLowerCase().indexOf(q) !== -1; it.hidden = !match; if (match) any = true;
      });
      var empty = ov.querySelector(".ro-cmdk__empty"); if (empty) empty.hidden = any;
    }
    document.querySelectorAll('[data-cmdk-open="' + ov.id + '"]').forEach(function (b) { b.addEventListener("click", open); });
    if (input) input.addEventListener("input", filter);
    ov.addEventListener("click", function (e) { if (e.target === ov) close(); });
    document.addEventListener("keydown", function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); open(); }
      if (e.key === "Escape") close();
    });
  });

  /* TREE: clic en fila con hijos alterna el nodo. */
  document.querySelectorAll(".ro-tree").forEach(function (tree) {
    tree.addEventListener("click", function (e) {
      var row = e.target.closest(".ro-tree__row"); if (!row) return;
      var item = row.closest(".ro-tree__item");
      if (item && item.querySelector(".ro-tree__children")) item.classList.toggle("is-open");
      tree.querySelectorAll(".ro-tree__row--active").forEach(function (r) { r.classList.remove("ro-tree__row--active"); });
      row.classList.add("ro-tree__row--active");
    });
  });

  /* NUMBER INPUT: botones − / +. */
  document.querySelectorAll(".ro-number").forEach(function (n) {
    var input = n.querySelector("input");
    n.querySelectorAll(".ro-number__btn").forEach(function (b) {
      b.addEventListener("click", function () {
        var step = b.dataset.step === "-" ? -1 : 1;
        var v = parseInt(input.value || "0", 10) + step;
        var min = input.min !== "" ? +input.min : -Infinity, max = input.max !== "" ? +input.max : Infinity;
        input.value = Math.max(min, Math.min(max, v));
      });
    });
  });
})();
