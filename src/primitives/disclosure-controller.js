const MENU_ITEM = "[role='menuitem'], [role='menuitemcheckbox'], [role='menuitemradio']";

function menuItems(panel) {
  return [...panel.querySelectorAll(MENU_ITEM)].filter((item) => (
    !item.hidden
    && !item.hasAttribute("disabled")
    && item.getAttribute("aria-disabled") !== "true"
    && typeof item.focus === "function"
  ));
}

/**
 * Comportamiento sin marca para menus y popovers no modales.
 * El marcado conserva roles, nombres y contenido; el controlador gestiona
 * visibilidad, Escape, interacción exterior y teclado de Menu.
 */
export function createDisclosureController(root, options = {}) {
  if (!root || !root.ownerDocument) throw new TypeError("root debe ser un elemento del documento");

  const document = root.ownerDocument;
  const trigger = options.trigger || root.querySelector("[data-ro-disclosure-trigger]");
  const panel = options.panel || root.querySelector("[data-ro-disclosure-panel]");
  if (!trigger || !panel) throw new TypeError("El disclosure necesita trigger y panel declarados");

  const isMenu = panel.getAttribute("role") === "menu";
  // Menu y Popover se descartan al interactuar fuera o con Escape. Un disclosure
  // persistente (p. ej. Accordion) permanece abierto hasta togglear su disparador.
  const dismissible = options.dismissOnOutside === undefined
    ? !root.hasAttribute("data-ro-disclosure-persistent")
    : Boolean(options.dismissOnOutside);

  function isOpen() {
    return !panel.hidden && panel.classList.contains("is-open");
  }

  function focusItem(position) {
    const items = menuItems(panel);
    if (items.length === 0) return;
    items[position === "last" ? items.length - 1 : 0].focus({ preventScroll: true });
  }

  function open({ focus = null } = {}) {
    if (isOpen()) {
      if (isMenu && focus) focusItem(focus);
      return;
    }
    panel.hidden = false;
    panel.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true");
    if (dismissible) {
      document.addEventListener("pointerdown", onOutsidePointer);
      document.addEventListener("keydown", onDocumentKeydown);
    }
    if (isMenu && focus) focusItem(focus);
  }

  function close({ returnFocus = false } = {}) {
    if (!isOpen()) return;
    panel.classList.remove("is-open");
    panel.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    document.removeEventListener("pointerdown", onOutsidePointer);
    document.removeEventListener("keydown", onDocumentKeydown);
    if (returnFocus) trigger.focus({ preventScroll: true });
  }

  function toggle() {
    if (isOpen()) close();
    else open();
  }

  function onOutsidePointer(event) {
    if (!root.contains(event.target)) close();
  }

  function onDocumentKeydown(event) {
    if (event.key === "Escape" && isOpen()) {
      event.preventDefault();
      close({ returnFocus: true });
    }
  }

  function onTriggerKeydown(event) {
    if (!isMenu || (event.key !== "ArrowDown" && event.key !== "ArrowUp")) return;
    event.preventDefault();
    open({ focus: event.key === "ArrowUp" ? "last" : "first" });
  }

  function onPanelKeydown(event) {
    if (!isMenu) return;
    const items = menuItems(panel);
    if (event.key === "Tab") {
      close();
      return;
    }
    if (items.length === 0) return;
    const current = items.indexOf(document.activeElement);
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      const index = current < 0 ? 0 : (current + step + items.length) % items.length;
      items[index].focus({ preventScroll: true });
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      focusItem(event.key === "End" ? "last" : "first");
    }
  }

  function onPanelClick(event) {
    const closeControl = event.target.closest("[data-ro-disclosure-close]");
    if (closeControl && root.contains(closeControl)) {
      close({ returnFocus: true });
      return;
    }
    if (!isMenu) return;
    const item = event.target.closest(MENU_ITEM);
    if (!item || !panel.contains(item) || item.hasAttribute("data-ro-keep-open")) return;
    if (root.hasAttribute("data-ro-select-single")) {
      menuItems(panel).forEach((entry) => entry.setAttribute("aria-current", String(entry === item)));
    }
    close();
  }

  trigger.addEventListener("click", toggle);
  trigger.addEventListener("keydown", onTriggerKeydown);
  panel.addEventListener("keydown", onPanelKeydown);
  panel.addEventListener("click", onPanelClick);

  return {
    root,
    trigger,
    panel,
    isOpen,
    open,
    close,
    toggle,
    destroy() {
      close();
      trigger.removeEventListener("click", toggle);
      trigger.removeEventListener("keydown", onTriggerKeydown);
      panel.removeEventListener("keydown", onPanelKeydown);
      panel.removeEventListener("click", onPanelClick);
    },
  };
}
