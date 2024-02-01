import { Actor } from "tarant";
import { v4 as uuid } from "uuid";

// This doesn't work in ESM, because use-sync-external-store only exposes CJS.
// See: https://github.com/pmndrs/valtio/issues/452
// The following is a workaround until ESM is supported.
import { useSyncExternalStore } from "use-sync-external-store/shim";
// import { useSyncExternalStore } from 'react';

export type UseActorSubscribeCallback = () => void;

/**
 * React Hook to communicate with actors. This hook is designed to be used with
 * the Tarant library, providing an interface for subscribing to actor state changes
 * in a React application.
 *
 * @param actor - The actor instance you want to subscribe to.
 * @returns - The current state of the actor.
 */
export const useActorState = <T extends Actor>(actor: T): T => {
	console.log("useActorState called with actor:", actor.id);

	/**
	 * Subscribes to the state changes of the actor by adding a callback to the
	 * actor's subscription set. When the state changes, all the callbacks in the
	 * set will be called.
	 *
	 * It returns a function to unsubscribe from the state changes.
	 */
	const subscribe = (callback: UseActorSubscribeCallback) => {
		if (!actor.stateChangeSubscription) {
			console.error(
				"Invalid actor reference or subscriptions are not defined.",
			);
		}

		const subId = uuid();

		// Add the callback to the actor's subscription set
		actor.stateChangeSubscription?.set(subId, callback);
		console.log(`subscribed ${subId}`);

		// Return a function to remove the subscription
		return () => {
			console.log(`unsubscribe ${subId}`);
			actor.stateChangeSubscription?.delete(subId);
		};
	};

	/**
	 * Retrieves the current state snapshot of the actor. It returns the current
	 * state of the actor.
	 */
	const getSnapshot = (): T => {
		if (actor.stateChangeSubscription === undefined) {
			console.error("State is not defined on actor.");
		}

		// console.log('getSnapshot:', actor);
		// return actor.reactState as T;
		return actor;
	};

	// Use the `useSyncExternalStore` hook from the shim to handle subscription
	// and state retrieval for the given actor
	return useSyncExternalStore<T>(subscribe, getSnapshot);
};
