import { Actor } from 'tarant'
import { useSyncExternalStore } from 'use-sync-external-store'

export type UseActorSubscribeCallback = () => void;

export const useActorState = (actor: Actor | any) => {
  function subscribe(callback: UseActorSubscribeCallback) {
    const subId = +new Date()
    actor.ref.__reactSubs.set(subId, callback)

    return () => {
      actor.ref.__reactSubs.delete(subId)
    }
  }

  function getSnapshot() {
    return actor.ref.__reactState
  }

  return useSyncExternalStore(subscribe, getSnapshot)
}
