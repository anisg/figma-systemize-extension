import {
  ConfigPanelState,
  panelDom,
  ConfigPanelStateInDesignMode,
} from "./watcher.helper";
import { watchDesignAutoLayoutState } from "./watchDesignContentAutoLayoutSectionState";
import { watchDesignFrameState } from "./watchDesignFrameState";
import { log, logProgress } from "../log.util";
import { logWrapper } from "../exception.util";

export function watchRightPanelDesignContentState(state: ConfigPanelState) {
  logWrapper("design panel", () => {
    state.design = {
      _el: panelDom.propertyPanelContent.findDesignSectionsContainer(state._el),
    };
    watchDesignAutoLayoutState(state as ConfigPanelStateInDesignMode);
    watchDesignFrameState(state as ConfigPanelStateInDesignMode);
  });
}
