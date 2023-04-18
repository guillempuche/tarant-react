import { Actor } from 'tarant';
import { useCallback } from 'react';
import { v4 as uuid } from 'uuid';

// This doesn't work in ESM, because use-sync-external-store only exposes CJS.
// See: https://github.com/pmndrs/valtio/issues/452
// The following is a workaround until ESM is supported.
import { useSyncExternalStore } from 'use-sync-external-store/shim';

export type UseActorSubscribeCallback = () => void;

/**
 * React Hook to communicate with actors. This hook is designed to be used with
 * the Tarant library, providing an interface for subscribing to actor state changes
 * in a React application.
 *
 * @param actor - The actor instance you want to subscribe to.
 * @returns - The current state of the actor.
 */
export const useActorState = (actor: Actor | any): Actor | any => {
  /**
   * Subscribes to the state changes of the actor by adding a callback to the
   * actor's subscription set. When the state changes, all the callbacks in the
   * set will be called.
   *
   * It returns a function to unsubscribe from the state changes.
   *
   * `useCallback` memoizes the subscribe function to prevent unnecessary re-renders.
   */
  const subscribe = useCallback(
    (callback: UseActorSubscribeCallback) => {
      if (!actor.ref || !actor.ref.__reactSubs) {
        throw new Error(
          'Invalid actor reference or subscriptions are not defined.'
        );
      }

      // Generate a unique subscription ID.
      const subId = uuid();

      // Add the callback to the actor's subscription set
      actor.ref.__reactSubs.set(subId, callback);

      // Return a function to remove the subscription
      return () => {
        actor.ref.__reactSubs.delete(subId);
      };
    },
    [actor]
  ); // Ensure useCallback dependency array includes 'actor'

  /**
   * Retrieves the current state snapshot of the actor. It returns the current
   * state of the actor.
   *
   * `useCallback` memoizes `getSnapshot` function to prevent unnecessary re-renders.
   */
  // function getSnapshot(): Actor | any {
  const getSnapshot = useCallback((): Actor | any => {
    if (!actor.ref || !actor.ref.__reactState) {
      throw new Error('Invalid actor reference or state is not defined.');
    }

    return actor.ref.__reactState;
  }, [actor]);

  // Use the `useSyncExternalStore` hook from the shim to handle subscription
  // and state retrieval for the given actor
  return useSyncExternalStore<Actor | any>(subscribe, getSnapshot);
};
