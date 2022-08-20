import { ConfigPanelState, determineCurrentTab } from "./watcher.helper";
import { watchRightPanelDesignContentState } from "./watchRightPanelDesignContentState";

export function watchRightPanelState(state: ConfigPanelState) {
  state.tab = determineCurrentTab(state);

  if (state.tab == "design") {
    watchRightPanelDesignContentState(state);
  } else {
    state.design = null;
  }
  console.log("updated state", state);
}
