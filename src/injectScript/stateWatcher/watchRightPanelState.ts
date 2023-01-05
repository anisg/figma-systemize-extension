import { log } from "../log.util";
import { ConfigPanelState, determineCurrentTab } from "./watcher.helper";
import { watchRightPanelDesignContentState } from "./watchRightPanelDesignContentState";

function htmlString2El(s) {
  var wrapper = document.createElement("div");
  wrapper.innerHTML = s;
  return wrapper.children[0];
}

const iconSvg = (failed?) => `
<svg width="26" height="22" viewBox="0 0 26 22" fill="#eee" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M23.0806 21.9658H3.52094C1.24063 21.9658 0.799988 20.1561 0.799988 17.9308V4.10263C0.799988 1.8774 1.23905 0.067627 3.52094 0.067627H23.0806C25.3593 0.067627 25.8 1.8774 25.8 4.10263V17.9308C25.8 20.1561 25.3609 21.9658 23.0806 21.9658ZM3.76958 1.57367C2.96856 1.57367 2.31705 2.24407 2.31705 3.06555V18.9663C2.31705 19.7878 2.96856 20.4582 3.76958 20.4582H22.8965C23.6975 20.4582 24.349 19.7878 24.349 18.9663V3.06555C24.349 2.24407 23.6975 1.57367 22.8965 1.57367H3.76958Z" fill="#A0A0A0"/>
<path d="M6.95636 0H5.46448V20.5653H6.95636V0Z" fill="#eee"/>
<path d="M14.8249 0H13.333V20.5653H14.8249V0Z" fill="#eee"/>
<path d="M21.1198 0H19.6279V20.5653H21.1198V0Z" fill="#eee"/>
<path d="M6.15375 9.36681C7.40357 9.36681 8.41674 8.67914 8.41674 7.83087C8.41674 6.98259 7.40357 6.29492 6.15375 6.29492C4.90393 6.29492 3.89075 6.98259 3.89075 7.83087C3.89075 8.67914 4.90393 9.36681 6.15375 9.36681Z" fill="#eee"/>
<path d="M6.15375 14.088C7.40357 14.088 8.41674 13.4003 8.41674 12.5521C8.41674 11.7038 7.40357 11.0161 6.15375 11.0161C4.90393 11.0161 3.89075 11.7038 3.89075 12.5521C3.89075 13.4003 4.90393 14.088 6.15375 14.088Z" fill="#eee"/>
<path d="M6.15375 18.8089C7.40357 18.8089 8.41674 18.1213 8.41674 17.273C8.41674 16.4247 7.40357 15.7371 6.15375 15.7371C4.90393 15.7371 3.89075 16.4247 3.89075 17.273C3.89075 18.1213 4.90393 18.8089 6.15375 18.8089Z" fill="#eee"/>
<path d="M14.0837 6.21935C15.3674 6.21935 16.4081 5.53168 16.4081 4.6834C16.4081 3.83513 15.3674 3.14746 14.0837 3.14746C12.8 3.14746 11.7593 3.83513 11.7593 4.6834C11.7593 5.53168 12.8 6.21935 14.0837 6.21935Z" fill="#eee"/>
<path d="M14.0837 10.9405C15.3674 10.9405 16.4081 10.2529 16.4081 9.4046C16.4081 8.55632 15.3674 7.86865 14.0837 7.86865C12.8 7.86865 11.7593 8.55632 11.7593 9.4046C11.7593 10.2529 12.8 10.9405 14.0837 10.9405Z" fill="#eee"/>
<path d="M14.0837 18.8089C15.3674 18.8089 16.4081 18.1213 16.4081 17.273C16.4081 16.4247 15.3674 15.7371 14.0837 15.7371C12.8 15.7371 11.7593 16.4247 11.7593 17.273C11.7593 18.1213 12.8 18.8089 14.0837 18.8089Z" fill="#eee"/>
<path d="M20.3124 14.0911C21.5597 14.0911 22.5707 13.4028 22.5707 12.5536C22.5707 11.7045 21.5597 11.0161 20.3124 11.0161C19.0652 11.0161 18.0542 11.7045 18.0542 12.5536C18.0542 13.4028 19.0652 14.0911 20.3124 14.0911Z" fill="#eee"/>
<path d="M20.3124 18.8121C21.5597 18.8121 22.5707 18.1237 22.5707 17.2746C22.5707 16.4254 21.5597 15.7371 20.3124 15.7371C19.0652 15.7371 18.0542 16.4254 18.0542 17.2746C18.0542 18.1237 19.0652 18.8121 20.3124 18.8121Z" fill="#eee"/>
</svg>
`;
// const iconSvg = (failed?) => `<svg class="svg" aria-label="Add comment" width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="transparent">
// <circle cx="10" cy="10" r="9" stroke="${!failed ? `#27AE60` : `#EB5757`}" stroke-width="2"/>
// </svg>
// `;

export function attachClickButton(state: ConfigPanelState) {
  let cloned = document.querySelector("#figma-systemize-button");
  if (!cloned) {
    const d = document.querySelector(`[data-testid="set-tool-comments"]`);
    cloned = d.cloneNode(true) as Element;
    cloned.id = "figma-systemize-button";
    cloned.children[0].setAttribute("data-tooltip", "Figma Systemize");
    cloned.children[0].setAttribute("data-tooltip-type", "text");
    const x = document.querySelector(`[class*="voice_toolbar--wrapper--"]`);
    if (x) {
      x.before(cloned);
    } else {
      const parent: HTMLDivElement = document.querySelector('[class*="toolbar_view--rightButtonGroup"]');
      parent.prepend(cloned);
    }
    cloned.addEventListener("click", () => {
      log("retrying to load everything...");
      watchRightPanelState(state);
    });
  }
  cloned.children[0].children[0].remove();
  cloned.children[0].appendChild(htmlString2El(iconSvg(!state.design?.autoLayout)));
}

export function watchRightPanelState(state: ConfigPanelState) {
  state.tab = determineCurrentTab(state);
  log("watchRightPanelState", state.tab);
  attachClickButton(state);

  if (state.tab == "design") {
    watchRightPanelDesignContentState(state);
  } else {
    state.design = null;
  }
}
