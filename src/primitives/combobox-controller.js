const OPTION = "[role='option']";

/**
 * Comportamiento sin marca para el patron Combobox con lista emergente
 * (WAI-ARIA). El marcado conserva `role=combobox`/`role=listbox`/`role=option`,
 * `aria-expanded`, `aria-controls` y `aria-activedescendant`; el controlador
 * gestiona apertura, opcion activa (sin mover el foco del input), seleccion,
 * filtrado y teclado. Sirve tambien como base del Command Palette.
 */
export function createComboboxController(root, options = {}) {
  if (!root || !root.ownerDocument) {
    throw new TypeError("root debe ser un elemento del documento");
  }
  const document = root.ownerDocument;
  const input = options.input || root.querySelector("[role='combobox']");
  const listbox = options.listbox || root.querySelector("[role='listbox']");
  if (!input || !listbox) {
    throw new TypeError("combobox requiere un input[role=combobox] y un [role=listbox]");
  }
  const onFilter = typeof options.onFilter === "function" ? options.onFilter : null;
  const onSelect = typeof options.onSelect === "function" ? options.onSelect : null;
  // Modo inline: la lista siempre está visible (p. ej. Command Palette dentro de
  // un diálogo). No abre/cierra por sí misma, no captura Escape ni el pointer
  // exterior; solo navega, filtra y ejecuta la selección.
  const inline = options.inline === undefined
    ? root.hasAttribute("data-ro-combobox-inline")
    : Boolean(options.inline);
  let active = null;

  function visibleOptions() {
    return [...listbox.querySelectorAll(OPTION)].filter((option) => !option.hidden);
  }
  function setActive(option) {
    active = option || null;
    [...listbox.querySelectorAll(OPTION)].forEach((o) => {
      o.setAttribute("aria-selected", String(o === active));
    });
    if (active) input.setAttribute("aria-activedescendant", active.getAttribute("id") || "");
    else input.removeAttribute("aria-activedescendant");
  }
  function isOpen() { return input.getAttribute("aria-expanded") === "true"; }
  function open() {
    if (inline || isOpen()) return;
    input.setAttribute("aria-expanded", "true");
    listbox.hidden = false;
    document.addEventListener("pointerdown", onOutside);
  }
  function close({ clearActive = true } = {}) {
    if (inline || !isOpen()) return;
    input.setAttribute("aria-expanded", "false");
    listbox.hidden = true;
    if (clearActive) setActive(null);
    document.removeEventListener("pointerdown", onOutside);
  }
  function selectOption(option, { focus = true } = {}) {
    if (!option) return;
    const value = (option.getAttribute("data-value") || option.textContent || "").trim();
    if (onSelect) onSelect(option, value);
    if (inline) return;
    input.value = value;
    close();
    if (focus && typeof input.focus === "function") input.focus();
  }
  function move(step) {
    const list = visibleOptions();
    if (list.length === 0) return;
    if (!isOpen()) open();
    let index = list.indexOf(active);
    index = index < 0
      ? (step > 0 ? 0 : list.length - 1)
      : (index + step + list.length) % list.length;
    setActive(list[index]);
  }
  function onOutside(event) { if (!root.contains(event.target)) close(); }
  function onInput() {
    if (onFilter) onFilter(input.value);
    open();
    if (active && active.hidden) setActive(null);
  }
  function onFocus() { if (visibleOptions().length) open(); }
  function onKeydown(event) {
    if (event.key === "ArrowDown") { event.preventDefault(); move(1); }
    else if (event.key === "ArrowUp") { event.preventDefault(); move(-1); }
    else if (event.key === "Home" && isOpen()) { event.preventDefault(); const l = visibleOptions(); if (l[0]) setActive(l[0]); }
    else if (event.key === "End" && isOpen()) { event.preventDefault(); const l = visibleOptions(); if (l.length) setActive(l[l.length - 1]); }
    else if (event.key === "Enter") { if (active && (inline || isOpen())) { event.preventDefault(); selectOption(active); } }
    else if (event.key === "Escape") { if (!inline && isOpen()) { event.preventDefault(); close(); } }
  }
  function onListClick(event) {
    const option = event.target.closest(OPTION);
    if (option && listbox.contains(option)) selectOption(option);
  }

  input.setAttribute("role", "combobox");
  input.setAttribute("aria-expanded", isOpen() ? "true" : "false");
  input.setAttribute("aria-autocomplete", input.getAttribute("aria-autocomplete") || "list");
  const listId = listbox.getAttribute("id");
  if (listId) input.setAttribute("aria-controls", listId);
  [...listbox.querySelectorAll(OPTION)].forEach((option, i) => {
    if (!option.getAttribute("id")) option.setAttribute("id", (listId || "ro-listbox") + "-opt-" + i);
  });
  if (inline) { input.setAttribute("aria-expanded", "true"); listbox.hidden = false; }
  else listbox.hidden = !isOpen();

  input.addEventListener("input", onInput);
  input.addEventListener("keydown", onKeydown);
  input.addEventListener("focus", onFocus);
  listbox.addEventListener("click", onListClick);

  return {
    root, input, listbox,
    open, close, isOpen,
    activeOption() { return active; },
    destroy() {
      input.removeEventListener("input", onInput);
      input.removeEventListener("keydown", onKeydown);
      input.removeEventListener("focus", onFocus);
      listbox.removeEventListener("click", onListClick);
      document.removeEventListener("pointerdown", onOutside);
    },
  };
}
