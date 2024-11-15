import { scales } from "../config";
import { logWrapper } from "../exception.util";
import { log, logProgress } from "../log.util";
import { sleep } from "../utils";
import { watchDomChanges } from "../watchDomChanges.util";
import { ConfigPanelStateInDesignMode } from "./watcher.helper";
import { watchRightPanelDesignContentState } from "./watchRightPanelDesignContentState";
import { attachClickButton } from "./watchRightPanelState";

export function findSectionByLabelName(designRootEl, name): Element | null {
  const labelEl = [...designRootEl.querySelectorAll(`.cachedSubtree > :first-child > :first-child > :first-child`)].find((el) => el.textContent.toLowerCase().includes(name.toLowerCase()));
  if (!labelEl) return null;
  let parent = labelEl.parentNode as Element;
  while (!parent?.matches(`.cachedSubtree`)) {
    parent = parent.parentNode as Element;
  }
  return parent;
}
function findAutoLayoutBlock(state: ConfigPanelStateInDesignMode): Element {
  return findSectionByLabelName(state.design._el, `auto layout`);
}
function determineDesignAutoLayoutState(state: ConfigPanelStateInDesignMode): "off" | "expanded" {
  const autoLayout = state.design.autoLayout;

  const el = autoLayout._el;
  log("el", el);
  return el.children[0].querySelector('[aria-label="Remove"]') ? "expanded" : "off";
}

function handleKeyDown(ev, scale) {
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
      const next = findNextInScale(scale, Number.parseInt(ev.target.value));
      log("next", next);
      setVal(ev.target, next);
      break;
    case "ArrowDown":
      // Down pressed
      ev.stopPropagation();
      const prev = findPrevInScale(scale, Number.parseInt(ev.target.value));
      setVal(ev.target, prev);
      break;
  }
}
const onHandleKeyDownSpaceBetweenScale = (ev) => handleKeyDown(ev, scales.autoLayout.spaceBetweenItems);
const onHandleKeyDownPaddingScale = (ev) => handleKeyDown(ev, scales.autoLayout.padding);
const onHandleKeyDownCornerRadiusScale = (ev) => handleKeyDown(ev, scales.frame.cornerRadius);
const eventsMap = {
  "autoLayout.spaceBetweenItems": onHandleKeyDownSpaceBetweenScale,
  "autoLayout.padding": onHandleKeyDownPaddingScale,
  "frame.cornerRadius": onHandleKeyDownCornerRadiusScale,
};

export function attachScaleToInputChanges(el, scale: "autoLayout.padding" | "autoLayout.spaceBetweenItems" | "frame.cornerRadius") {
  if (!el) return;
  log(`attach scale to "${el.getAttribute("aria-label")}" input`);
  // attach watcher
  const inputEl = el.querySelector("input");
  if (!inputEl.getAttribute("modified")) {
    inputEl.addEventListener("keydown", eventsMap[scale]);
    inputEl.setAttribute("modified", "true");
  }
}

function watchDesignAutoLayoutSpaceBetweenState(state: ConfigPanelStateInDesignMode) {
  logWrapper("... > design layout > space between", () => {
    const autoLayout = state.design.autoLayout;

    const _el = autoLayout._el.querySelector(`[aria-label="Spacing between items"]`);
    if (!_el) return;
    autoLayout.expanded.spaceBetween = {
      _el: _el,
    };

    // attach watcher to space-between
    attachScaleToInputChanges(autoLayout.expanded.spaceBetween._el, "autoLayout.spaceBetweenItems");
  });
}

function watchDesignAutoLayoutPaddingState(state: ConfigPanelStateInDesignMode) {
  logWrapper("... > design layout > padding", () => {
    const autoLayout = state.design.autoLayout;

    const els = autoLayout._el.querySelectorAll(`[aria-label*=" padding"]`);
    els.forEach((el) => {
      attachScaleToInputChanges(el, "autoLayout.padding");
    });
  });
}

async function setVal(inputEl, val) {
  inputEl.value = `${val}`;
  const key = Object.keys(inputEl).find((k) => k.startsWith("__reactProps"));
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

export function watchDesignAutoLayoutState(state: ConfigPanelStateInDesignMode) {
  logWrapper("design panel > auto layout", () => {
    const _el = findAutoLayoutBlock(state);
    if (!_el) {
      log("did not found auto-layout section");
      return;
    }
    state.design.autoLayout = {
      _el: _el,
    };

    const autoLayout = state.design.autoLayout;
    autoLayout.state = determineDesignAutoLayoutState(state);
    log("auto layout state: " + autoLayout.state);

    // watch changes
    log(`watch auto layout state (currently it's ${_el.children[0].querySelector(`span[role="button"]`).getAttribute("aria-label") == "Add" ? "unset" : "set"})`);
    watchDomChanges(`toggleButton`, _el.children[0].querySelector(`span[role="button"]`), {
      ["updated-attribute"]: (x, el) => {
        if (x.attributeName == "aria-label") {
          watchRightPanelDesignContentState(state);
        }
      },
    });

    // if (autoLayout.state == "expanded") {
    autoLayout.expanded = {
      direction: "unknown",
    };
    // try {
    watchDesignAutoLayoutSpaceBetweenState(state);
    watchDesignAutoLayoutPaddingState(state);
    // } catch (e) {
    // console.error(e);
    // }
    // }
    // attachClickButton(state);
  });
}
