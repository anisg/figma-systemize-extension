import { scales } from "../config";
import { logWrapper } from "../exception.util";
import { log } from "../log.util";
import {
  attachScaleToInputChanges,
  findSectionByLabelName,
} from "./watchDesignContentAutoLayoutSectionState";
import { ConfigPanelState } from "./watcher.helper";

function findFrameBlock(state: ConfigPanelState) {
  return findSectionByLabelName(state.design._el, `frame`);
}

function findByAriaLabelName(el, ariaLabelName) {
  return el.querySelector(`[aria-label="${ariaLabelName}"]`);
}

function findBorderRadiusBlock(el) {
  return findByAriaLabelName(el, `Corner radius`);
}

function watchCornerRadiusInput(state: ConfigPanelState) {
  logWrapper("... > frame section > corner radius input", () => {
    const _borderRadiusEl = findBorderRadiusBlock(state.design.frame._el);
    if (!_borderRadiusEl) return;
    state.design.frame.borderRadius = {
      _el: _borderRadiusEl,
    };
    attachScaleToInputChanges(_borderRadiusEl, scales.frame.cornerRadius);
  });
}

export function watchDesignFrameState(state: ConfigPanelState) {
  logWrapper("design panel > frame section", () => {
    const _el = findFrameBlock(state);
    if (!_el) {
      state.design.frame = null;
      return;
    }
    state.design.frame = {
      _el,
    };
    watchCornerRadiusInput(state);
  });
}
