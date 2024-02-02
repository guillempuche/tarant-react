import { Actor } from "tarant";
export declare function useActor<T extends Actor>(actor: T, options?: {
    debug?: boolean;
}): T;
export declare function useActor<T extends Actor>(actor: T | undefined, options?: {
    debug?: boolean;
}): T | undefined;
