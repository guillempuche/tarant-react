// This doesn't work in ESM, because use-sync-external-store only exposes CJS.
// See: https://github.com/pmndrs/valtio/issues/452
// The following is a workaround until ESM is supported.
import { useSyncExternalStore } from 'use-sync-external-store/shim';
export const useActorState = (actor) => {
    function subscribe(callback) {
        const subId = +new Date();
        actor.ref.__reactSubs.set(subId, callback);
        return () => {
            actor.ref.__reactSubs.delete(subId);
        };
    }
    function getSnapshot() {
        return actor.ref.__reactState;
    }
    return useSyncExternalStore(subscribe, getSnapshot);
};
