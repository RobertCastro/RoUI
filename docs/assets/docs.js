import { createOverlayController } from "../../dist/primitives/overlay-controller.js";
import { createDisclosureController } from "../../dist/primitives/disclosure-controller.js";
import { createTabsController } from "../../dist/primitives/tabs-controller.js";
import { createComboboxController } from "../../dist/primitives/combobox-controller.js";
import { createGridController } from "../../dist/primitives/grid-controller.js";

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

  /* DISCLOSURES: Menu y Popover comparten la primitiva pública generada. */
  var disclosures = new WeakMap();
  document.querySelectorAll("[data-ro-disclosure-root]").forEach(function (root) {
    disclosures.set(root, createDisclosureController(root));
  });

  /* TABS: patrón accesible con la primitiva pública (roving tabindex). */
  document.querySelectorAll("[data-ro-tabs]").forEach(function (tablist) {
    createTabsController(tablist);
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

  /* ACCORDION: cada sección es un disclosure persistente; se inicializa arriba
     con el bucle de [data-ro-disclosure-root]. */

  /* COMBOBOX: patrón accesible con la primitiva pública (activedescendant + filtrado). */
  document.querySelectorAll("[data-ro-combobox]").forEach(function (root) {
    var list = root.querySelector(".ro-combobox__list");
    var empty = root.querySelector(".ro-combobox__empty");
    createComboboxController(root, {
      onFilter: function (query) {
        var q = query.toLowerCase(), visible = 0;
        list.querySelectorAll('[role="option"]').forEach(function (op) {
          var match = op.textContent.toLowerCase().indexOf(q) !== -1;
          op.hidden = !match; if (match) visible++;
        });
        if (empty) empty.hidden = visible !== 0;
      }
    });
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

  /* CALENDAR: renderiza [data-calendar] como role=grid con navegación por teclado. */
  var MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  var DOW = [["L","Lunes"],["M","Martes"],["X","Miércoles"],["J","Jueves"],["V","Viernes"],["S","Sábado"],["D","Domingo"]];
  document.querySelectorAll("[data-calendar]").forEach(function (cal) {
    var grid = cal.querySelector(".ro-calendar__grid");
    var title = cal.querySelector(".ro-calendar__title");
    var y = +cal.dataset.year, m = +cal.dataset.month;
    var today = +cal.dataset.today || 0, sel = +cal.dataset.selected || 0;
    if (title) { title.id = title.id || ("cal-title-" + y + "-" + m); title.textContent = MONTHS[m] + " " + y; }
    grid.setAttribute("role", "grid");
    if (title && title.id) grid.setAttribute("aria-labelledby", title.id);

    var first = (new Date(y, m, 1).getDay() + 6) % 7;          // lunes primero
    var days = new Date(y, m + 1, 0).getDate();
    var html = '<div class="ro-calendar__row" role="row">' + DOW.map(function (d) {
      return '<div class="ro-calendar__dow" role="columnheader" aria-label="' + d[1] + '">' + d[0] + "</div>";
    }).join("") + "</div>";
    var cells = [];
    for (var i = 0; i < first; i++) cells.push("");
    for (var d = 1; d <= days; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push("");
    for (var w = 0; w < cells.length; w += 7) {
      html += '<div class="ro-calendar__row" role="row">';
      for (var c = w; c < w + 7; c++) {
        var v = cells[c];
        if (v === "") { html += '<div class="ro-calendar__pad" role="gridcell"></div>'; continue; }
        var cls = "ro-calendar__day" + (v === today ? " ro-calendar__day--today" : "");
        html += '<button class="' + cls + '" role="gridcell" tabindex="-1" aria-selected="' + (v === sel)
          + '"' + (v === today ? " data-ro-grid-current" : "")
          + ' aria-label="' + v + " de " + MONTHS[m] + " de " + y + '">' + v + "</button>";
      }
      html += "</div>";
    }
    grid.innerHTML = html;

    createGridController(grid, {
      onSelect: function (day) {
        grid.querySelectorAll('[role="gridcell"][aria-selected="true"]').forEach(function (s) { s.setAttribute("aria-selected", "false"); });
        day.setAttribute("aria-selected", "true");
        var dp = cal.closest("[data-datepicker]");
        if (!dp) return;
        var value = dp.querySelector("[data-datepicker-value]");
        if (value) value.textContent = day.textContent.trim() + " " + MONTHS[m] + " " + y;
        var root = cal.closest("[data-ro-disclosure-root]");
        var disclosure = root ? disclosures.get(root) : null;
        if (disclosure) disclosure.close({ returnFocus: true });
      },
    });
  });

  /* COMMAND PALETTE: combobox en línea dentro del diálogo modal (overlay-controller).
     Escape lo maneja el diálogo; el combobox solo navega, filtra y ejecuta. */
  document.querySelectorAll("[data-ro-cmdk]").forEach(function (cmdk) {
    var overlayRoot = cmdk.closest("[data-ro-overlay-root]");
    var overlay = overlayRoot ? overlays.get(overlayRoot.id) : null;
    var empty = cmdk.querySelector(".ro-cmdk__empty");
    var input = cmdk.querySelector('[role="combobox"]');
    createComboboxController(cmdk, {
      inline: true,
      onFilter: function (query) {
        var q = query.toLowerCase(), any = false;
        cmdk.querySelectorAll('[role="option"]').forEach(function (op) {
          var match = op.textContent.toLowerCase().indexOf(q) !== -1;
          op.hidden = !match; if (match) any = true;
        });
        if (empty) empty.hidden = any;
      },
      onSelect: function () { if (overlay) overlay.close(); },
    });
    document.addEventListener("keydown", function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k" && overlay) {
        e.preventDefault();
        overlay.open();
        if (input) { input.value = ""; input.dispatchEvent(new Event("input")); }
      }
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
