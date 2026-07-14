const CELL = "[role='gridcell']";
const ROW = "[role='row']";

function isDay(cell) {
  return !!cell
    && cell.tagName === "BUTTON"
    && cell.getAttribute("role") === "gridcell"
    && !cell.hidden
    && cell.getAttribute("aria-disabled") !== "true";
}

/**
 * Comportamiento sin marca para una cuadrícula navegable (WAI-ARIA grid), pensada
 * para el calendario. El marcado aporta `role=grid`/`row`/`gridcell`; el controlador
 * gestiona el roving tabindex y el teclado: flechas por día y semana, `Home`/`End`
 * por semana y `Enter`/`Espacio` para seleccionar. Las celdas vacías (huecos del
 * mes) no son enfocables.
 */
export function createGridController(grid, options = {}) {
  if (!grid || !grid.ownerDocument) {
    throw new TypeError("grid debe ser un elemento del documento");
  }
  const document = grid.ownerDocument;
  const onSelect = typeof options.onSelect === "function" ? options.onSelect : null;

  function days() { return [...grid.querySelectorAll(CELL)].filter(isDay); }
  function weekRows() {
    return [...grid.querySelectorAll(ROW)].filter((row) => [...row.children].some(isDay));
  }
  function locate(cell) {
    const rows = weekRows();
    for (let r = 0; r < rows.length; r += 1) {
      const c = [...rows[r].children].indexOf(cell);
      if (c !== -1) return { rows, r, c };
    }
    return null;
  }
  function current() {
    const active = document.activeElement;
    if (isDay(active) && grid.contains(active)) return active;
    const list = days();
    return list.find((d) => d.getAttribute("tabindex") === "0") || list[0] || null;
  }
  function roveTo(cell) {
    if (!cell) return;
    days().forEach((d) => d.setAttribute("tabindex", d === cell ? "0" : "-1"));
    if (typeof cell.focus === "function") cell.focus({ preventScroll: true });
  }
  function step(delta) {
    const list = days();
    const index = list.indexOf(current());
    const next = index === -1 ? list[0] : list[index + delta];
    if (next) roveTo(next);
  }
  function vertical(delta) {
    const loc = locate(current());
    if (!loc) return;
    const targetRow = loc.rows[loc.r + delta];
    if (!targetRow) return;
    const cell = [...targetRow.children][loc.c];
    if (isDay(cell)) roveTo(cell);
  }
  function edge(position) {
    const loc = locate(current());
    if (!loc) return;
    const cells = [...loc.rows[loc.r].children].filter(isDay);
    roveTo(position === "end" ? cells[cells.length - 1] : cells[0]);
  }
  function select() {
    const cell = current();
    if (cell && onSelect) onSelect(cell);
  }
  function onKeydown(event) {
    if (event.key === "ArrowRight") { event.preventDefault(); step(1); }
    else if (event.key === "ArrowLeft") { event.preventDefault(); step(-1); }
    else if (event.key === "ArrowDown") { event.preventDefault(); vertical(1); }
    else if (event.key === "ArrowUp") { event.preventDefault(); vertical(-1); }
    else if (event.key === "Home") { event.preventDefault(); edge("home"); }
    else if (event.key === "End") { event.preventDefault(); edge("end"); }
    else if (event.key === "Enter" || event.key === " ") { event.preventDefault(); select(); }
  }
  function onClick(event) {
    const cell = event.target.closest(CELL);
    if (cell && isDay(cell) && grid.contains(cell)) { roveTo(cell); if (onSelect) onSelect(cell); }
  }

  // Roving inicial: día seleccionado, día marcado como actual, o el primero.
  const list = days();
  const initial = list.find((d) => d.getAttribute("aria-selected") === "true")
    || list.find((d) => d.hasAttribute("data-ro-grid-current"))
    || list[0];
  list.forEach((d) => d.setAttribute("tabindex", d === initial ? "0" : "-1"));

  grid.addEventListener("keydown", onKeydown);
  grid.addEventListener("click", onClick);

  return {
    grid,
    focusDay(cell) { if (isDay(cell)) roveTo(cell); },
    destroy() {
      grid.removeEventListener("keydown", onKeydown);
      grid.removeEventListener("click", onClick);
    },
  };
}
