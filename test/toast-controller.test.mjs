import assert from "node:assert/strict";
import test from "node:test";
import { createToastController } from "../src/primitives/toast-controller.js";

function descendants(el) {
  const out = [];
  el.children.forEach((child) => { out.push(child); out.push(...descendants(child)); });
  return out;
}

class FakeElement {
  constructor(document, tag) {
    this.ownerDocument = document;
    this.tagName = String(tag).toUpperCase();
    this.className = "";
    this.textContent = "";
    this.innerHTML = "";
    this.type = "";
    this.parent = null;
    this.children = [];
    this.attributes = new Map();
    this.listeners = new Map();
    const self = this;
    this.classList = {
      add(name) { self.attributes.set("class:" + name, true); self.className += " " + name; },
      contains(name) { return self.attributes.has("class:" + name); },
    };
  }
  append(child) { child.parent = this; this.children.push(child); return child; }
  remove() { if (this.parent) { this.parent.children = this.parent.children.filter((c) => c !== this); this.parent = null; } }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  getAttribute(name) { return this.attributes.has(name) ? this.attributes.get(name) : null; }
  hasAttribute(name) { return this.attributes.has(name); }
  querySelector(selector) {
    const cls = selector.replace(/^\./, "");
    return descendants(this).find((el) => (" " + el.className + " ").includes(" " + cls + " ")) || null;
  }
  addEventListener(type, listener) {
    if (!this.listeners.has(type)) this.listeners.set(type, []);
    this.listeners.get(type).push(listener);
  }
  dispatch(type) {
    const event = { type, target: this };
    (this.listeners.get(type) || []).forEach((fn) => fn(event));
  }
}

class FakeDocument {
  constructor() { this.body = new FakeElement(this, "body"); }
  createElement(tag) { return new FakeElement(this, tag); }
}

// Registro de timers controlable a mano.
function fakeTimers() {
  const pending = new Map();
  let id = 0;
  return {
    set(fn, ms) { const key = ++id; pending.set(key, { fn, ms }); return key; },
    clear(key) { pending.delete(key); },
    flush() { const items = [...pending.values()]; pending.clear(); items.forEach((t) => t.fn()); },
    size() { return pending.size; },
  };
}

function setup(options = {}) {
  const document = new FakeDocument();
  const timers = fakeTimers();
  const controller = createToastController({ document, timers, leaveMs: 0, ...options });
  return { document, timers, controller };
}

test("show() crea la región e inserta un toast con role=status", () => {
  const { controller } = setup();
  const handle = controller.show({ variant: "info", message: "Hola" });
  const region = controller.region;
  assert.equal(region.className.trim(), "ro-toast-region");
  assert.equal(region.children.length, 1);
  assert.equal(handle.element.getAttribute("role"), "status");
  assert.equal(handle.element.querySelector(".ro-toast__body").textContent, "Hola");
});

test("los errores se anuncian como role=alert", () => {
  const { controller } = setup();
  const handle = controller.error("Falló");
  assert.equal(handle.element.getAttribute("role"), "alert");
});

test("el cierre automático elimina el toast al vencer el timer", () => {
  const { controller, timers } = setup({ duration: 3000 });
  controller.show({ message: "Temporal" });
  assert.equal(controller.region.children.length, 1);
  timers.flush();
  assert.equal(controller.region.children.length, 0);
});

test("duration 0 deja el toast persistente (sin timer)", () => {
  const { controller, timers } = setup();
  controller.show({ message: "Fijo", duration: 0 });
  assert.equal(timers.size(), 0);
  assert.equal(controller.region.children.length, 1);
});

test("el botón de cierre descarta el toast", () => {
  const { controller } = setup();
  const handle = controller.show({ message: "Con cierre" });
  handle.element.querySelector(".ro-toast__close").dispatch("click");
  assert.equal(controller.region.children.length, 0);
});

test("pointerenter pausa el cierre automático y pointerleave lo reanuda", () => {
  const { controller, timers } = setup({ duration: 3000 });
  const handle = controller.show({ message: "Pausable" });
  assert.equal(timers.size(), 1);
  handle.element.dispatch("pointerenter");
  assert.equal(timers.size(), 0);
  handle.element.dispatch("pointerleave");
  assert.equal(timers.size(), 1);
});

test("dismissAll descarta todos los toasts activos", () => {
  const { controller } = setup();
  controller.success("a");
  controller.info("b");
  assert.equal(controller.region.children.length, 2);
  controller.dismissAll();
  assert.equal(controller.region.children.length, 0);
});
