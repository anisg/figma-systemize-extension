import { scales } from "../config";
import { logWrapper } from "../exception.util";
import { log } from "../log.util";
import { attachScaleToInputChanges, findSectionByLabelName } from "./watchDesignContentAutoLayoutSectionState";
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

function findAllBorderRadiusBlock(el): HTMLDivElement[] {
  return [findBorderRadiusBlock(el), ...el.querySelectorAll(`[aria-label*="corner radius"]`)];
}

function attachAllCornerRadiusInput(state: ConfigPanelState) {
  const els = findAllBorderRadiusBlock(state.design?._el);
  els.forEach((el) => {
    attachScaleToInputChanges(el, "frame.cornerRadius");
  });
}

function watchCornerRadiusInput(state: ConfigPanelState) {
  logWrapper("... > frame section > corner radius input", () => {
    // attachCornerRadiusInput(state);
    attachAllCornerRadiusInput(state);
  });
}

export function watchDesignFrameState(state: ConfigPanelState) {
  logWrapper("design panel > frame section", () => {
    const _el = findFrameBlock(state);
    // if (!_el) {
    //   state.design.frame = null;
    //   return;
    // }
    state.design.frame = {
      _el,
    };
    watchCornerRadiusInput(state);
  });
}
