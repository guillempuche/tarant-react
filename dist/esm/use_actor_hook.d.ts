import { Actor } from 'tarant';
/**
 * Custom React hook to synchronize a React component's state with a Tarant actor.
 *
 * @example
 
 * // Define the actor
 * interface MyActorConstructor extends ActorConstructor {
 *   paramA: string;
 * }
 * class MyActor extends Actor {
 *   #fieldA: string;
 *
 *   constructor({ paramA }: MyActorConstructor) {
 *     super();
 *     this.#fieldA = paramA;
 *   }
 *
 *   get fieldA(): string {
 *     return this.#fieldA;
 *   }
 * }
 *
 * // Initialize the actor system with ReactMaterializer
 * const actorSystem = ActorSystem.for(
 *   ActorSystemConfigurationBuilder.define()
 *     .withMaterializers([new ReactMaterializer()])
 *     .done(),
 * );
 * const myActor = actorSystem.actorOf<MyActor, MyActorConstructor>(MyActor, { paramA: 'initial' });
 *
 * // Usage in a React component
 * import React from 'react';
 * import { useActorState } from 'tarant-react-hook';
 *
 * const MyComponent: React.FC = () => {
 *   const actor = useActorState(myActor);
 *   return <div>{actor.fieldA}</div>;
 * };
 *
 * @param actor - The actor whose state is to be synchronized.
 * @returns The same actor, allowing React components to reflect its updated state.
 */
export declare const useActorState: <T extends Actor>(actor: T) => T;
