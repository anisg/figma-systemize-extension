import { CustomException } from "../exception.util";
import {
  repeatWhileNotTrue,
  sleep,
  triggerEventOnAddOrDeleteDirectChild,
} from "../utils";
import { ConfigPanelState, attachPanelContent } from "./watcher.helper";
import { watchRightPanelState } from "./watchRightPanelState";

class CantLoadAppException extends CustomException {
  errorMsg = "the data seems corrupted";
}

/** this will trigger a callback when the user will change panel tabs */
function watchPanelContentChildrenChanges(state: ConfigPanelState, cb) {
  triggerEventOnAddOrDeleteDirectChild(
    "designPropertyPanelOpening",
    state._el,
    `:not([class*="tabsHeader"])`,
    (action) => {
      if (action == "deleted") return;
      cb(action);
    }
  );
}

/** TODO: Dummy function, to improve */
function pageHasLoadingScreen() {
  return document.querySelector(`[class*="progress_bar"`) != null;
}

async function waitUntilAppFullyLoaded(state: ConfigPanelState) {
  await sleep(1000);
  await repeatWhileNotTrue(
    () => {
      const r = pageHasLoadingScreen();
      return r === false;
    },
    {
      intervalMs: 400,
      timeoutMs: 10000,
    }
  );
  if (pageHasLoadingScreen()) {
    throw new CantLoadAppException();
  }
  state.loading = false;
}

export async function watchDomState() {
  const state: ConfigPanelState = {
    loading: false,
  };
  await waitUntilAppFullyLoaded(state);
  attachPanelContent(state);

  watchRightPanelState(state);

  watchPanelContentChildrenChanges(state, () => watchRightPanelState(state));
}
