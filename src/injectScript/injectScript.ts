import { watchDomState } from "./stateWatcher/watchDomState";
import { sleep } from "./utils";

/* entry point of the script */
async function main() {
  watchDomState();
  setInterval(() => {
    watchDomState();
  }, 1300);
}

main();
