export type ID = string;

export const println = (...args) => {};
// export const println = console.log;
export const jdump = (obj: any) => JSON.stringify(obj, null, 2);
export function isMacintosh() {
  return navigator.platform.indexOf("Mac") > -1;
}
export function r2a<T>(record: Record<any, T>): T[] {
  return Object.keys(record).map((k) => record[k]);
}

export function a2r<T>(arr: T[], key: string): Record<any, T> {
  let m = {};
  arr.forEach((e) => {
    m[e[key]] = e;
  });
  return m;
}

export function deepEqual(o1, o2) {
  if (typeof o1 !== "object" || o1 === null) return o1 === o2; // fast obj/null test
  let n;
  if (o1 instanceof Array) {
    // fast array test
    const l = o1.length;
    for (let i = 0; i < l; i++) {
      if (deepEqual(o1[i], o2[i])) {
      } else {
        return false;
      }
    }
    return true;
  }
  for (let i in o1) {
    if (!!o1[i] && deepEqual(o1[i], o2[i])) {
    } else {
      // fast hasProperty test
      return false;
    }
  }
  return true;
}

export function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
export function getUrlHostname(url) {
  if (url == null) return null;
  const u = new URL(url);
  return u.hostname.replace(/^www./, "");
}
export function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

/**
 * Retourne une fonction qui, tant qu'elle continue à être invoquée,
 * ne sera pas exécutée. La fonction ne sera exécutée que lorsque
 * l'on cessera de l'appeler pendant plus de N millisecondes.
 * Si le paramètre `immediate` vaut vrai, alors la fonction
 * sera exécutée au premier appel au lieu du dernier.
 * Paramètres :
 *  - func : la fonction à `debouncer`
 *  - wait : le nombre de millisecondes (N) à attendre avant
 *           d'appeler func()
 *  - immediate (optionnel) : Appeler func() à la première invocation
 *                            au lieu de la dernière (Faux par défaut)
 *  - context (optionnel) : le contexte dans lequel appeler func()
 *                          (this par défaut)
 */
function debounce(func: () => any, wait, immediate, context?) {
  var result;
  var timeout = null;
  return function () {
    var later = function () {
      timeout = null;
      if (!immediate) result = func();
    };
    var callNow = immediate && !timeout;
    // Tant que la fonction est appelée, on reset le timeout.
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) result = func();
    return result;
  };
}

export function debounceImmediate(func: () => any, waitMs) {
  return debounce(func, waitMs, true);
}

export function getParameterByName(name, url?: string): null | string {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
export const sleep = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function genId(length: number = 4) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function throttle(fn, waitMs: number) {
  let last: Date;
  let prevFn: any;
  let prevTimer: any;
  return (...args) => {
    const now = new Date();
    if (prevFn) {
      prevFn(undefined);
      clearTimeout(prevTimer);
      prevFn = null;
    }
    return new Promise((resolve) => {
      const x = last ? Math.max(0, waitMs - (now.getTime() - last.getTime())) : 0;
      prevFn = resolve;
      prevTimer = setTimeout(function () {
        last = now;
        prevFn = null;
        resolve(fn.apply(null, args));
      }, x);
    });
  };
}

export function isCurrentlySSR() {
  return typeof window === "undefined";
}
export function timeAgo(previous: Date) {
  const current = new Date();

  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = Date.parse(current.toString()) - Date.parse(previous.toString());

  const s = (d) => (d > 1 ? "s" : "");
  if (elapsed < msPerMinute) {
    return "just now";
    //const d = Math.round(elapsed/1000)
    //return  d + ` second${s(d)} ago`;
  } else if (elapsed < msPerHour) {
    const d = Math.round(elapsed / msPerMinute);
    return d + ` minute${s(d)} ago`;
  } else if (elapsed < msPerDay) {
    const d = Math.round(elapsed / msPerHour);
    return Math.round(elapsed / msPerHour) + ` hour${s(d)} ago`;
  } else if (elapsed < msPerMonth) {
    const d = Math.round(elapsed / msPerDay);
    return d + ` day${s(d)} ago`;
  } else if (elapsed < msPerYear) {
    const d = Math.round(elapsed / msPerMonth);
    return d + ` month${s(d)} ago`;
  } else {
    const d = Math.round(elapsed / msPerYear);
    return d + ` year${s(d)} ago`;
  }
}

export function slugify(str) {
  str = str.replace(/^\s+|\s+$/g, ""); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to = "aaaaeeeeiiiioooouuuunc------";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-"); // collapse dashes

  return str;
}

export function timestamp(date: string) {
  return Date.parse(date);
}

const arrayMoveMutate = (array, from, to) => {
  const startIndex = to < 0 ? array.length + to : to;
  const item = array.splice(from, 1)[0];
  array.splice(startIndex, 0, item);
};

export const arrayMove = (array, from, to) => {
  array = array.slice();
  arrayMoveMutate(array, from, to);
  return array;
};
export function makeid(length: number) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function getQueryParameter(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export function hashCode(s: string) {
  var hash = 0;
  if (s.length == 0) {
    return `${hash}`;
  }
  for (var i = 0; i < s.length; i++) {
    var char = s.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `${hash}`;
}

export function addCssStyle(styleString: string) {
  const style = document.createElement("style");
  style.textContent = styleString;
  document.head.append(style);
}

const mutationObserversMap: Record<string, MutationObserver> = {};

export function triggerEventOnSpecificChild(mutationObserverId: string, targetNode: Element, childCssSelector, callback: (eventAction: "created" | "deleted", childEl: Element) => void) {
  if (mutationObserverId in mutationObserversMap) {
    println("stop observer", mutationObserverId);
    mutationObserversMap[mutationObserverId].disconnect();
    delete mutationObserversMap[mutationObserverId];
  }
  var config = {
    attributes: true,
    childList: true,
    subtree: true,
  };
  var observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      if (mutation.type != "childList") return;
      if (mutation.target !== targetNode) return;
      println("root changed", mutation);
      // check addition
      const createdEl: Element = [...mutation.addedNodes].find((el: any) => el.matches && el.matches(childCssSelector)) as any;
      createdEl && callback("created", createdEl);

      // check removal
      const removedEl: Element = [...mutation.removedNodes].find((el: any) => el.matches && el.matches(childCssSelector)) as any;
      removedEl && callback("deleted", null);
    });
  });
  mutationObserversMap[mutationObserverId] = observer;
  observer.observe(targetNode, config);
}

export function triggerEventOnAddOrDeleteDirectChild(mutationObserverId: string, targetNode: Element, childCssSelector, callback: (eventAction: "created" | "deleted", childEl: Element) => void) {
  if (mutationObserverId in mutationObserversMap) {
    println("stop observer", mutationObserverId);
    mutationObserversMap[mutationObserverId].disconnect();
    delete mutationObserversMap[mutationObserverId];
  }
  var config = {
    attributes: false,
    childList: true,
    subtree: false,
  };
  var observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      if (mutation.type != "childList") return;
      if (mutation.target !== targetNode) return;
      // check addition
      const createdEl: Element = [...mutation.addedNodes].find((el: any) => el.matches && el.matches(childCssSelector)) as any;
      createdEl && callback("created", createdEl);

      // check removal
      const removedEl: Element = [...mutation.removedNodes].find((el: any) => el.matches && el.matches(childCssSelector)) as any;
      removedEl && callback("deleted", null);
    });
  });
  mutationObserversMap[mutationObserverId] = observer;
  observer.observe(targetNode, config);
}

export function triggerEventOnUpdatedChild(mutationObserverId: string, targetNode: Element, childCssSelector, callback: (eventAction: "created" | "deleted", childEl: Element) => void) {
  if (mutationObserverId in mutationObserversMap) {
    println("stop observer", mutationObserverId);
    mutationObserversMap[mutationObserverId].disconnect();
    delete mutationObserversMap[mutationObserverId];
  }
  var config = {
    attributes: false,
    childList: true,
    subtree: false,
  };
  var observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      if (mutation.type != "childList") return;
      if (mutation.target !== targetNode) return;
      // check addition
      const createdEl: Element = [...mutation.addedNodes].find((el: any) => el.matches && el.matches(childCssSelector)) as any;
      createdEl && callback("created", createdEl);

      // check removal
      const removedEl: Element = [...mutation.removedNodes].find((el: any) => el.matches && el.matches(childCssSelector)) as any;
      removedEl && callback("deleted", null);
    });
  });
  mutationObserversMap[mutationObserverId] = observer;
  observer.observe(targetNode, config);
}

export function createHtmlElement(str: string) {
  var child = document.createElement("div");
  child.innerHTML = str;
  return child;
}

export async function repeatWhileNotTrue(fn, { intervalMs, timeoutMs }: { intervalMs: number; timeoutMs: number }) {
  let elapsedMs = 0;
  while (elapsedMs < timeoutMs && !fn()) {
    await sleep(intervalMs);
    elapsedMs += intervalMs;
  }
  return elapsedMs;
}
