import { watchDomState } from "./stateWatcher/watchDomState";

/* entry point of the script */
async function main() {
  window.addEventListener("load", async () => {
    watchDomState();
  });
}

main();
