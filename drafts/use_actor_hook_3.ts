import { Actor } from "tarant";

import { useEffect, useState } from "react";
import { IReactMaterializerActor } from "./react_materializer";

function useDetectChanges(actor: IReactMaterializerActor) {
	// Dummy state used to force component re-render
	const [_, forceUpdate] = useState({});

	// Effect hook to listen for changes in __reactState
	useEffect(() => {
		console.log(
			"useDetectChanges Methods:",
			Object.getOwnPropertyNames(Object.getPrototypeOf(actor)),
		);

		// Define a change handler that forces a re-render
		const handleChange = () => {
			forceUpdate({});
		};

		// Subscribe to changes in the actor
		actor.subscribeToChanges(handleChange);

		// Cleanup function: Unsubscribe when the component unmounts
		return () => actor.unsubscribeFromChanges(handleChange);
	}, [actor.__reactState]); // Dependency on __reactState to re-run the effect when it changes
}

// Main hook that uses the custom change detection hook
export const useActorState = <T extends Actor>(actor: T): T => {
	// Use the custom hook to handle change detection
	useDetectChanges(actor as unknown as IReactMaterializerActor);

	// Return the actor instance for use in the component
	return actor;
};
