import { parse, stringify } from "flatted";
import { fromJS } from "immutable";
import { Actor, ActorMessage, IMaterializer } from "tarant";

// function isGetter(actor: Actor, property: PropertyKey): boolean {
//   const descriptor = Object.getOwnPropertyDescriptor(
//     Object.getPrototypeOf(actor),
//     property
//   );
//   return !!descriptor && typeof descriptor.get === 'function';
// }
// function shallowCopyOfActorState(actor: Actor): ActorState {
//   // const state: Partial<ActorState> = {};
//   const state: ActorState = {};

//   Reflect.ownKeys(actor)
//     .filter((key) => typeof key === 'string' || typeof key === 'number') // Filter out symbols
//     .forEach((key) => {
//       if (isGetter(actor, key)) {
//         (state as any)[key] = actor[key as keyof Actor];
//       }
//     });

//   return state;
// }

// function shallowCopyOfActorState(actor: Actor): ActorState {
//   // const copy = { ...actor };
//   const copy = new Proxy(actor, {});

//   delete copy.self;
//   // delete copy.materializers;
//   // delete copy.scheduled;
//   // delete copy.topicSubscriptions;
//   // delete copy.busy;
//   // delete copy.partitions;
//   // delete copy.system;
//   // delete copy.supervisor;
//   delete copy.reactState;
//   delete copy.reactSnapshot;
//   delete copy.stateChangeSubscriptions;

//   // Make the actor state immutable.
//   // return Object.freeze<ActorState>(copy);
//   return copy;
// }

// interface DevToolsWindow extends Window {
// 	__REACT_DEVTOOLS_GLOBAL_HOOK__?: {
// 		emit: (event: string, data: any) => void;
// 		// Add other methods or properties of __REACT_DEVTOOLS_GLOBAL_HOOK__ as needed
// 	};
// }

// @ts-ignore
const devTools = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;

// function serializeActorState(actor: Actor): any {
// 	const state: { [key: string]: any } = {};

// 	// Reflect.ownKeys can be used to get all properties including non-enumerable ones
// 	// biome-ignore lint/complexity/noForEach: <explanation>
// 	Reflect.ownKeys(actor).forEach((key) => {
// 		if (typeof key === 'string') {
// 			// Assuming you want to serialize only string-keyed properties
// 			const descriptor = Object.getOwnPropertyDescriptor(
// 				Object.getPrototypeOf(actor),
// 				key
// 			);
// 			if (descriptor && typeof descriptor.get === 'function') {
// 				state[key] = actor[key as keyof Actor];
// 				console.log(
// 					`serializeActorState property ${key}:`,
// 					actor[key as keyof Actor]
// 				); // Logging
// 			}
// 		}
// 	});

// 	return state;
// }

/**
 * A materializer for React that integrates with the Tarant actor model.
 * This class implements the `IMaterializer` interface from Tarant and provides
 * lifecycle hooks to interact with React components.
 */
export class ReactMaterializer implements IMaterializer {
	/**
	 * Invoked when an actor is initialized. Sets up the state change subscription map.
	 * @param actor The actor being initialized.
	 */
	onInitialize(actor: Actor) {
		actor.stateChangeSubscriptions = new Map<
			string,
			React.DispatchWithoutAction
		>();
	}

	/**
	 * Lifecycle hook called before an actor processes a message.
	 * @param actor The actor that received the message.
	 * @param message The message to be processed.
	 */
	onBeforeMessage(actor: Actor, message: ActorMessage) {}

	/**
	 * Lifecycle hook called after an actor processes a message.
	 * This triggers callbacks in the actor's state change subscription.
	 * @param actor The actor that processed the message.
	 * @param message The message that was processed.
	 */
	onAfterMessage(actor: Actor, message: ActorMessage) {
		if (actor.stateChangeSubscriptions) {
			console.log(`onAfterMessage: ${actor.id}`);

			const deepCopy = parse(stringify(actor));
			// console.log('useActorState deepCopy =', deepCopy);
			// console.log('useActorState deepCopy =', stringify(actor));
			// console.log('useActorState deepCopy =', fromJS(actor));
			actor.stateCopy = stringify(actor);

			for (const callback of actor.stateChangeSubscriptions.values()) {
				if (callback) {
					callback();
				}
			}
		}
	}

	/**
	 * Error handling for the actor. Logs errors to the console.
	 * @param actor The actor where the error occurred.
	 * @param message The message that caused the error.
	 * @param error The error object.
	 */
	onError(actor: Actor, message: ActorMessage, error: any) {
		console.error(error);
	}
}
