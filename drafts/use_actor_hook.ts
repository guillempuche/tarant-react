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
export const useActorState = (actor: Actor): Actor => {
	/**
	 * Subscribes to the state changes of the actor by adding a callback to the
	 * actor's subscription set. When the state changes, all the callbacks in the
	 * set will be called.
	 *
	 * It returns a function to unsubscribe from the state changes.
	 */
	const subscribe = (callback: UseActorSubscribeCallback) => {
		if (!actor.ref || !actor.ref.reactSubs) {
			throw new Error(
				"Invalid actor reference or subscriptions are not defined.",
			);
		}

		// Generate a unique subscription ID.
		const subId = uuid();

		// Add the callback to the actor's subscription set
		actor.ref.reactSubs?.set(subId, callback);

		// Return a function to remove the subscription
		return () => {
			actor.ref.reactSubs?.delete(subId);
		};
	};

	/**
	 * Retrieves the current state snapshot of the actor. It returns the current
	 * state of the actor.
	 */
	const getSnapshot = (): Actor => {
		// if (!actor.ref || actor.ref.reactState == undefined) {
		//   throw new Error('Invalid actor reference or state is not defined.');
		// }

		console.log("getSnapshot:", actor.self?.reactState);
		return actor.ref;
	};

	// Use the `useSyncExternalStore` hook from the shim to handle subscription
	// and state retrieval for the given actor
	return useSyncExternalStore<Actor>(subscribe, getSnapshot);
};

// import { useState, useEffect } from 'react';
// export const useActorState = (actor: Actor | any) => {
//   // Initialize state with actor's current state
//   const [state, setState] = useState(() => actor.ref.__reactState);

//   useEffect(() => {
//     // Subscribe to actor updates
//     const unsubscribe = actor.ref.__reactSubs.set(uuid(), () => {
//       // Update local state when actor state changes
//       setState(actor.ref.__reactState);
//     });

//     // Unsubscribe on cleanup
//     return () => {
//       if (unsubscribe) {
//         unsubscribe();
//       }
//     };
//   }, [actor]);

//   return state;
// };
