import { Topic } from 'tarant';

import { actorSystem } from '../../../actors';
import { ProtocolLibrary, ActorLibrary } from '.';

export const protocolLibrary = Topic.for(actorSystem, 'store', ProtocolLibrary);

export const actorLibrary = actorSystem.actorOf(ActorLibrary, [
  protocolLibrary,
]);

export * from './author';
export * from './collection';
export * from './library';
export * from './quote';
