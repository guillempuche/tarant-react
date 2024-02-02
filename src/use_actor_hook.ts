import { useEffect, useState } from "react";
import { Actor } from "tarant";
import { v4 as uuid } from "uuid";

// Overload definitions
export function useActor<T extends Actor>(
	actor: T,
	options?: { debug?: boolean },
): T;
export function useActor<T extends Actor>(
	actor: T | undefined,
	options?: { debug?: boolean },
): T | undefined;

export function useActor<T extends Actor>(
	actor: T | undefined,
	options: { debug?: boolean } = {},
): T | undefined {
	const [_, setState] = useState(actor?.stateCopy);

	useEffect(() => {
		if (actor) {
			const subscriptionId = actor.id + uuid();
			const subscription = () => {
				const newState = actor.stateCopy;
				if (options.debug === true)
					console.log("Actor deep copy updated:", newState);
				setState({ ...newState });
			};
			actor.stateChangeSubscriptions?.set(subscriptionId, subscription);
			return () => {
				actor.stateChangeSubscriptions?.delete(subscriptionId);
			};
		}
	}, [actor?.stateCopy]);
	return actor;
}
