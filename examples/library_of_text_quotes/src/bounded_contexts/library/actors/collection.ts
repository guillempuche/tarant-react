import { Actor } from 'tarant';
import { None, Ok, Option, Result } from 'ts-results';
import { v4 as uuid } from 'uuid';

import { Error } from '../../../actors';

export interface ICollection {
  id: string;
  name: string;
  parentRef: Option<string>;
}

export interface CollectionParamaters {
  name: string;
}

export class ActorCollection extends Actor {
  readonly props: ICollection;

  constructor(props: ICollection) {
    super(`collection/${props.id}`);
    this.props = props;
  }

  static create({
    id,
    name,
    parentRef,
  }: ICollection): Result<ActorCollection, Error<String>> {
    return Ok(
      new ActorCollection({
        id,
        name,
        parentRef,
      })
    );
  }

  static createFromName({
    name,
  }: CollectionParamaters): Result<ActorCollection, Error<String>> {
    return Ok(
      new ActorCollection({
        id: uuid(),
        name,
        parentRef: None,
      })
    );
  }
}
