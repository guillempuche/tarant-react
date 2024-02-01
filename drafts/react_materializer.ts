import { parse, stringify } from "flatted";
// import { produce } from 'immer';
import { Actor, ActorMessage, IMaterializer, ShallowActorState } from "tarant";

// import { UseActorSubscribeCallback } from './use_actor_hook';

// type ShallowActorState = Omit<
//   Actor,
//   | 'self'
//   // | 'materializers'
//   // | 'scheduled'
//   // | 'topicSubscriptions'
//   // | 'busy'
//   // | 'partitions'
//   // | 'system'
//   // | 'supervisor'
//   | 'reactState'
//   | 'reactSnapshot'
//   | 'reactSubs'
// >;

// function deepClone<T>(obj: T): T {
//   // Implement a more robust deep clone method as needed
//   return JSON.parse(JSON.stringify(obj));
// }
// function copyProxy<T extends object>(proxy: Proxy<T>): Proxy<T> {
//   const target = proxy[Symbol.for('target')] as T;
//   const handler = proxy[Symbol.for('handler')] as ProxyHandler<T>;
//   const targetCopy: T = deepClone(target);
//   // Assuming the handler can be reused, otherwise you need to deep clone it too
//   return new Proxy(targetCopy, handler);
// }

// function shallowCopyOfActorState(actor: Actor | any) {
function shallowCopyOfActorState(actor: Actor): ShallowActorState {
	// const copy = { ...actor };
	const copy = new Proxy(actor, {});
	// console.log(
	//   'shallowCopyOfActorState copy.getRecommendations=',
	//   copy.getRecommendations
	// );

	delete copy.self;
	// delete copy.materializers;
	// delete copy.scheduled;
	// delete copy.topicSubscriptions;
	// delete copy.busy;
	// delete copy.partitions;
	// delete copy.system;
	// delete copy.supervisor;
	delete copy.reactState;
	delete copy.reactSnapshot;
	delete copy.reactSubs;

	// Make the actor state immutable.
	// return Object.freeze<ShallowActorState>(copy);
	return copy;
}

export class ReactMaterializer implements IMaterializer {
	onInitialize(actor: Actor) {
		actor.reactState = shallowCopyOfActorState(actor);
		actor.reactSnapshot = () => actor.reactState!;
		actor.reactSubs = new Map();
		console.log("onInitialize reactState:", actor.reactState);
	}

	onBeforeMessage(actor: Actor, message: ActorMessage) {}

	onAfterMessage(actor: Actor, message: ActorMessage) {
		if (actor.self?.ref)
			actor.self!.ref.reactState = shallowCopyOfActorState(actor);
		actor.self?.ref.reactSubs?.forEach((cb: any) => cb());
		console.log("onAfterMessage ");
	}

	onError(actor: Actor, message: ActorMessage, error: any) {
		console.error(error);
	}
}

// export class ReactMaterializer implements IMaterializer {
//   onInitialize(actor: IReactMaterializerActor): void {
//     actor.__reactState = produce(actor, (draft) => {});
//   }

//   onBeforeMessage(actor: IReactMaterializerActor, message: ActorMessage): void {
//     // Any pre-message logic, if necessary
//   }

//   onAfterMessage(actor: IReactMaterializerActor, message: ActorMessage): void {
//     actor.__reactState = produce(actor, (draft) => {});
//   }

//   onError(
//     actor: IReactMaterializerActor,
//     message: ActorMessage,
//     error: any
//   ): void {
//     console.error('Actor Error:', error);
//   }
// }

export interface IReactMaterializerActor extends Actor {
	__reactState: ShallowActorState;
	__reactSnapshot: () => ShallowActorState;
	__reactSubs: Map<any, any>;

	// // It stores a snapshot of the actor's state that is suitable for use within React components. The snapshot is typically a simplified version of the actor's state, often stripped of methods and complex structures that might not be serializable or that might cause issues with React's rendering logic.
	// __reactState: any;
	// // A set of callback functions that should be called whenever the actor's state changes. Each subscriber is typically a function that triggers a re-render of a React component.
	// __subscribers: Set<() => void>;
	// subscribeToChanges(callback: () => void): void;
	// unsubscribeFromChanges(callback: () => void): void;
}

// export class ReactMaterializer implements IMaterializer {
//   onInitialize(actor: IReactMaterializerActor): void {
//     console.log('onInitialize');
//     // actor.__reactState = produce(actor, (_: any) => {});
//     // actor.__reactState = structuredClone(actor);
//     actor.__reactState = parse(stringify(actor));
//     // actor.__reactState = null;
//     actor.__subscribers = new Set<() => void>();

//     actor.subscribeToChanges = (callback: () => void) => {
//       actor.__subscribers.add(callback);
//     };

//     actor.unsubscribeFromChanges = (callback: () => void) => {
//       actor.__subscribers.delete(callback);
//     };
//   }

//   onAfterMessage(actor: IReactMaterializerActor): void {
//     // actor.__reactState = produce(actor.__reactState, (draftState: any) => {
//     //   Object.assign(draftState, actor);
//     // });
//     actor.__reactState = parse(stringify(actor));
//     // actor.__reactState = structuredClone(actor);
//     actor.__subscribers.forEach((callback: any) => callback());

//     // console.log('onAfterMessage actor:', actor);
//   }

//   onBeforeMessage(actor: IReactMaterializerActor, message: ActorMessage): void {
//     // actor.__reactState = parse(stringify(actor));
//   }

//   onError(
//     actor: IReactMaterializerActor,
//     message: ActorMessage,
//     error: any
//   ): void {
//     console.error(error);
//   }
// }
