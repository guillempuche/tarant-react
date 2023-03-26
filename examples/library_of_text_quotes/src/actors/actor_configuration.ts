import { ActorSystem, ActorSystemConfigurationBuilder } from 'tarant';
import { ReactMaterializer } from 'tarant-react';

export const actorSystem = ActorSystem.for(
  ActorSystemConfigurationBuilder.define()
    .withMaterializers([new ReactMaterializer()])
    .done()
);
