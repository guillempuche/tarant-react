import { Actor } from 'tarant';
import { Some } from 'ts-results';
import { isEqual } from 'lodash';
import { useState, useCallback, useEffect, useReducer, useRef } from 'react';
import { v4 } from 'uuid';

/**
 * A materializer for React that integrates with the Tarant actor model.
 * This class implements the `IMaterializer` interface from Tarant and provides
 * lifecycle hooks to interact with React components.
 */
class ReactMaterializer {
    /**
     * Invoked when an actor is initialized. Sets up the state change subscription map.
     * @param actor The actor being initialized.
     */
    onInitialize(actor) {
        actor.stateCopy = deepCloning(actor);
        actor.stateChangeSubscriptions = new Map();
    }
    /**
     * Lifecycle hook called before an actor processes a message.
     * @param actor The actor that received the message.
     * @param message The message to be processed.
     */
    onBeforeMessage(actor, message) { }
    /**
     * Lifecycle hook called after an actor processes a message.
     * This triggers callbacks in the actor's state change subscription.
     * @param actor The actor that processed the message.
     * @param message The message that was processed.
     */
    onAfterMessage(actor, message) {
        actor.stateCopy = deepCloning(actor);
        actor.stateChangeSubscriptions?.forEach((callback) => callback());
    }
    /**
     * Error handling for the actor. Logs errors to the console.
     * @param actor The actor where the error occurred.
     * @param message The message that caused the error.
     * @param error The error object.
     */
    onError(actor, message, error) {
        console.error(error);
    }
}
function deepCloning(actor) {
    const skipFields = new Set([
        'stateCopy',
        'stateChangeSubscriptions',
        'self',
        'ref',
        'partitions',
        'subscriptions',
        'system',
        'materializers',
        'supervisor',
        'scheduled',
        'topicSubscriptions',
        'busy',
    ]);
    function cloneValue(value) {
        if (value instanceof Actor) {
            return deepCloneObject(value);
        }
        if (value instanceof Some) {
            return cloneValue(value.val);
        }
        if (value instanceof Date) {
            return new Date(value);
        }
        if (value instanceof Map) {
            return new Map(Array.from(value, ([key, val]) => [key, cloneValue(val)]));
        }
        if (value instanceof Set) {
            return new Set(Array.from(value, cloneValue));
        }
        if (Array.isArray(value)) {
            return value.map(cloneValue);
        }
        if (value !== null && typeof value === 'object') {
            return deepCloneObject(value);
        }
        return value;
    }
    // Function to clone object considering getters
    function deepCloneObject(actor) {
        if (actor.id === undefined)
            return undefined;
        const cloneObj = { id: actor.id };
        const prototype = Object.getPrototypeOf(actor);
        Object.getOwnPropertyNames(prototype).forEach((prop) => {
            if (skipFields.has(prop))
                return;
            if (prop === 'constructor')
                return;
            const descriptor = Object.getOwnPropertyDescriptor(prototype, prop);
            if (descriptor && typeof descriptor.get === 'function') {
                cloneObj[prop] = cloneValue(actor[prop]);
            }
        });
        return cloneObj;
    }
    const clone = deepCloneObject(actor);
    return clone;
}

/**
 * Custom React hook to force a component to re-render.
 * @returns A function that can be called to force a re-render.
 */
const useForceUpdate = () => {
    // useReducer is used to create a state update function.
    const [, forceUpdate] = useReducer((x) => x + 1, 0);
    return forceUpdate;
};
function useActorState1(actor) {
    const [state, setState] = useState(actor.stateCopy);
    const subscription = useCallback(() => {
        try {
            setState({ ...actor.stateCopy });
        }
        catch (error) {
            console.error('Error updating actor state:', error);
        }
    }, [actor.stateCopy]);
    useEffect(() => {
        const subscriptionId = actor.id + v4();
        actor.stateChangeSubscriptions?.set(subscriptionId, subscription);
        return () => {
            actor.stateChangeSubscriptions?.delete(subscriptionId);
        };
    }, [subscription, actor]);
    return actor;
}
function useActor(actor, debug = false) {
    const [state, setState] = useState(actor?.stateCopy);
    useEffect(() => {
        if (actor) {
            const subscriptionId = actor.id + v4();
            const subscription = () => {
                const newState = actor.stateCopy;
                if (debug)
                    console.log('State updated:', newState);
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
function useActorStateReducer(actor) {
    const [state, dispatch] = useReducer((_, newState) => newState, actor.stateCopy);
    useEffect(() => {
        const subscriptionId = actor.id + v4();
        console.log(`useActorState state = ${state}`);
        actor.stateChangeSubscriptions?.set(subscriptionId, (newState) => dispatch(newState));
        return () => {
            actor.stateChangeSubscriptions?.delete(subscriptionId);
        };
    }, [actor]);
    return actor;
}
function useActorStateSubsRef(actor) {
    const [state, setState] = useState(actor.stateCopy);
    const subscriptionIdRef = useRef(actor.id + v4());
    useEffect(() => {
        actor.stateChangeSubscriptions?.set(subscriptionIdRef.current, () => setState({ ...actor.stateCopy }));
        return () => {
            actor.stateChangeSubscriptions?.delete(subscriptionIdRef.current);
        };
    }, [actor]);
    return actor;
}
function useActorStateStateRef(actor) {
    // export function useActorState(actor: Actor) {
    const [state, setState] = useState(actor.stateCopy);
    const currentStateRef = useRef(actor.stateCopy);
    useEffect(() => {
        console.log(`useActorState useEffect called`);
        const subscriptionId = actor.id + v4();
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
function useActorStateForce(actor) {
    // export function useActorState(actor: Actor) {
    const forceUpdate = useForceUpdate();
    useEffect(() => {
        console.log(`useActorState useEffect called`);
        const subscriptionId = actor.id + v4();
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

export { ReactMaterializer, useActor, useActorState1, useActorStateForce, useActorStateReducer, useActorStateStateRef, useActorStateSubsRef };
//# sourceMappingURL=bundle.js.map
