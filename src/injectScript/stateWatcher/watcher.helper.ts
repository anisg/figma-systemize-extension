import { watch } from "fs";
import { CustomException } from "../exception.util";
import {
  println,
  repeatWhileNotTrue,
  triggerEventOnAddOrDeleteDirectChild,
  triggerEventOnSpecificChild,
} from "../utils";

/**
 * DOM hierarchy of the right panel of Figma:
 *
 * - div[name="propertiesPanelContainer"]: root property panel
 *   - div: #propertyPanelContent
 *     - div.*tabsHeader*.: tabs header (Design/Prototype/Inspect)
 *       ...
 *     - div: propertiesContent
 *       - div
 *         - div
 *           - div.*innerScrollContainer*
 *             - div.*propertiesPanel*: main content
 *               - span
 *                 - span[0]
 *                 - span[1] : #designSectionsContainer
 *                   - div[*].cachedSubtree: each one of them is a panel section, they all have "display: block|none"
 *                     simple panel sections (such as align):
 *                     - div[*].(*align_panel--*)
 *                     complex panel sections (such as auto-layout / layout grid):
 *                     - div[*].
 *                 - span[2]
 */
export const panelDom = {
  findPropertyPanelContent() {
    const propertyPanelRootEl = document.querySelector(
      `div[name="propertiesPanelContainer"]`
    );
    return propertyPanelRootEl.children[0];
  },
  propertyPanelContent: {
    findDesignSectionsContainer(propertyPanelContent: Element) {
      let el = propertyPanelContent.children[1];
      while (el?.tagName.toLowerCase() != "span") {
        el = el.children[0];
      }
      return el.children[1];
    },
  },
};

function isInDesignMode(propertyPanelContentEl): boolean {
  // the creation
  return propertyPanelContentEl.children[0].children[0].matches(
    `[class*="tabActive"]`
  );
}

function isInPrototypeMode(propertyPanelContentEl): boolean {
  // the creation
  return propertyPanelContentEl.children[0]?.children[1]?.matches(
    `[class*="tabActive"]`
  );
}

export type ConfigPanelState = {
  loading: boolean;
  tab?: "design" | "prototype" | "inspect";
  _el?: Element;
  design?: {
    _el: Element;
    autoLayout?: {
      _el: Element;
      state?: "off" | "expanded";
      expanded?: {
        direction: "unknown" | "down" | "right";
        spaceBetween?: {
          _el: Element;
        };
      };
    };
  };
};

export type ConfigPanelStateInDesignMode = Omit<ConfigPanelState, "design"> &
  Required<Pick<ConfigPanelState, "design">>;

type PanelTree = {
  rootContentEl: Element;
};

export function attachPanelContent(state: ConfigPanelState) {
  state._el = panelDom.findPropertyPanelContent();
}

export function determineCurrentTab(
  state: ConfigPanelState
): "design" | "prototype" | "inspect" {
  if (isInDesignMode(state._el)) {
    return "design";
  }
  if (isInPrototypeMode(state._el)) {
    return "prototype";
  }
  return "inspect";
}
