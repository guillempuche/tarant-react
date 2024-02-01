import { useCallback, useEffect, useRef, useState } from "react";
import { Actor } from "tarant";

// export const useActorState = <T extends Actor>(actor: T) => {
//   // Use a state to trigger re-renders, but we don't store the actor's state directly.
//   const [, setTrigger] = useState({});
//   let proxy: T;

//   useEffect(() => {
//     const handler: ProxyHandler<T> = {
//       set(target, property, value, receiver) {
//         // Perform the default set operation
//         Reflect.set(target, property, value, receiver);

//         // Trigger a state update to re-render the component
//         setTrigger({});
//         return true;
//       },
//     };

//     // Create a proxy to wrap the actor
//     proxy = new Proxy(actor, handler);

//     // Return cleanup function if necessary
//     return () => {
//       // Cleanup logic (if needed)
//     };
//   }, [actor]);

//   // Return the proxy to allow interaction with the actor's state
//   return proxy;
// };

export const useActorStateA = <T extends Actor>(actor: T) => {
	const [, setTrigger] = useState({});
	const actorRef = useRef(actor);
	const proxyRef = useRef<T>(
		new Proxy(actor, {
			set(target, property, value, receiver) {
				console.log(`useActorStateA ${property as string}`);
				Reflect.set(target, property, value, receiver);
				setTrigger({});
				return true;
			},
		}),
	);
	useEffect(() => {
		actorRef.current = actor;
		return () => {
			// Cleanup logic here if needed
		};
	}, [actor]); // React guarantees that each render has its own `actor`
	return proxyRef.current;
};

export const useActorStateB = <T extends Actor>(actor: T) => {
	const [state, setState] = useState({});
	useEffect(() => {
		// Define a handler for the proxy
		const handler: ProxyHandler<T> = {
			set(target, property, value, receiver) {
				// Perform the default set operation
				const result = Reflect.set(target, property, value, receiver);

				// Trigger a state update to re-render the component
				// Using a functional update since we don't care about the previous state
				setState((prevState) => ({ ...prevState, [property]: value }));
				return result;
			},
		};
		// Create a proxy to wrap the actor
		const proxy = new Proxy(actor, handler);
		// Return the cleanup function
		return () => {
			// Cleanup logic (if needed)
		};
	}, [actor]);
	// Return the current state
	return state;
};

export const useActorStateCError = <T extends Actor>(actor: T) => {
	const [, setTick] = useState(0); // Dummy state

	useEffect(() => {
		const handler: ProxyHandler<T> = {
			set(target, property, value, receiver) {
				// Perform the default set operation
				Reflect.set(target, property, value, receiver);

				// Trigger a re-render by updating the dummy state
				setTick((tick) => tick + 1);

				return true;
			},
		};

		const proxy = new Proxy(actor, handler);

		return () => {
			// Cleanup if necessary
		};
	}, [actor]);

	// Return the actor itself (or the proxy)
	return actor;
};

export const useActorStateD = <T extends Actor>(actor: T) => {
	const [, updateState] = useState({});
	const actorRef = useRef(actor);

	const forceUpdate = useCallback(() => {
		updateState({});
	}, []);

	useEffect(() => {
		actorRef.current = actor; // Keep the ref up-to-date

		const handler: ProxyHandler<T> = {
			set(target, property, value, receiver) {
				const result = Reflect.set(target, property, value, receiver);
				console.log(`useActorStateD ${property as string}`);
				forceUpdate();
				return result;
			},
		};

		const proxy = new Proxy(actor, handler);

		return () => {
			// Cleanup if necessary
		};
	}, [actor, forceUpdate]);

	return actorRef.current;
};

export const useActorStateEErrorUndefined = <T extends Actor>(actor: T) => {
	const [, updateState] = useState({});
	const actorRef = useRef(actor);
	const proxyRef = useRef<T>();

	const forceUpdate = useCallback(() => {
		updateState({});
	}, []);

	useEffect(() => {
		// This ensures the actorRef is always up-to-date
		actorRef.current = actor;

		// Creating a new Proxy if the actor changes
		proxyRef.current = new Proxy(actor, {
			set(target, property, value, receiver) {
				// Perform the default set operation
				Reflect.set(target, property, value, receiver);

				// Force an update in the component
				forceUpdate();
				return true;
			},
		});

		return () => {
			// Cleanup if necessary
		};
	}, [actor, forceUpdate]);

	// Return the proxy to allow interaction with the actor's state
	return proxyRef.current;
};

export const useActorStateF = <T extends Actor>(actor: T) => {
	const [, updateState] = useState({});
	const actorRef = useRef(actor);

	// Force update callback
	const forceUpdate = useCallback(() => {
		updateState({});
	}, []);

	// Create or update the proxy
	const createOrUpdateProxy = useCallback(
		(currentActor: T) => {
			return new Proxy(currentActor, {
				set(target, property, value, receiver) {
					// Perform the default set operation
					Reflect.set(target, property, value, receiver);

					// Force an update in the component
					forceUpdate();
					return true;
				},
			});
		},
		[forceUpdate],
	);

	// Initialize the proxy immediately
	const proxyRef = useRef(createOrUpdateProxy(actor));

	useEffect(() => {
		// This ensures the actorRef is always up-to-date
		actorRef.current = actor;

		// Update the proxy if the actor changes
		proxyRef.current = createOrUpdateProxy(actor);

		return () => {
			// Cleanup if necessary
		};
	}, [actor, createOrUpdateProxy]);

	// Return the proxy to allow interaction with the actor's state
	return proxyRef.current;
};

export const useActorState = <T extends Actor>(actor: T) => {
	const [, setTrigger] = useState({});

	// Function to create a new proxy for the actor
	const createProxy = (targetActor: T) => {
		return new Proxy(targetActor, {
			set(target, property, value, receiver) {
				console.log(`useActorStateG ${property as string}`);

				// Perform the default set operation
				const result = Reflect.set(target, property, value, receiver);

				// Trigger a state update to re-render the component
				setTrigger({});
				return result;
			},
		});
	};

	// Creating a proxy for the actor using useRef with the createProxy function
	const proxyRef = useRef(createProxy(actor));

	useEffect(() => {
		// Update the proxy to wrap the new actor if the actor changes
		proxyRef.current = createProxy(actor);
	}, [actor, createProxy]); // Dependency on the actor

	// Return the proxy to allow interaction with the actor's state
	return proxyRef.current;
};
