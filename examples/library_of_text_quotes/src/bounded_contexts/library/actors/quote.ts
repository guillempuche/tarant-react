import { Actor } from 'tarant';
import { None, Ok, Option, Result } from 'ts-results';
import { v4 as uuid } from 'uuid';

import { Error } from '../../../actors';

export interface IQuote {
  id: string;
  text: string;
  authorRef: Option<string>;
  collectionRef: Option<string>;
  createdAt: Date;
  updatedAt: Option<Date>;
}

export interface QuoteParamaters {
  text: string;
  collectionRef?: Option<string>;
}

export class ActorQuote extends Actor {
  readonly props: IQuote;

  constructor(props: IQuote) {
    super(`quote/${props.id}`);
    this.props = props;
  }

  static create({
    id,
    text,
    authorRef,
    collectionRef,
    createdAt,
    updatedAt,
  }: IQuote): Result<ActorQuote, Error<String>> {
    return Ok(
      new ActorQuote({
        id,
        text,
        authorRef,
        collectionRef,
        createdAt,
        updatedAt,
      })
    );
  }

  static createSimple({
    text,
    collectionRef = None,
  }: QuoteParamaters): Result<ActorQuote, Error<String>> {
    return Ok(
      new ActorQuote({
        id: uuid(),
        text,
        authorRef: None,
        collectionRef,
        createdAt: new Date(),
        updatedAt: None,
      })
    );
  }
}
