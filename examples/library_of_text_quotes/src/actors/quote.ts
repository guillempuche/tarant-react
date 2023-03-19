import { Actor } from 'tarant';
import { v4 as uuid } from 'uuid';

export interface IQuote {
  id: string;
  text: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

interface QuoteParamaters {
  text: string;
  author?: string;
}

export class ActorQuote extends Actor {
  constructor(props: IQuote) {
    super(`quote${props.id}`);
  }

  create({ text }: QuoteParamaters) {
    const quote = new ActorQuote({
      id: uuid(),
      text,
      author: 'autho_id_1',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log(this.id, text);
  }
}
