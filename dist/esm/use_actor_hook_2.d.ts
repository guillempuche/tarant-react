import { Actor } from 'tarant';
export declare function useActorState1(actor: Actor): Actor;
export declare function useActor<T extends Actor>(actor: T, debug?: boolean): T;
export declare function useActor<T extends Actor>(actor: T | undefined, debug?: boolean): T | undefined;
export declare function useActorStateReducer(actor: Actor): Actor;
export declare function useActorStateSubsRef(actor: Actor): Actor;
export declare function useActorStateStateRef(actor: Actor): Actor;
export declare function useActorStateForce<T extends Actor>(actor: T): T;
