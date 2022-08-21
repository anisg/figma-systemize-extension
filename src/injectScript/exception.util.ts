import { logProgress } from "./log.util";

export function catcher<T extends Error, X>(
  fn: () => X,
  exception: new (msg?: string) => T
): X {
  try {
    const r = fn();

    if ((r as any)?.then) {
      (r as any)?.catch((e) => {
        throw e;
      });
    }

    return r;
  } catch (e) {
    throw new exception();
  }
}

export async function catcherAsync<T extends Error, X>(
  fn: () => Promise<X>,
  exception: new (msg?: string) => T
): Promise<X> {
  try {
    const r = await fn();
    return r;
  } catch (e) {
    throw new exception();
  }
}

export function logWrapper<X>(action: string, fn: () => X): X {
  const _log = logProgress(`'${action}' started`);
  try {
    const r = fn();
    _log.done(`'${action}' successfully completed`);
    return r;
  } catch (e) {
    _log.done(`'${action}' failed to complete`);
    throw e;
  }
}

export abstract class CustomException extends Error {
  abstract errorMsg: string;
  helpMsg: string = null;
}
