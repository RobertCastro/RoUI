import assert from "node:assert/strict";
import test from "node:test";
import { migrate } from "../codemods/legacy-states.mjs";

test("ro-tab--active se convierte en aria-selected", () => {
  const { out, count } = migrate('<button class="ro-tab ro-tab--active" role="tab">Uno</button>');
  assert.equal(count, 1);
  assert.match(out, /class="ro-tab"/);
  assert.match(out, /aria-selected="true"/);
  assert.doesNotMatch(out, /ro-tab--active/);
});

test("ro-nav-link--active se convierte en aria-current=page", () => {
  const { out } = migrate('<a class="ro-nav-link ro-nav-link--active">Inicio</a>');
  assert.match(out, /class="ro-nav-link" aria-current="page"/);
});

test("ro-calendar__day--selected se convierte en aria-selected", () => {
  const { out } = migrate('<button class="ro-calendar__day ro-calendar__day--selected">12</button>');
  assert.match(out, /class="ro-calendar__day" aria-selected="true"/);
});

test("preserva otros atributos y clases", () => {
  const { out } = migrate('<button class="ro-tab ro-tab--active" role="tab" id="t1" tabindex="0">Uno</button>');
  assert.match(out, /role="tab"/);
  assert.match(out, /id="t1"/);
  assert.match(out, /tabindex="0"/);
});

test("no cambia marcado sin patrones heredados", () => {
  const input = '<button class="ro-tab" role="tab" aria-selected="false">Dos</button>';
  const { out, count } = migrate(input);
  assert.equal(count, 0);
  assert.equal(out, input);
});
