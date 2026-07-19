import assert from "node:assert/strict";
import test from "node:test";
import { createGridController } from "../src/primitives/grid-controller.js";

class FakeDocument {
  constructor() { this.activeElement = null; }
}

function descendants(el) {
  const out = [];
  el.children.forEach((child) => { out.push(child); out.push(...descendants(child)); });
  return out;
}

class FakeElement {
  constructor(document, { tag = "DIV", role } = {}) {
    this.ownerDocument = document;
    this.tagName = tag;
    this.hidden = false;
    this.textContent = "";
    this.children = [];
    this.listeners = new Map();
    this.attributes = new Map();
    if (role) this.attributes.set("role", role);
  }
  append(child) { this.children.push(child); return child; }
  contains(element) { return element === this || this.children.some((c) => c.contains(element)); }
  querySelectorAll(selector) {
    const match = selector.match(/role='([a-z]+)'/);
    const role = match ? match[1] : null;
    return descendants(this).filter((el) => role && el.getAttribute("role") === role);
  }
  getAttribute(name) { return this.attributes.has(name) ? this.attributes.get(name) : null; }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  hasAttribute(name) { return this.attributes.has(name); }
  closest(selector) {
    const match = selector.match(/role='([a-z]+)'/);
    const role = match ? match[1] : null;
    return role && this.getAttribute("role") === role ? this : null;
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

function fixture(onSelect) {
  const document = new FakeDocument();
  const grid = new FakeElement(document, { role: "grid" });
  const layout = [["", "", 1, 2, 3, 4, 5], [6, 7, 8, 9, 10, 11, 12]];
  const cells = {};
  layout.forEach((week) => {
    const row = grid.append(new FakeElement(document, { role: "row" }));
    week.forEach((value) => {
      if (value === "") { row.append(new FakeElement(document, { tag: "DIV", role: "gridcell" })); return; }
      const button = row.append(new FakeElement(document, { tag: "BUTTON", role: "gridcell" }));
      button.textContent = String(value);
      cells[value] = button;
    });
  });
  const controller = createGridController(grid, { onSelect });
  return { document, grid, cells, controller };
}

test("roving inicial: la primera celda es tabbable", () => {
  const { cells } = fixture();
  assert.equal(cells[1].getAttribute("tabindex"), "0");
  assert.equal(cells[2].getAttribute("tabindex"), "-1");
});

test("ArrowRight/ArrowLeft mueven por día", () => {
  const { document, grid, cells } = fixture();
  grid.dispatch("keydown", cells[1], "ArrowRight");
  assert.equal(document.activeElement, cells[2]);
  assert.equal(cells[2].getAttribute("tabindex"), "0");
  grid.dispatch("keydown", cells[2], "ArrowLeft");
  assert.equal(document.activeElement, cells[1]);
});

test("ArrowDown/ArrowUp mantienen la columna (misma semana)", () => {
  const { document, grid, cells } = fixture();
  cells[3].focus();
  grid.dispatch("keydown", cells[3], "ArrowDown");
  assert.equal(document.activeElement, cells[10]);
  grid.dispatch("keydown", cells[10], "ArrowUp");
  assert.equal(document.activeElement, cells[3]);
});

test("Home y End van al inicio y fin de la semana", () => {
  const { document, grid, cells } = fixture();
  cells[3].focus();
  grid.dispatch("keydown", cells[3], "Home");
  assert.equal(document.activeElement, cells[1]);
  cells[3].focus();
  grid.dispatch("keydown", cells[3], "End");
  assert.equal(document.activeElement, cells[5]);
});

test("Enter selecciona la celda activa", () => {
  let picked = null;
  const { grid, cells } = fixture((cell) => { picked = cell; });
  cells[4].focus();
  grid.dispatch("keydown", cells[4], "Enter");
  assert.equal(picked, cells[4]);
});
