const VARIANT_ROLE = { error: "alert" };

/**
 * Comportamiento sin marca para notificaciones flotantes (toasts) con anuncio
 * accesible. Cada toast se inserta como una región viva independiente:
 * `role=status` (anuncio cortés) para éxito/info y `role=alert` (asertivo) para
 * errores, siguiendo el patrón Alert de WAI-ARIA. El controlador gestiona el
 * cierre automático, la pausa al pasar el puntero o enfocar, el botón de cierre y
 * `prefers-reduced-motion`. El marcado de icono lo aporta el consumidor con
 * `options.icon`, de modo que la primitiva no depende de un set de iconos.
 */
export function createToastController(options = {}) {
  const document = options.document || (typeof globalThis !== "undefined" ? globalThis.document : null);
  if (!document || typeof document.createElement !== "function") {
    throw new TypeError("createToastController necesita un document");
  }
  const mount = options.mount || document.body;
  const defaultDuration = options.duration == null ? 5000 : options.duration;
  const setTimer = options.timers?.set || ((fn, ms) => setTimeout(fn, ms));
  const clearTimer = options.timers?.clear || ((id) => clearTimeout(id));
  const icon = typeof options.icon === "function" ? options.icon : null;
  const closeLabel = options.closeLabel || "Cerrar";
  const leaveMs = options.reducedMotion ? 0 : (options.leaveMs == null ? 160 : options.leaveMs);

  let region = options.region || null;
  function ensureRegion() {
    if (region) return region;
    region = document.createElement("div");
    region.className = "ro-toast-region";
    if (mount && typeof mount.append === "function") mount.append(region);
    return region;
  }

  const active = new Set();

  function build(variant, message, dismissible) {
    const el = document.createElement("div");
    el.className = "ro-toast ro-toast--" + variant;
    el.setAttribute("role", VARIANT_ROLE[variant] || "status");
    if (icon) {
      const markup = icon(variant);
      if (markup) {
        const slot = document.createElement("span");
        slot.className = "ro-toast__icon";
        slot.setAttribute("aria-hidden", "true");
        slot.innerHTML = markup;
        el.append(slot);
      }
    }
    const body = document.createElement("div");
    body.className = "ro-toast__body";
    body.textContent = message == null ? "" : String(message);
    el.append(body);
    if (dismissible) {
      const close = document.createElement("button");
      close.type = "button";
      close.className = "ro-toast__close";
      close.setAttribute("aria-label", closeLabel);
      if (icon) close.innerHTML = icon("close") || "×";
      else close.textContent = "×";
      el.append(close);
    }
    return el;
  }

  function show(config = {}) {
    const opts = typeof config === "string" ? { message: config } : config;
    const variant = opts.variant || "info";
    const dismissible = opts.dismissible !== false;
    const duration = opts.duration == null ? defaultDuration : opts.duration;
    const el = build(variant, opts.message, dismissible);
    ensureRegion().append(el);

    let timer = null;
    let removed = false;
    let remaining = duration;
    let startedAt = 0;

    function remove() {
      if (removed) return;
      removed = true;
      if (timer) { clearTimer(timer); timer = null; }
      active.delete(handle);
      if (leaveMs > 0 && typeof el.classList?.add === "function") {
        el.classList.add("is-leaving");
        setTimer(() => el.remove(), leaveMs);
      } else {
        el.remove();
      }
      if (typeof opts.onDismiss === "function") opts.onDismiss();
    }
    function schedule() {
      if (!(remaining > 0) || remaining === Infinity) return;
      startedAt = typeof options.now === "function" ? options.now() : 0;
      timer = setTimer(remove, remaining);
    }
    function pause() {
      if (!timer) return;
      clearTimer(timer);
      timer = null;
      if (typeof options.now === "function") remaining -= options.now() - startedAt;
    }
    function resume() { if (!removed && !timer) schedule(); }

    const close = dismissible ? el.querySelector(".ro-toast__close") : null;
    if (close) close.addEventListener("click", remove);
    // Pausar el cierre automático mientras el usuario interactúa o lee.
    el.addEventListener("pointerenter", pause);
    el.addEventListener("pointerleave", resume);
    el.addEventListener("focusin", pause);
    el.addEventListener("focusout", resume);

    const handle = { element: el, dismiss: remove };
    active.add(handle);
    schedule();
    return handle;
  }

  return {
    show,
    success(message, opts) { return show({ ...opts, variant: "success", message }); },
    error(message, opts) { return show({ ...opts, variant: "error", message }); },
    info(message, opts) { return show({ ...opts, variant: "info", message }); },
    get region() { return region; },
    dismissAll() { [...active].forEach((h) => h.dismiss()); },
    destroy() {
      this.dismissAll();
      if (region && !options.region && typeof region.remove === "function") region.remove();
      region = options.region || null;
    },
  };
}
