import {
  ConfigPanelState,
  panelDom,
  ConfigPanelStateInDesignMode,
} from "./watcher.helper";
import { watchDesignAutoLayoutState } from "./watchDesignContentAutoLayoutSectionState";

export function watchRightPanelDesignContentState(state: ConfigPanelState) {
  state.design = {
    _el: panelDom.propertyPanelContent.findDesignSectionsContainer(state._el),
  };
  watchDesignAutoLayoutState(state as ConfigPanelStateInDesignMode);
}
