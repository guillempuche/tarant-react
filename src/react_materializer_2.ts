import { parse, stringify } from "flatted";
import { fromJS } from "immutable";
import { cloneDeep, cloneDeepWith } from "lodash";
import { Actor, ActorMessage, IMaterializer } from "tarant";
import { Option, Some } from "ts-results";

function cloneDeepWithProxies(actor: Actor) {
	return cloneDeepWith(actor, (value, key) => {
		// Skip copying circular references (like actor.self and actor.ref)
		if (
			key === "stateCopy" ||
			key === "stateChangeSubscriptions" ||
			key === "self" ||
			key === "ref" ||
			key === "partitions" ||
			key === "subscriptions" ||
			key === "system" ||
			key === "materializers" ||
			key === "supervisor" ||
			key === "scheduled" ||
			key === "topicSubscriptions" ||
			key === "busy"
		) {
			return undefined; // Skip cloning this property
		}
		console.log("cloneDeepWithProxies - cloning value:", value);
		if (typeof value === "object" && value.isProxy) {
			console.log("cloneDeepWithProxies - Found proxy, cloning:", value);
			return { ...value };
		}

		return undefined; // Return undefined to let lodash handle the cloning
	});
}

// function deepCopyManual(obj: any): any {
// 	// Check if the object is null or undefined
// 	if (obj === null || typeof obj === 'undefined') {
// 		return obj;
// 	}

// 	// Handle functions (assuming you don't want to copy the function definition)
// 	if (typeof obj === 'function') {
// 		return obj;
// 	}

// 	// Check if the object is an object and can be instantiated
// 	if (typeof obj === 'object') {
// 		// Handle arrays and objects differently
// 		let copy = Array.isArray(obj) ? [] : {};

// 		// Attempt to use the object's constructor if it's not a built-in object
// 		if (
// 			obj.constructor &&
// 			obj.constructor.name !== 'Object' &&
// 			obj.constructor.name !== 'Array'
// 		) {
// 			try {
// 				copy = new obj.constructor();
// 			} catch (error) {
// 				// If constructor fails, default to a plain object or array
// 				console.warn('Deep copy constructor failed:', error);
// 				copy = Array.isArray(obj) ? [] : {};
// 			}
// 		}

// 		for (const key in obj) {
// 			if (Object.prototype.hasOwnProperty.call(obj, key)) {
// 				// copy[key] = deepCopyManual(obj[key]);
// 			}
// 		}
// 		return copy;
// 	}

// 	// For all other types (e.g., number, string, boolean), return the object itself
// 	return obj;
// }

///// Doesnt handle recursion
// function manualDeepCopy(actor: Actor) {
// 	let copy = Object.create(Object.getPrototypeOf(actor));
// 	for (let prop in actor) {
// 		if (actor[prop] instanceof Actor) {
// 			copy[prop] = manualDeepCopy(actor[prop]);
// 		} else {
// 			copy[prop] = actor[prop];
// 		}
// 	}
// 	return copy;
// }

// function manualDeepCopy(
// 	actor: Actor,
// 	// A WeakMap (seen) is used to track already copied objects to avoid repeated copying and infinite recursion.
// 	seen = new WeakMap<Actor, Actor>()
// ) {
// 	if (seen.has(actor)) {
// 		return seen.get(actor);
// 	}
// 	let copy = Object.create(Object.getPrototypeOf(actor));
// 	seen.set(actor, copy);
// 	for (let prop in actor) {
// 		if (actor[prop] instanceof Actor) {
// 			console.log(`${actor.id} found nested prop = ${prop}`);
// 			copy[prop] = manualDeepCopy(actor[prop], seen);
// 		} else {
// 			copy[prop] = actor[prop];
// 		}
// 	}
// 	return copy;
// }
function manualDeepCopy(actor: Actor): any {
	if (!(actor instanceof Actor)) {
		console.log(`Encountered a non-Actor object:`, actor);
		return actor;
	}
	const copy = Object.create(Object.getPrototypeOf(actor));

	// Getting all properties, including non-enumerable and symbols
	const allProps = [
		...Object.getOwnPropertyNames(actor),
		...Object.getOwnPropertySymbols(actor),
	];

	allProps.forEach((prop) => {
		if (
			[
				"stateChangeSubscriptions",
				"stateCopy",
				"self",
				"ref",
				"partitions",
				"subscriptions",
				"system",
				"materializers",
				"supervisor",
				"scheduled",
				"topicSubscriptions",
				"busy",
			].includes(prop.toString())
		) {
			return;
		}

		const descriptor = Object.getOwnPropertyDescriptor(actor, prop);
		if (descriptor) {
			if (typeof descriptor.get === "function") {
				console.log(`Found getter for property: ${prop.toString()}`);
				const value = descriptor.get.call(actor);

				// Special handling for proxies
				if (typeof value === "object" && value !== null && value.isProxy) {
					console.log(`Found proxy for property: ${prop.toString()}`);
					copy[prop] = manualDeepCopy(value); // Recursive call for proxies
				} else {
					copy[prop] = value;
				}
			} else {
				console.log(`Copying non-getter property: ${prop.toString()}`);
				copy[prop] = actor[prop as string];
			}
		} else {
			console.error(`No descriptor found for property: ${prop.toString()}`);
		}
	});

	console.log(`manualDeepCopy copy = ${0} \n================`, copy);
	return copy;
}

// function deepCloning<T extends Actor>(actor: T): Partial<T> {
// 	console.log('Deep cloning started for actor with ID:', actor.id);

// 	const excludeProps = [
// 		'stateCopy',
// 		'stateChangeSubscriptions',
// 		'self',
// 		'ref',
// 		'partitions',
// 		'subscriptions',
// 		'system',
// 		'materializers',
// 		'supervisor',
// 		'scheduled',
// 		'topicSubscriptions',
// 		'busy',
// 	];
// 	const clone: Partial<T> = { id: actor.id } as Partial<T>;

// 	for (const key in actor) {
// 		if (excludeProps.includes(key) || typeof actor[key] === 'function')
// 			continue;
// 		clone[key] = JSON.parse(JSON.stringify(actor[key]));
// 	}

// 	console.log('Deep cloning completed:', clone);
// 	return clone;
// }

function deepCloningHandlers<T extends Actor>(actor: T): Partial<T> {
	console.log("Deep cloning started for actor with ID:", actor.id);

	const skipFields = new Set([
		"stateCopy",
		"stateChangeSubscriptions",
		"self",
		"ref",
		"partitions",
		"subscriptions",
		"system",
		"materializers",
		"supervisor",
		"scheduled",
		"topicSubscriptions",
		"busy",
	]);

	const handler: ProxyHandler<T> = {
		get(target, prop: string, receiver) {
			if (
				skipFields.has(prop) ||
				typeof target[prop as keyof T] === "function" ||
				prop === "id"
			)
				return;
			return JSON.parse(JSON.stringify(Reflect.get(target, prop, receiver)));
		},
	};

	const proxy = new Proxy(actor, handler);
	const clone: Partial<T> = {};
	for (const key in proxy) {
		if (!skipFields.has(key) && key !== "id") {
			clone[key as keyof T] = proxy[key as keyof T];
		}
	}

	console.log("Deep cloning completed:", clone);
	return clone;
}

function deepCloning1<T extends Actor>(actor: T): Partial<T> {
	console.log(`Deep cloning started for actor.id ${actor.id}`, actor);

	const skipFields = new Set([
		"stateCopy",
		"stateChangeSubscriptions",
		"self",
		"ref",
		"partitions",
		"subscriptions",
		"system",
		"materializers",
		"supervisor",
		"scheduled",
		"topicSubscriptions",
		"busy",
	]);

	function unwrapProxy(proxy: any): any {
		// Implement this based on how you can retrieve the original object from the proxy
		// This is just an example and needs to be adapted to your specific case
		return proxy.originalObject ? proxy.originalObject : proxy;
	}

	// Function to determine if the property is a getter
	function isGetter(obj: any, prop: string): boolean {
		if (typeof obj === "object" && obj !== null && obj.isProxy) {
			// Retrieve the original object from the proxy
			obj = unwrapProxy(obj);
		}
		const descriptor = Object.getOwnPropertyDescriptor(
			Object.getPrototypeOf(obj),
			prop,
		);
		return !!descriptor && typeof descriptor.get === "function";
	}

	// Function to clone values recursively
	function cloneValue(value: any): any {
		value = unwrapProxy(value);
		if (value instanceof Actor) {
			return { id: value.id };
		} else if (
			Array.isArray(value) ||
			value instanceof Map ||
			value instanceof Set
		) {
			return Array.from(value).map(cloneValue);
		} else if (value !== null && typeof value === "object") {
			return deepCloneObject(value);
		}
		return value;
	}

	// Function to deep clone an object, considering getters
	function deepCloneObject(obj: any): any {
		const cloneObj: any = {};
		for (const key of Object.getOwnPropertyNames(obj)) {
			if (skipFields.has(key)) continue;
			console.log(`key: ${key}`);
			if (key === "id" || isGetter(obj, key)) {
				cloneObj[key] = cloneValue(obj[key]);
			}
		}
		return cloneObj;
	}

	const clone = deepCloneObject(actor);
	console.log("Deep cloning completed:", clone);
	return clone;
}

// Works
function deepCloning2<T extends Actor>(actor: T): Partial<T> {
	console.log("Deep cloning started for actor with ID:", actor.id);

	const skipFields = new Set([
		"stateCopy",
		"stateChangeSubscriptions",
		"self",
		"ref",
		"partitions",
		"subscriptions",
		"system",
		"materializers",
		"supervisor",
		"scheduled",
		"topicSubscriptions",
		"busy",
	]);

	// Function to deep clone an object, considering getters
	function deepCloneObject(obj: any): any {
		const cloneObj: any = {};
		for (const key of Object.getOwnPropertyNames(obj)) {
			if (skipFields.has(key)) continue;
			console.log(`key: ${key}`);
			if (key === "id") {
				cloneObj[key] = cloneValue(obj[key]);
			}
		}
		return cloneObj;
	}

	// Function to clone values, handling complex types and potentially proxied actors
	function cloneValue(value: any): any {
		if (value instanceof Actor) {
			console.log(`Cloning Actor instance with ID: ${value.id}`);
			return { id: value.id };
		} else if (value !== null && typeof value === "object") {
			return deepCloneObject(value);
		}
		return value;
	}

	// Function to retrieve getters and clone their values
	function cloneGetters(obj: any): any {
		const cloneObj: any = {};
		const prototype = Object.getPrototypeOf(obj);

		Object.getOwnPropertyNames(prototype).forEach((prop) => {
			if (prop !== "constructor") {
				const descriptor = Object.getOwnPropertyDescriptor(prototype, prop);
				if (descriptor && typeof descriptor.get === "function") {
					console.log(`Cloning getter property: ${prop}`);
					cloneObj[prop] = cloneValue(obj[prop]);
				}
			}
		});

		return cloneObj;
	}

	const clone = cloneGetters(actor);
	console.log("Deep cloning completed:", clone);
	return clone;
}

// Works
function deepCloning3<T extends Actor>(actor: T): Partial<T> {
	const skipFields = new Set([
		"stateCopy",
		"stateChangeSubscriptions",
		"self",
		"ref",
		"partitions",
		"subscriptions",
		"system",
		"materializers",
		"supervisor",
		"scheduled",
		"topicSubscriptions",
		"busy",
	]);

	function cloneValue(value: any): any {
		// if (value instanceof Actor) {
		// 	return { id: value.id };
		// } else if (value !== null && typeof value === 'object') {
		// 	return deepCloneObject(value);
		// }
		// return value;

		if (value instanceof Actor) {
			// return { ...deepCloneObject(value), id: value.id };
			return deepCloneObject(value);
		}
		if (value instanceof Some) {
			// console.log(`value is Option`);
			// return cloneOption(value);
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

		if (value !== null && typeof value === "object") {
			return deepCloneObject(value);
		}
		return value;
	}
	// function cloneOption(option: Option<any>): Option<any> {
	// 	if (option.none) {
	// 		return option; // None should be returned as is
	// 	} else {
	// 		// Clone the value inside the Option if it's Some
	// 		return cloneValue(option.val);
	// 	}
	// }

	// Function to clone object considering getters
	function deepCloneObject(actor: Actor | any): any {
		const cloneObj: any = { id: actor.id };
		const prototype = Object.getPrototypeOf(actor);

		Object.getOwnPropertyNames(prototype).forEach((prop) => {
			// console.log(`Cloning prop = ${prop}`);
			if (skipFields.has(prop)) return;
			if (prop === "constructor") return;
			const descriptor = Object.getOwnPropertyDescriptor(prototype, prop);
			if (descriptor && typeof descriptor.get === "function") {
				// console.log(`Cloning getter property: ${prop}`);
				cloneObj[prop] = cloneValue(actor[prop]);
			}
		});
		// const props = Object.getOwnPropertyNames(prototype);
		// for (const prop of props) {
		// 	if (skipFields.has(prop)) continue;
		// 	if (prop === 'constructor') continue;

		// 	const descriptor = Object.getOwnPropertyDescriptor(prototype, prop);
		// 	if (descriptor && typeof descriptor.get === 'function') {
		// 		cloneObj[prop] = cloneValue(actor[prop]);
		// 	}
		// }

		return cloneObj;
	}
	const clone = deepCloneObject(actor);
	// console.log('Deep cloning completed:', clone);
	return clone;
}

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
		// actor.stateCopy = manualDeepCopy(actor);
		actor.stateCopy = deepCloning3(actor);
		// actor.stateChangeSubscriptions?.forEach((callback) => callback());
		actor.stateChangeSubscriptions = new Map();
	}

	/**
	 * Lifecycle hook called before an actor processes a message.
	 * @param actor The actor that received the message.
	 * @param message The message to be processed.
	 */
	onBeforeMessage(actor: Actor, message: ActorMessage) {
		// console.log(
		// 	`onBeforeMessage: ${actor.id} hash = ${hashObject(actor.stateCopy)}`
		// );
	}

	/**
	 * Lifecycle hook called after an actor processes a message.
	 * This triggers callbacks in the actor's state change subscription.
	 * @param actor The actor that processed the message.
	 * @param message The message that was processed.
	 */
	onAfterMessage(actor: Actor, message: ActorMessage) {
		console.log(`onAfterMessage: ${actor.id}`);

		// actor.stateCopy = deepCopyManual(actor);
		// actor.stateCopy = cloneDeep(actor);
		// actor.stateCopy = cloneDeepWithProxies(actor);
		// actor.stateCopy = manualDeepCopy(actor);
		// actor.stateCopy = deepCloningHandler(actor);
		actor.stateCopy = deepCloning3(actor);
		actor.stateChangeSubscriptions?.forEach((callback) => callback());
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
