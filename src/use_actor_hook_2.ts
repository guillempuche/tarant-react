import { isEqual } from 'lodash';
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useReducer,
	useRef,
	useState,
} from 'react';
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

export function useActorState1(actor: Actor) {
	const [state, setState] = useState(actor.stateCopy);

	const subscription = useCallback(() => {
		try {
			setState({ ...actor.stateCopy });
		} catch (error) {
			console.error('Error updating actor state:', error);
		}
	}, [actor.stateCopy]);

	useEffect(() => {
		const subscriptionId = actor.id + uuid();
		actor.stateChangeSubscriptions?.set(subscriptionId, subscription);
		return () => {
			actor.stateChangeSubscriptions?.delete(subscriptionId);
		};
	}, [subscription, actor]);

	return actor;
}

// Overload definitions
export function useActor<T extends Actor>(actor: T, debug?: boolean): T;
export function useActor<T extends Actor>(
	actor: T | undefined,
	debug?: boolean
): T | undefined;
export function useActor<T extends Actor>(
	actor: T | undefined,
	debug: boolean = false
): T | undefined {
	const [state, setState] = useState(actor?.stateCopy);
	useEffect(() => {
		if (actor) {
			const subscriptionId = actor.id + uuid();
			const subscription = () => {
				const newState = actor.stateCopy;
				if (debug) console.log('State updated:', newState);
				setState({ ...newState });
			};
			actor.stateChangeSubscriptions?.set(subscriptionId, subscription);
			return () => {
				actor.stateChangeSubscriptions?.delete(subscriptionId);
			};
		}
	}, [actor?.stateCopy, state]);
	return actor;
}

// useActorStateReducer
export function useActorStateReducer(actor: Actor) {
	const [state, dispatch] = useReducer(
		(_: any, newState: any) => newState,
		actor.stateCopy
	);

	useEffect(() => {
		const subscriptionId = actor.id + uuid();
		console.log(`useActorState state = ${state}`);
		actor.stateChangeSubscriptions?.set(subscriptionId, (newState: any) =>
			dispatch(newState)
		);
		return () => {
			actor.stateChangeSubscriptions?.delete(subscriptionId);
		};
	}, [actor]);

	return actor;
}
export function useActorStateSubsRef(actor: Actor) {
	const [state, setState] = useState(actor.stateCopy);
	const subscriptionIdRef = useRef(actor.id + uuid());

	useEffect(() => {
		actor.stateChangeSubscriptions?.set(subscriptionIdRef.current, () =>
			setState({ ...actor.stateCopy })
		);
		return () => {
			actor.stateChangeSubscriptions?.delete(subscriptionIdRef.current);
		};
	}, [actor]);

	return actor;
}

export function useActorStateStateRef(actor: Actor) {
	// export function useActorState(actor: Actor) {
	const [state, setState] = useState(actor.stateCopy);
	const currentStateRef = useRef(actor.stateCopy);
	useEffect(() => {
		console.log(`useActorState useEffect called`);
		const subscriptionId = actor.id + uuid();
		const subscription = () => {
			if (!isEqual(currentStateRef.current, actor.stateCopy)) {
				currentStateRef.current = actor.stateCopy;
				setState({ ...actor.stateCopy });
			}
		};
		actor.stateChangeSubscriptions?.set(subscriptionId, subscription);
		return () => {
			actor.stateChangeSubscriptions?.delete(subscriptionId);
		};
	}, []); // Empty dependency array to set up the subscription once
	return actor;
}

// export function useActorStateLayout(actor: Actor) {
// 	const [state, setState] = useState(actor.stateCopy);
// 	useLayoutEffect(() => {
// 		const subscriptionId = actor.id + uuid();
// 		actor.stateChangeSubscriptions?.set(subscriptionId, () =>
// 			setState({ ...actor.stateCopy })
// 		);
// 		return () => {
// 			actor.stateChangeSubscriptions?.delete(subscriptionId);
// 		};
// 	}, [actor]);
// 	return actor;
// }

// export function useActorStateContext(actor: Actor) {
// 	const [state, setState] = useState(actor.stateCopy);
// 	useEffect(() => {
// 		const subscriptionId = actor.id + uuid();
// 		actor.stateChangeSubscriptions?.set(subscriptionId, () =>
// 			setState({ ...actor.stateCopy })
// 		);
// 		return () => {
// 			actor.stateChangeSubscriptions?.delete(subscriptionId);
// 		};
// 	}, [actor]);
// 	return <ActorContext.Provider value={actor}>{actor}</ActorContext.Provider>;
// }

// export function useActorStateMemo(actor: Actor) {
// 	const [state, setState] = useState(actor.stateCopy);
// 	useEffect(() => {
// 		const subscriptionId = actor.id + uuid();
// 		actor.stateChangeSubscriptions?.set(subscriptionId, () =>
// 			setState({ ...actor.stateCopy })
// 		);
// 		return () => {
// 			actor.stateChangeSubscriptions?.delete(subscriptionId);
// 		};
// 	}, [actor]);
// 	return useMemo(() => actor, [state]);
// }

// export function useActorStateImperative(actor: Actor) {
// 	const [state, setState] = useState(actor.stateCopy);
// 	const actorRef = useRef(actor);
// 	useImperativeHandle(actorRef, () => ({
// 		updateState: () => setState({ ...actor.stateCopy }),
// 	}));
// 	useEffect(() => {
// 		const subscriptionId = actor.id + uuid();
// 		actor.stateChangeSubscriptions?.set(subscriptionId, () =>
// 			actorRef.current.updateState()
// 		);
// 		return () => {
// 			actor.stateChangeSubscriptions?.delete(subscriptionId);
// 		};
// 	}, [actor]);
// 	return actorRef.current;
// }

// export function useActorStateDebounced(actor: Actor) {
// 	const [state, setState] = useState(actor.stateCopy);
// 	const updateState = useCallback(
// 		_.debounce(() => setState({ ...actor.stateCopy }), 100),
// 		[actor]
// 	);
// 	useEffect(() => {
// 		const subscriptionId = actor.id + uuid();
// 		actor.stateChangeSubscriptions?.set(subscriptionId, updateState);
// 		return () => {
// 			updateState.cancel();
// 			actor.stateChangeSubscriptions?.delete(subscriptionId);
// 		};
// 	}, [actor, updateState]);
// 	return actor;
// }

export function useActorStateForce<T extends Actor>(actor: T) {
	// export function useActorState(actor: Actor) {
	const forceUpdate = useForceUpdate();

	useEffect(() => {
		console.log(`useActorState useEffect called`);

		const subscriptionId = actor.id + uuid();
		actor.stateChangeSubscriptions?.set(subscriptionId, () => {
			console.log(`useActorState subscription called`);
			forceUpdate();
		});
		return () => {
			actor.stateChangeSubscriptions?.delete(subscriptionId);
		};
	}, [actor, actor.stateCopy]);

	return actor;
}
