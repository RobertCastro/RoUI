import assert from "node:assert/strict";
import test from "node:test";
import { createOverlayController } from "../src/primitives/overlay-controller.js";

class FakeClassList {
  #values = new Set();
  add(value) { this.#values.add(value); }
  remove(value) { this.#values.delete(value); }
  contains(value) { return this.#values.has(value); }
}

class FakeDocument {
  constructor() {
    this.activeElement = null;
    this.body = { style: { overflow: "auto" } };
    this.listeners = new Map();
  }
  addEventListener(type, listener) { this.listeners.set(type, listener); }
  removeEventListener(type) { this.listeners.delete(type); }
  keydown(key, shiftKey = false) {
    const event = { key, shiftKey, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; } };
    this.listeners.get("keydown")?.(event);
    return event;
  }
}

class FakeElement {
  constructor(document, { hidden = false } = {}) {
    this.ownerDocument = document;
    this.hidden = hidden;
    this.isConnected = true;
    this.classList = new FakeClassList();
    this.attributes = new Map();
    this.children = [];
    this.listeners = new Map();
    this.focusables = [];
  }
  append(child) { this.children.push(child); return child; }
  contains(element) { return element === this || this.children.some((child) => child.contains(element)); }
  querySelectorAll() { return this.focusables; }
  querySelector() { return null; }
  hasAttribute(name) { return this.attributes.has(name); }
  getAttribute(name) { return this.attributes.get(name) || null; }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  addEventListener(type, listener) { this.listeners.set(type, listener); }
  removeEventListener(type) { this.listeners.delete(type); }
  closest(selector) {
    return selector === "[data-ro-overlay-close]" && this.hasAttribute("data-ro-overlay-close") ? this : null;
  }
  focus() { this.ownerDocument.activeElement = this; }
  click(target = this) { this.listeners.get("click")?.({ target }); }
}

function fixture() {
  const document = new FakeDocument();
  const root = new FakeElement(document, { hidden: true });
  const panel = root.append(new FakeElement(document));
  const opener = new FakeElement(document);
  const first = panel.append(new FakeElement(document));
  const last = panel.append(new FakeElement(document));
  panel.focusables = [first, last];
  return { document, root, panel, opener, first, last };
}

test("abre el overlay, bloquea scroll y restaura el foco con Escape", () => {
  const { document, root, panel, opener, first } = fixture();
  const controller = createOverlayController(root, { panel });

  controller.open(opener);
  assert.equal(controller.isOpen(), true);
  assert.equal(root.hidden, false);
  assert.equal(opener.getAttribute("aria-expanded"), "true");
  assert.equal(document.body.style.overflow, "hidden");
  assert.equal(document.activeElement, first);

  const event = document.keydown("Escape");
  assert.equal(event.defaultPrevented, true);
  assert.equal(controller.isOpen(), false);
  assert.equal(root.hidden, true);
  assert.equal(opener.getAttribute("aria-expanded"), "false");
  assert.equal(document.body.style.overflow, "auto");
  assert.equal(document.activeElement, opener);
});

test("encierra el foco con Tab y permite cerrar con un control declarado", () => {
  const { document, root, panel, opener, first, last } = fixture();
  const close = panel.append(new FakeElement(document));
  close.setAttribute("data-ro-overlay-close", "");
  const controller = createOverlayController(root, { panel });
  controller.open(opener);

  document.activeElement = last;
  document.keydown("Tab");
  assert.equal(document.activeElement, first);
  document.activeElement = first;
  document.keydown("Tab", true);
  assert.equal(document.activeElement, last);

  root.click(close);
  assert.equal(controller.isOpen(), false);
  assert.equal(document.activeElement, opener);
});

test("enfoca el panel cuando no existen controles interactivos", () => {
  const { document, root, panel, opener } = fixture();
  panel.focusables = [];
  const controller = createOverlayController(root, { panel });
  controller.open(opener);
  assert.equal(document.activeElement, panel);
  document.keydown("Tab");
  assert.equal(document.activeElement, panel);
});
