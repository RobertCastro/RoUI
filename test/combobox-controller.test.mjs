import assert from "node:assert/strict";
import test from "node:test";
import { createComboboxController } from "../src/primitives/combobox-controller.js";

class FakeDocument {
  constructor() { this.activeElement = null; this.listeners = new Map(); }
  addEventListener(type, listener) { this.listeners.set(type, listener); }
  removeEventListener(type) { this.listeners.delete(type); }
  dispatch(type, target) {
    const event = { type, target, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; } };
    this.listeners.get(type)?.(event);
    return event;
  }
}

class FakeElement {
  constructor(document, { role, id } = {}) {
    this.ownerDocument = document;
    this.hidden = false;
    this.value = "";
    this.textContent = "";
    this.attributes = new Map();
    if (role) this.attributes.set("role", role);
    if (id) this.attributes.set("id", id);
    this.children = [];
    this.listeners = new Map();
    this.items = [];
  }
  append(child) { this.children.push(child); return child; }
  contains(element) { return element === this || this.children.some((c) => c.contains(element)); }
  querySelector() { return null; }
  querySelectorAll() { return this.items; }
  getAttribute(name) { return this.attributes.has(name) ? this.attributes.get(name) : null; }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  removeAttribute(name) { this.attributes.delete(name); }
  hasAttribute(name) { return this.attributes.has(name); }
  closest(selector) {
    if (selector.includes("role='option'") && this.getAttribute("role") === "option") return this;
    return null;
  }
  focus() { this.ownerDocument.activeElement = this; }
  addEventListener(type, listener) { this.listeners.set(type, listener); }
  removeEventListener(type) { this.listeners.delete(type); }
  dispatch(type, target, key) {
    const event = { type, target: target || this, key, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; } };
    this.listeners.get(type)?.(event);
    return event;
  }
}

function fixture(extra = {}) {
  const document = new FakeDocument();
  const root = new FakeElement(document);
  const input = root.append(new FakeElement(document, { role: "combobox", id: "cb" }));
  const listbox = root.append(new FakeElement(document, { role: "listbox", id: "lb" }));
  const opts = ["JavaScript", "TypeScript", "Python"].map((label, i) => {
    const option = listbox.append(new FakeElement(document, { role: "option", id: "o" + i }));
    option.textContent = label;
    return option;
  });
  listbox.items = opts;
  const controller = createComboboxController(root, { input, listbox, ...extra });
  return { document, root, input, listbox, opts, controller };
}

test("ArrowDown abre la lista y activa la primera opción vía aria-activedescendant", () => {
  const { input, opts } = fixture();
  input.dispatch("keydown", input, "ArrowDown");
  assert.equal(input.getAttribute("aria-expanded"), "true");
  assert.equal(input.getAttribute("aria-activedescendant"), "o0");
  assert.equal(opts[0].getAttribute("aria-selected"), "true");
});

test("las flechas recorren las opciones con wrap", () => {
  const { input, opts } = fixture();
  input.dispatch("keydown", input, "ArrowDown");
  input.dispatch("keydown", input, "ArrowDown");
  assert.equal(input.getAttribute("aria-activedescendant"), opts[1].getAttribute("id"));
  input.dispatch("keydown", input, "ArrowUp");
  assert.equal(input.getAttribute("aria-activedescendant"), opts[0].getAttribute("id"));
});

test("Enter selecciona la opción activa y cierra", () => {
  const { input } = fixture();
  input.dispatch("keydown", input, "ArrowDown");
  input.dispatch("keydown", input, "Enter");
  assert.equal(input.value, "JavaScript");
  assert.equal(input.getAttribute("aria-expanded"), "false");
});

test("al filtrar, una opción oculta deja de estar activa", () => {
  const { input, opts } = fixture({
    onFilter(query) {
      opts.forEach((o) => { o.hidden = o.textContent.toLowerCase().indexOf(query.toLowerCase()) === -1; });
    },
  });
  input.dispatch("keydown", input, "ArrowDown"); // activa JavaScript
  input.value = "ty";
  input.dispatch("input", input);
  assert.equal(opts[0].hidden, true);   // JavaScript oculto
  assert.equal(opts[1].hidden, false);  // TypeScript visible
  assert.equal(input.getAttribute("aria-activedescendant"), null);
});

test("Escape y pointer exterior cierran la lista", () => {
  const { document, input } = fixture();
  input.dispatch("keydown", input, "ArrowDown");
  input.dispatch("keydown", input, "Escape");
  assert.equal(input.getAttribute("aria-expanded"), "false");
  input.dispatch("keydown", input, "ArrowDown");
  document.dispatch("pointerdown", new FakeElement(document));
  assert.equal(input.getAttribute("aria-expanded"), "false");
});

test("modo inline (Command Palette): Enter ejecuta onSelect y Escape no se captura", () => {
  const document = new FakeDocument();
  const root = new FakeElement(document);
  const input = root.append(new FakeElement(document, { role: "combobox", id: "cb" }));
  const listbox = root.append(new FakeElement(document, { role: "listbox", id: "lb" }));
  const o0 = listbox.append(new FakeElement(document, { role: "option", id: "c0" })); o0.textContent = "Ir a Inicio";
  const o1 = listbox.append(new FakeElement(document, { role: "option", id: "c1" })); o1.textContent = "Ajustes";
  listbox.items = [o0, o1];
  let picked = null;
  createComboboxController(root, { input, listbox, inline: true, onSelect: (op) => { picked = op; } });
  assert.equal(input.getAttribute("aria-expanded"), "true");
  assert.equal(listbox.hidden, false);
  input.dispatch("keydown", input, "ArrowDown");
  input.dispatch("keydown", input, "Enter");
  assert.equal(picked, o0);
  assert.equal(input.value, "");
  assert.equal(input.getAttribute("aria-expanded"), "true");
  const escape = input.dispatch("keydown", input, "Escape");
  assert.equal(escape.defaultPrevented, false);
});
