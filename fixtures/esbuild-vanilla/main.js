// Imports public RoUI entrypoints through esbuild.
import "@robertcastro/roui/tokens.css";
import "@robertcastro/roui/components/button.css";
import "@robertcastro/roui/layouts/shell.css";
import iconSpriteUrl from "@robertcastro/roui/icons.svg?url";

document.querySelector("#icon-target").innerHTML =
  `<svg aria-hidden="true"><use href="${iconSpriteUrl}#ro-i-check"></use></svg>`;
