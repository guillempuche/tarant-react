import { useEffect, useReducer, useRef } from "react";
import { Actor } from "tarant";
import { v4 as uuid } from "uuid";

export const useActorState = <T extends Actor>(actor: T): T => {
	const [, forceUpdate] = useReducer((x) => x + 1, 0);
	const actorRef = useRef(actor);

	// Creating a Proxy to wrap the actor
	const actorProxy = useRef(
		new Proxy(actorRef.current, {
			get(target, prop, receiver) {
				// Custom logic to track property access
				return Reflect.get(target, prop, receiver);
			},
			// Additional traps (set, deleteProperty, etc.) can be added as needed
		}),
	).current;

	useEffect(() => {
		// Subscribe to actor's changes
		const subId = uuid(); // Assuming uuid function is available
		actorRef.current.stateChangeSubscription?.set(subId, forceUpdate);

		return () => {
			// Unsubscribe logic
			actorRef.current.stateChangeSubscription?.delete(subId);
		};
	}, [forceUpdate]);

	return actorProxy;
};
