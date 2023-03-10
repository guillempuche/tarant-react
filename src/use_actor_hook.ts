import { Actor } from 'tarant'
import { useSyncExternalStore } from 'use-sync-external-store'

export const useActorState = (actor: Actor) => {
  function subscribe(callback) {
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
