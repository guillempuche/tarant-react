import { Actor } from 'tarant';
export type UseActorSubscribeCallback = () => void;
/**
 * React Hook to communicate with actors. This hook is designed to be used with
 * the Tarant library, providing an interface for subscribing to actor state changes
 * in a React application.
 *
 * @param actor - The actor instance you want to subscribe to.
 * @returns - The current state of the actor.
 */
export declare const useActorState: (actor: Actor | any) => Actor | any;
