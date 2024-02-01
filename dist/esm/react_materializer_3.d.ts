import { Actor, ActorMessage, IMaterializer } from 'tarant';
/**
 * A materializer for React that integrates with the Tarant actor model.
 * This class implements the `IMaterializer` interface from Tarant and provides
 * lifecycle hooks to interact with React components.
 */
export declare class ReactMaterializer implements IMaterializer {
    /**
     * Invoked when an actor is initialized. Sets up the state change subscription map.
     * @param actor The actor being initialized.
     */
    onInitialize(actor: Actor): void;
    /**
     * Lifecycle hook called before an actor processes a message.
     * @param actor The actor that received the message.
     * @param message The message to be processed.
     */
    onBeforeMessage(actor: Actor, message: ActorMessage): void;
    /**
     * Lifecycle hook called after an actor processes a message.
     * This triggers callbacks in the actor's state change subscription.
     * @param actor The actor that processed the message.
     * @param message The message that was processed.
     */
    onAfterMessage(actor: Actor, message: ActorMessage): void;
    /**
     * Error handling for the actor. Logs errors to the console.
     * @param actor The actor where the error occurred.
     * @param message The message that caused the error.
     * @param error The error object.
     */
    onError(actor: Actor, message: ActorMessage, error: any): void;
}
