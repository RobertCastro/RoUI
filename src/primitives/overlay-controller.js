/**
 * Controlador sin marca para dialogos modales y drawers.
 * El marcado aporta el rol, nombre accesible y contenido; este modulo aporta
 * foco inicial, trap de Tab, Escape, cierre y restauracion del foco.
 */
const FOCUSABLE = [
  "a[href]",
  "area[href]",
  "button",
  "input",
  "select",
  "textarea",
  "iframe",
  "object",
  "embed",
  "[contenteditable]",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

const scrollLocks = new WeakMap();

function getFocusable(panel) {
  return [...panel.querySelectorAll(FOCUSABLE)].filter((element) => (
    !element.hidden
    && !element.hasAttribute("disabled")
    && element.getAttribute("aria-hidden") !== "true"
    && typeof element.focus === "function"
  ));
}

function lockScroll(document) {
  const body = document.body;
  if (!body) return;
  const lock = scrollLocks.get(document) || { count: 0, overflow: body.style.overflow };
  if (lock.count === 0) body.style.overflow = "hidden";
  lock.count += 1;
  scrollLocks.set(document, lock);
}

function unlockScroll(document) {
  const body = document.body;
  const lock = scrollLocks.get(document);
  if (!body || !lock) return;
  lock.count -= 1;
  if (lock.count === 0) {
    body.style.overflow = lock.overflow;
    scrollLocks.delete(document);
  }
}

/**
 * Crea el comportamiento de un overlay modal.
 *
 * @param {HTMLElement} root Elemento que cubre la pagina; debe iniciar con hidden.
 * @param {{panel?: HTMLElement, initialFocus?: string|HTMLElement, closeOnBackdrop?: boolean}} options
 */
export function createOverlayController(root, options = {}) {
  if (!root || !root.ownerDocument) throw new TypeError("root debe ser un elemento del documento");

  const document = root.ownerDocument;
  const panel = options.panel || root.querySelector("[role='dialog'], [role='alertdialog']");
  if (!panel) throw new TypeError("El overlay necesita un panel con role=dialog o role=alertdialog");

  const closeOnBackdrop = options.closeOnBackdrop !== false;
  let opener = null;

  function isOpen() {
    return !root.hidden && root.classList.contains("is-open");
  }

  function focusInitial() {
    const requested = typeof options.initialFocus === "string"
      ? panel.querySelector(options.initialFocus)
      : options.initialFocus;
    const target = requested || getFocusable(panel)[0] || panel;
    target.focus({ preventScroll: true });
  }

  function onKeydown(event) {
    if (!isOpen() || event.defaultPrevented) return;
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = getFocusable(panel);
    if (focusable.length === 0) {
      event.preventDefault();
      panel.focus({ preventScroll: true });
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || !panel.contains(active))) {
      event.preventDefault();
      last.focus({ preventScroll: true });
    } else if (!event.shiftKey && (active === last || !panel.contains(active))) {
      event.preventDefault();
      first.focus({ preventScroll: true });
    }
  }

  function onClick(event) {
    const target = event.target;
    const closeControl = target.closest("[data-ro-overlay-close]");
    const isBackdrop = target === root || target.closest("[data-ro-overlay-backdrop]");
    if ((closeControl && root.contains(closeControl)) || (closeOnBackdrop && isBackdrop)) close();
  }

  function open(nextOpener = document.activeElement) {
    if (isOpen()) return;
    opener = nextOpener;
    root.hidden = false;
    root.classList.add("is-open");
    if (opener?.setAttribute) opener.setAttribute("aria-expanded", "true");
    lockScroll(document);
    document.addEventListener("keydown", onKeydown);
    focusInitial();
  }

  function close({ returnFocus = true } = {}) {
    if (!isOpen()) return;
    root.classList.remove("is-open");
    root.hidden = true;
    document.removeEventListener("keydown", onKeydown);
    unlockScroll(document);
    if (opener?.setAttribute) opener.setAttribute("aria-expanded", "false");
    if (returnFocus && opener?.isConnected !== false && typeof opener?.focus === "function") {
      opener.focus({ preventScroll: true });
    }
  }

  root.addEventListener("click", onClick);

  return {
    root,
    panel,
    open,
    close,
    isOpen,
    destroy() {
      close({ returnFocus: false });
      root.removeEventListener("click", onClick);
    },
  };
}
