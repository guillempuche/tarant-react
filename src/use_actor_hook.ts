import { useEffect, useReducer } from 'react';
import { Actor } from 'tarant';
import { v4 as uuid } from 'uuid';

/**
 * Custom React hook to force a component to re-render.
 * @returns A function that can be called to force a re-render.
 */
const useForceUpdate = () => {
	// useReducer is used to create a state update function.
	const [, forceUpdate] = useReducer((x) => x + 1, 0);

	return forceUpdate;
};

/**
 * Custom React hook to synchronize a React component's state with a Tarant actor.
 * 
 * @example
 
 * // Define the actor
 * interface MyActorConstructor extends ActorConstructor {
 *   paramA: string;
 * }
 * class MyActor extends Actor {
 *   #fieldA: string;
 * 
 *   constructor({ paramA }: MyActorConstructor) {
 *     super();
 *     this.#fieldA = paramA;
 *   }
 *
 *   get fieldA(): string {
 *     return this.#fieldA;
 *   }
 * }
 *
 * // Initialize the actor system with ReactMaterializer
 * const actorSystem = ActorSystem.for(
 *   ActorSystemConfigurationBuilder.define()
 *     .withMaterializers([new ReactMaterializer()])
 *     .done(),
 * );
 * const myActor = actorSystem.actorOf<MyActor, MyActorConstructor>(MyActor, { paramA: 'initial' });
 *
 * // Usage in a React component
 * import React from 'react';
 * import { useActorState } from 'tarant-react-hook';
 * 
 * const MyComponent: React.FC = () => {
 *   const actor = useActorState(myActor);
 *   return <div>{actor.fieldA}</div>;
 * };
 * 
 * @param actor - The actor whose state is to be synchronized.
 * @returns The same actor, allowing React components to reflect its updated state.
 */
export const useActorState = <T extends Actor>(actor: T): T => {
	const forceUpdate = useForceUpdate();

	// It manages the subscription and unsubscription to the actor's state changes.
	useEffect(() => {
		// const subscriptionId = uuid();
		const subscriptionId = actor.id + uuid();

		// Subscribe the forceUpdate function to the actor's state changes.
		actor.stateChangeSubscriptions?.set(subscriptionId, forceUpdate);

		// Cleanup function for useEffect. It unsubscribes on component unmount.
		return () => {
			// Unsubscribe when the component unmounts
			actor.stateChangeSubscriptions?.delete(subscriptionId);
		};
	}, [actor, forceUpdate]);

	return actor;
};
