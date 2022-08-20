import { scales } from "../config";
import { sleep } from "../utils";
import { watchDomChanges } from "../watchDomChanges.util";
import { ConfigPanelStateInDesignMode } from "./watcher.helper";

function findAutoLayoutBlock(state: ConfigPanelStateInDesignMode): Element {
  const labelEl = [
    ...state.design._el.querySelectorAll(
      `.cachedSubtree div[class*="panelTitleText"]`
    ),
  ].find((el) => el.textContent.toLowerCase().includes(`auto layout`));
  if (!labelEl) return null;
  console.log("labelEl", labelEl);
  let parent = labelEl.parentNode as Element;
  while (!parent?.matches(`.cachedSubtree`)) {
    parent = parent.parentNode as Element;
  }
  return parent;
}
function determineDesignAutoLayoutState(
  state: ConfigPanelStateInDesignMode
): "off" | "expanded" {
  const autoLayout = state.design.autoLayout;

  const el = autoLayout._el;
  return el.children[0].children[0].children[1].matches(`[aria-label="Remove"]`)
    ? "expanded"
    : "off";
}
function updatedDesignAutoLayoutSpaceBetweenState(
  state: ConfigPanelStateInDesignMode
) {
  const autoLayout = state.design.autoLayout;

  autoLayout.expanded.spaceBetween = {
    _el: autoLayout._el.querySelector(`[aria-label="Spacing between items"]`),
  };

  // attach watcher to space-between
  const inputEl = autoLayout.expanded.spaceBetween._el.querySelector("input");
  console.log("attach to input");
  inputEl.addEventListener("keydown", (ev) => {
    switch (ev.key) {
      case "ArrowLeft":
        // Left pressed
        break;
      case "ArrowRight":
        // Right pressed
        break;
      case "ArrowUp":
        // Up pressed
        // get current value
        ev.stopPropagation();
        const next = findNextInScale(
          scales.autoLayout.spaceBetweenItems,
          Number.parseInt(inputEl.value)
        );
        setVal(inputEl, next);
        break;
      case "ArrowDown":
        // Down pressed
        ev.stopPropagation();
        const prev = findPrevInScale(
          scales.autoLayout.spaceBetweenItems,
          Number.parseInt(inputEl.value)
        );
        setVal(inputEl, prev);
        break;
    }
  });
  console.log(
    "autoLayout.expanded.spaceBetween",
    autoLayout.expanded.spaceBetween
  );
}

async function setVal(inputEl, val) {
  inputEl.value = `${val}`;
  const key = Object.keys(inputEl).find((k) =>
    k.startsWith("__reactEventHandlers")
  );
  inputEl[key].onChange({ target: inputEl });
  inputEl.blur();
  inputEl.parentElement.focus();
  inputEl[key].onBlur();
  sleep(10).then(() => {
    inputEl.select();
  });
}
function findNextInScale(scale: number[], x: number) {
  const idx = scale.findIndex((n) => n > x);
  if (idx == -1) return scale[scale.length - 1];
  return scale[idx];
}
function findPrevInScale(scale: number[], x: number) {
  let idx = -1;
  for (let i = scale.length - 1; i >= 0; i--) {
    if (scale[i] < x) {
      idx = i;
      break;
    }
  }
  if (idx == -1) return scale[0];
  return scale[idx];
}

export function watchDesignAutoLayoutState(
  state: ConfigPanelStateInDesignMode
) {
  const _el = findAutoLayoutBlock(state);
  if (!_el) return;

  state.design.autoLayout = {
    _el: _el,
  };
  const autoLayout = state.design.autoLayout;

  autoLayout.state = determineDesignAutoLayoutState(state);

  // watch changes
  watchDomChanges(_el.children[0].querySelector(`span[role="button"]`), {
    ["updated-attribute"]: (x, el) => {
      if (x.attributeName == "aria-label") {
        watchDesignAutoLayoutState(state);
      }
    },
  });

  if (autoLayout.state == "expanded") {
    autoLayout.expanded = {
      direction: "unknown",
    };
    updatedDesignAutoLayoutSpaceBetweenState(state);
  }
}
