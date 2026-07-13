const TAB = "[role='tab']";

function tabs(tablist) {
  return [...tablist.querySelectorAll(TAB)].filter((tab) => (
    !tab.hidden
    && !tab.hasAttribute("disabled")
    && tab.getAttribute("aria-disabled") !== "true"
    && typeof tab.focus === "function"
  ));
}

/**
 * Comportamiento sin marca para el patron Tabs (WAI-ARIA).
 * El marcado conserva roles, nombres y relaciones (`role=tab/tablist/tabpanel`,
 * `aria-selected`, `aria-controls`); el controlador gestiona seleccion, roving
 * tabindex, visibilidad del panel y teclado.
 */
export function createTabsController(tablist, options = {}) {
  if (!tablist || !tablist.ownerDocument) {
    throw new TypeError("tablist debe ser un elemento del documento");
  }
  const document = tablist.ownerDocument;
  const manual = options.manual === undefined
    ? tablist.hasAttribute("data-ro-tabs-manual")
    : Boolean(options.manual);
  const vertical = tablist.getAttribute("aria-orientation") === "vertical";
  const nextKey = vertical ? "ArrowDown" : "ArrowRight";
  const prevKey = vertical ? "ArrowUp" : "ArrowLeft";

  function panelFor(tab) {
    const id = tab.getAttribute("aria-controls");
    return id ? document.getElementById(id) : null;
  }

  function select(tab, { focus = true } = {}) {
    const list = tabs(tablist);
    if (!list.includes(tab)) return;
    list.forEach((entry) => {
      const selected = entry === tab;
      entry.setAttribute("aria-selected", String(selected));
      entry.setAttribute("tabindex", selected ? "0" : "-1");
      const panel = panelFor(entry);
      if (panel) panel.hidden = !selected;
    });
    if (focus) tab.focus({ preventScroll: true });
  }

  function focusedIndex(list) {
    const active = list.indexOf(document.activeElement);
    if (active >= 0) return active;
    const selected = list.findIndex((tab) => tab.getAttribute("aria-selected") === "true");
    return selected >= 0 ? selected : 0;
  }

  function goTo(target) {
    if (manual) target.focus({ preventScroll: true });
    else select(target);
  }

  function move(step) {
    const list = tabs(tablist);
    if (list.length === 0) return;
    const index = focusedIndex(list);
    goTo(list[(index + step + list.length) % list.length]);
  }

  function edge(position) {
    const list = tabs(tablist);
    if (list.length === 0) return;
    goTo(position === "end" ? list[list.length - 1] : list[0]);
  }

  function onKeydown(event) {
    if (event.key === nextKey) { event.preventDefault(); move(1); }
    else if (event.key === prevKey) { event.preventDefault(); move(-1); }
    else if (event.key === "Home") { event.preventDefault(); edge("home"); }
    else if (event.key === "End") { event.preventDefault(); edge("end"); }
    else if (manual && (event.key === "Enter" || event.key === " ")) {
      const tab = event.target.closest(TAB);
      if (tab && tablist.contains(tab)) { event.preventDefault(); select(tab); }
    }
  }

  function onClick(event) {
    const tab = event.target.closest(TAB);
    if (tab && tablist.contains(tab)) select(tab);
  }

  // Estado inicial derivado del marcado: respeta la pestana marcada o la primera.
  const initialList = tabs(tablist);
  const initial = initialList.find((tab) => tab.getAttribute("aria-selected") === "true")
    || initialList[0];
  if (initial) select(initial, { focus: false });

  tablist.addEventListener("keydown", onKeydown);
  tablist.addEventListener("click", onClick);

  return {
    tablist,
    select,
    destroy() {
      tablist.removeEventListener("keydown", onKeydown);
      tablist.removeEventListener("click", onClick);
    },
  };
}
