import { println } from "./utils";
let actionsPending = 0;

export const log = (msg = "", ...args) => {
  println(`${" ".repeat(actionsPending * 4)}${msg}`, ...args);
};

export const error = (msg = "", ...args) => {
  println(`${" ".repeat(actionsPending * 4)}${msg}`, ...args);
};

export const success = (msg = "", ...args) => {
  println(`${" ".repeat(actionsPending * 4)}${msg}`, ...args);
};

export const logProgress = (title) => {
  log(`${title}…`);
  actionsPending += 1;
  let done = false;

  return {
    _startingTime: Date.now(),
    _getDiffTime() {
      return Date.now() - this._startingTime;
    },
    _getDiffTimeStr() {
      const diffTimeMs = this._getDiffTime() / 1000;
      if (diffTimeMs < 0.1) {
        return "";
      }
      return ` (+${diffTimeMs.toFixed(2)}s)`;
    },
    done(doneMsg = "", ...args) {
      if (done) {
        throw new Error("You can't call done() twice");
      }
      success(doneMsg + this._getDiffTimeStr(), ...args);
      actionsPending -= 1;
      done = true;
    },
    error(errorMsg = "") {
      if (done) {
        throw new Error("You can't call done() twice");
      }
      error(errorMsg + this._getDiffTimeStr());
      actionsPending -= 1;
      done = true;
    },
  };
};
