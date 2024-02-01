declare abstract class Actor {
    id: any;
    stateCopy: any;
    stateChangeSubscriptions?: Map<any, any>;
}
declare class ActorProxyLevel1 extends Actor {
    #private;
    constructor();
    get fieldLevel1(): ActorLevel2[];
}
declare class ActorLevel2 extends Actor {
    #private;
    constructor();
    get fieldLevel2(): ActorProxyLevel3[];
}
declare class ActorProxyLevel3 extends Actor {
    #private;
    constructor();
    get fieldLevel3(): ActorLevel4;
}
declare class ActorLevel4 extends Actor {
    #private;
    constructor();
    get fieldLevel4(): string;
}
