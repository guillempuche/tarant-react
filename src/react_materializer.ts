import { Actor,ActorMessage, IMaterializer } from "tarant"
import { UseActorSubscribeCallback } from "./use_actor_hook"

function shallowCopyOfActorState(actor: Actor | any) {
  const copy = { ...actor }
  delete copy.self
  delete copy.materializers
  delete copy.scheduled
  delete copy.topicSubscriptions
  delete copy.busy
  delete copy.partitions
  delete copy.system
  delete copy.supervisor
  delete copy.__reactState
  delete copy.__reactSnapshot
  delete copy.__reactSubs

  // Make the actor state immutable.
  return Object.freeze(copy)

}
export class ReactMaterializer implements IMaterializer {
  onInitialize(actor: Actor | any) {
      actor.__reactState = shallowCopyOfActorState(actor)
      actor.__reactSnapshot = () => actor.__reactState
      actor.__reactSubs = new Map()
  }

  onBeforeMessage(actor: Actor | any, message:ActorMessage) {

  }

  onAfterMessage(actor: Actor | any, message:ActorMessage) {
      actor.self.ref.__reactState = shallowCopyOfActorState(actor)
      actor.self.ref.__reactSubs.forEach((cb:UseActorSubscribeCallback) => cb())
  }

  onError(actor: Actor | any, message:ActorMessage, error: any) {
      console.error(error)
  }
}