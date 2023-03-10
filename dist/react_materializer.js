function shallowCopyOfActorState(actor) {
    const copy = { ...actor };
    delete copy.self;
    delete copy.materializers;
    delete copy.scheduled;
    delete copy.topicSubscriptions;
    delete copy.busy;
    delete copy.partitions;
    delete copy.system;
    delete copy.supervisor;
    delete copy.__reactState;
    delete copy.__reactSnapshot;
    delete copy.__reactSubs;
    // Make the actor state immutable.
    return Object.freeze(copy);
}
export class ReactMaterializer {
    onInitialize(actor) {
        actor.__reactState = shallowCopyOfActorState(actor);
        actor.__reactSnapshot = () => actor.__reactState;
        actor.__reactSubs = new Map();
    }
    onBeforeMessage(actor, message) {
    }
    onAfterMessage(actor, message) {
        actor.self.ref.__reactState = shallowCopyOfActorState(actor);
        actor.self.ref.__reactSubs.forEach((cb) => cb());
    }
    onError(actor, message, error) {
        console.error(error);
    }
}
