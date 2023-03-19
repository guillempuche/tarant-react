import { Actor } from 'tarant';
// This doesn't work in ESM, because use-sync-external-store only exposes CJS.
// See: https://github.com/pmndrs/valtio/issues/452
// The following is a workaround until ESM is supported.
import { useSyncExternalStore } from 'use-sync-external-store/shim';

export type UseActorSubscribeCallback = () => void;

/**
 * React Hook to communicate with actors.
 *
 * @param actor
 * @returns
 */
export const useActorState = (actor: Actor | any) => {
  function subscribe(callback: UseActorSubscribeCallback) {
    const subId = +new Date();
    actor.ref.__reactSubs.set(subId, callback);

    return () => {
      actor.ref.__reactSubs.delete(subId);
    };
  }

  function getSnapshot(): Actor | any {
    return actor.ref.__reactState;
  }

  return useSyncExternalStore<Actor | any>(subscribe, getSnapshot);
};
