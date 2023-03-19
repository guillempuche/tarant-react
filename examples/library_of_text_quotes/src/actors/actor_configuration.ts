import { ActorSystem, ActorSystemConfigurationBuilder, Topic } from 'tarant';
import { ReactMaterializer } from 'tarant-react';
import { ActorLibrary, ProtocolLibrary } from './library';

export const actorSystem = ActorSystem.for(
  ActorSystemConfigurationBuilder.define()
    .withMaterializers([new ReactMaterializer()])
    .done()
);

export const protocolLibrary = Topic.for(actorSystem, 'store', ProtocolLibrary);

export const actorLibrary = actorSystem.actorOf(ActorLibrary, [
  protocolLibrary,
]);
