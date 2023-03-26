import { Actor } from 'tarant';
import { None, Ok, Option, Result } from 'ts-results';
import { v4 as uuid } from 'uuid';

import { Error } from '../../../actors';

export interface IAuthor {
  id: string;
  fullname: string;
  birthDate: Option<Date>;
}

export type AuthorParamaters = Omit<IAuthor, 'id'>;

export class ActorAuthor extends Actor {
  readonly props: IAuthor;

  constructor(props: IAuthor) {
    super(`author/${props.id}`);
    this.props = props;
  }

  static create(author: IAuthor): Result<ActorAuthor, Error<String>> {
    return Ok(new ActorAuthor(author));
  }

  static createFromSimple({
    fullname,
    birthDate = None,
  }: AuthorParamaters): Result<ActorAuthor, Error<String>> {
    return Ok(new ActorAuthor({ id: uuid(), fullname, birthDate }));
  }
}
