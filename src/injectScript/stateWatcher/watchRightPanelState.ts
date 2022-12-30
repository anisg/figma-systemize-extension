import { ConfigPanelState, determineCurrentTab } from "./watcher.helper";
import { watchRightPanelDesignContentState } from "./watchRightPanelDesignContentState";

function htmlString2El(s) {
  var wrapper = document.createElement("div");
  wrapper.innerHTML = s;
  return wrapper.children[0];
}

const iconSvg = (failed?) => `<svg class="svg" aria-label="Add comment" width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="transparent">
<circle cx="10" cy="10" r="9" stroke="${!failed ? `#27AE60` : `#EB5757`}" stroke-width="2"/>
</svg>
`;

export function attachClickButton(state: ConfigPanelState) {
  let cloned = document.querySelector("#figma-systemize-button");
  if (!cloned) {
    const d = document.querySelector(`[data-testid="set-tool-comments"]`);
    cloned = d.cloneNode(true) as Element;
    cloned.id = "figma-systemize-button";
    cloned.children[0].setAttribute("data-tooltip", "Figma Systemize");
    cloned.children[0].setAttribute("data-tooltip-type", "text");
    const x = document.querySelector(`[class*="voice_toolbar--wrapper--"]`);
    x.before(cloned);
    cloned.addEventListener("click", () => {
      console.log("retrying to load everything...");
      watchRightPanelState(state);
    });
  }
  cloned.children[0].children[0].remove();
  cloned.children[0].appendChild(htmlString2El(iconSvg(!state.design?.autoLayout)));
}

export function watchRightPanelState(state: ConfigPanelState) {
  state.tab = determineCurrentTab(state);

  attachClickButton(state);

  if (state.tab == "design") {
    watchRightPanelDesignContentState(state);
  } else {
    state.design = null;
  }
}
