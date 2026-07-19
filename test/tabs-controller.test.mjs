import assert from "node:assert/strict";
import test from "node:test";
import { createTabsController } from "../src/primitives/tabs-controller.js";

class FakeDocument {
  constructor() { this.activeElement = null; this.byId = new Map(); }
  getElementById(id) { return this.byId.get(id) || null; }
}

class FakeElement {
  constructor(document, { role, id } = {}) {
    this.ownerDocument = document;
    this.hidden = false;
    this.attributes = new Map();
    if (role) this.attributes.set("role", role);
    if (id) { this.attributes.set("id", id); document.byId.set(id, this); }
    this.children = [];
    this.listeners = new Map();
    this.items = [];
  }
  append(child) { this.children.push(child); return child; }
  contains(element) { return element === this || this.children.some((c) => c.contains(element)); }
  querySelectorAll() { return this.items; }
  hasAttribute(name) { return this.attributes.has(name); }
  getAttribute(name) { return this.attributes.has(name) ? this.attributes.get(name) : null; }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  closest(selector) {
    if (selector.includes("role='tab'") && this.getAttribute("role") === "tab") return this;
    return null;
  }
  focus() { this.ownerDocument.activeElement = this; }
  addEventListener(type, listener) { this.listeners.set(type, listener); }
  removeEventListener(type) { this.listeners.delete(type); }
  dispatch(type, target, key) {
    const event = { type, target, key, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; } };
    this.listeners.get(type)?.(event);
    return event;
  }
}

function tabsFixture({ orientation } = {}) {
  const document = new FakeDocument();
  const tablist = new FakeElement(document, { role: "tablist" });
  if (orientation) tablist.setAttribute("aria-orientation", orientation);
  const labels = ["temario", "discusion", "checkpoints"];
  const tabList = labels.map((label, i) => {
    const tab = tablist.append(new FakeElement(document, { role: "tab", id: `t-${label}` }));
    const panel = new FakeElement(document, { role: "tabpanel", id: `p-${label}` });
    tab.setAttribute("aria-controls", `p-${label}`);
    tab.setAttribute("aria-selected", i === 0 ? "true" : "false");
    panel.hidden = i !== 0;
    return { tab, panel };
  });
  tablist.items = tabList.map((entry) => entry.tab);
  return { document, tablist, tabs: tabList };
}

test("estado inicial: roving tabindex y panel activo visible", () => {
  const { tablist, tabs } = tabsFixture();
  createTabsController(tablist);
  assert.equal(tabs[0].tab.getAttribute("tabindex"), "0");
  assert.equal(tabs[1].tab.getAttribute("tabindex"), "-1");
  assert.equal(tabs[0].panel.hidden, false);
  assert.equal(tabs[1].panel.hidden, true);
});

test("ArrowRight activa la siguiente pestaña y muestra su panel", () => {
  const { document, tablist, tabs } = tabsFixture();
  createTabsController(tablist);
  const event = tablist.dispatch("keydown", tabs[0].tab, "ArrowRight");
  assert.equal(event.defaultPrevented, true);
  assert.equal(document.activeElement, tabs[1].tab);
  assert.equal(tabs[1].tab.getAttribute("aria-selected"), "true");
  assert.equal(tabs[0].tab.getAttribute("aria-selected"), "false");
  assert.equal(tabs[1].panel.hidden, false);
  assert.equal(tabs[0].panel.hidden, true);
});

test("ArrowRight desde la última vuelve a la primera (wrap) y Home/End", () => {
  const { document, tablist, tabs } = tabsFixture();
  createTabsController(tablist);
  tablist.dispatch("keydown", tabs[0].tab, "End");
  assert.equal(document.activeElement, tabs[2].tab);
  tablist.dispatch("keydown", tabs[2].tab, "ArrowRight");
  assert.equal(document.activeElement, tabs[0].tab);
  tablist.dispatch("keydown", tabs[0].tab, "Home");
  assert.equal(document.activeElement, tabs[0].tab);
});

test("orientación vertical usa ArrowDown/ArrowUp", () => {
  const { document, tablist, tabs } = tabsFixture({ orientation: "vertical" });
  createTabsController(tablist);
  tablist.dispatch("keydown", tabs[0].tab, "ArrowDown");
  assert.equal(document.activeElement, tabs[1].tab);
  tablist.dispatch("keydown", tabs[1].tab, "ArrowUp");
  assert.equal(document.activeElement, tabs[0].tab);
});

test("activación manual: la flecha mueve foco pero no selecciona hasta Enter", () => {
  const { document, tablist, tabs } = tabsFixture();
  createTabsController(tablist, { manual: true });
  tablist.dispatch("keydown", tabs[0].tab, "ArrowRight");
  assert.equal(document.activeElement, tabs[1].tab);
  assert.equal(tabs[1].tab.getAttribute("aria-selected"), "false");
  tablist.dispatch("keydown", tabs[1].tab, "Enter");
  assert.equal(tabs[1].tab.getAttribute("aria-selected"), "true");
  assert.equal(tabs[1].panel.hidden, false);
});
