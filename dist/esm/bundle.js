import { Actor } from 'tarant';
import { Some } from 'ts-results';
import { useState, useEffect } from 'react';
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
        if (value !== null && typeof value === "object") {
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
        // Object.getOwnPropertyNames(prototype).forEach((prop) => {
        // 	if (skipFields.has(prop)) return;
        // 	if (prop === "constructor") return;
        // 	const descriptor = Object.getOwnPropertyDescriptor(prototype, prop);
        // 	if (descriptor && typeof descriptor.get === "function") {
        // 		cloneObj[prop] = cloneValue(actor[prop]);
        // 	}
        // });
        const propertyNames = Object.getOwnPropertyNames(prototype);
        for (const prop of propertyNames) {
            if (skipFields.has(prop))
                continue;
            if (prop === "constructor")
                continue;
            const descriptor = Object.getOwnPropertyDescriptor(prototype, prop);
            if (descriptor && typeof descriptor.get === "function") {
                cloneObj[prop] = cloneValue(actor[prop]);
            }
        }
        return cloneObj;
    }
    const clone = deepCloneObject(actor);
    return clone;
}

function useActor(actor, options = {}) {
    const [_, setState] = useState(actor?.stateCopy);
    useEffect(() => {
        if (actor) {
            const subscriptionId = actor.id + v4();
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

export { ReactMaterializer, useActor };
//# sourceMappingURL=bundle.js.map
