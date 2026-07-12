import assert from "node:assert/strict";
import test from "node:test";
import { createDisclosureController } from "../src/primitives/disclosure-controller.js";

class FakeClassList {
  #values = new Set();
  add(value) { this.#values.add(value); }
  remove(value) { this.#values.delete(value); }
  contains(value) { return this.#values.has(value); }
}

class FakeDocument {
  constructor() { this.activeElement = null; this.listeners = new Map(); }
  addEventListener(type, listener) { this.listeners.set(type, listener); }
  removeEventListener(type) { this.listeners.delete(type); }
  dispatch(type, target, key) {
    const event = { target, key, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; } };
    this.listeners.get(type)?.(event);
    return event;
  }
}

class FakeElement {
  constructor(document, { hidden = false, role } = {}) {
    this.ownerDocument = document;
    this.hidden = hidden;
    this.role = role;
    this.classList = new FakeClassList();
    this.attributes = new Map(role ? [["role", role]] : []);
    this.children = [];
    this.listeners = new Map();
    this.items = [];
  }
  append(child) { this.children.push(child); return child; }
  contains(element) { return element === this || this.children.some((child) => child.contains(element)); }
  querySelectorAll() { return this.items; }
  querySelector() { return null; }
  hasAttribute(name) { return this.attributes.has(name); }
  getAttribute(name) { return this.attributes.get(name) || null; }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  addEventListener(type, listener) { this.listeners.set(type, listener); }
  removeEventListener(type) { this.listeners.delete(type); }
  closest(selector) {
    if (selector.includes("data-ro-disclosure-close") && this.hasAttribute("data-ro-disclosure-close")) return this;
    if (selector.includes("role='menuitem'") && this.getAttribute("role") === "menuitem") return this;
    return null;
  }
  focus() { this.ownerDocument.activeElement = this; }
  dispatch(type, target = this, key) {
    const event = { target, key, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; } };
    this.listeners.get(type)?.(event);
    return event;
  }
}

function menuFixture() {
  const document = new FakeDocument();
  const root = new FakeElement(document);
  const trigger = root.append(new FakeElement(document));
  const panel = root.append(new FakeElement(document, { hidden: true, role: "menu" }));
  const first = panel.append(new FakeElement(document, { role: "menuitem" }));
  const second = panel.append(new FakeElement(document, { role: "menuitem" }));
  panel.items = [first, second];
  return { document, root, trigger, panel, first, second };
}

test("abre un menu con flechas y recorre sus items", () => {
  const { document, root, trigger, panel, first, second } = menuFixture();
  const controller = createDisclosureController(root, { trigger, panel });

  trigger.dispatch("keydown", trigger, "ArrowDown");
  assert.equal(controller.isOpen(), true);
  assert.equal(trigger.getAttribute("aria-expanded"), "true");
  assert.equal(document.activeElement, first);

  panel.dispatch("keydown", first, "ArrowDown");
  assert.equal(document.activeElement, second);
  panel.dispatch("keydown", second, "Home");
  assert.equal(document.activeElement, first);
});

test("Escape restaura el foco y un item seleccionado cierra el menu", () => {
  const { document, root, trigger, panel, first, second } = menuFixture();
  root.setAttribute("data-ro-select-single", "");
  const controller = createDisclosureController(root, { trigger, panel });
  controller.open({ focus: "first" });

  const escape = document.dispatch("keydown", first, "Escape");
  assert.equal(escape.defaultPrevented, true);
  assert.equal(controller.isOpen(), false);
  assert.equal(document.activeElement, trigger);

  controller.open();
  panel.dispatch("click", second);
  assert.equal(controller.isOpen(), false);
  assert.equal(first.getAttribute("aria-current"), "false");
  assert.equal(second.getAttribute("aria-current"), "true");
});

test("popover cierra al interactuar fuera sin robar foco", () => {
  const document = new FakeDocument();
  const root = new FakeElement(document);
  const trigger = root.append(new FakeElement(document));
  const panel = root.append(new FakeElement(document, { hidden: true, role: "dialog" }));
  const outside = new FakeElement(document);
  const controller = createDisclosureController(root, { trigger, panel });
  controller.open();
  document.dispatch("pointerdown", outside);
  assert.equal(controller.isOpen(), false);
  assert.notEqual(document.activeElement, trigger);
});
