import { Actor, ActorMessage, IMaterializer } from 'tarant';
export declare class ReactMaterializer implements IMaterializer {
    onInitialize(actor: Actor | any): void;
    onBeforeMessage(actor: Actor | any, message: ActorMessage): void;
    onAfterMessage(actor: Actor | any, message: ActorMessage): void;
    onError(actor: Actor | any, message: ActorMessage, error: any): void;
}
