import { Actor } from 'tarant';
import { v4 as uuid } from 'uuid';

export interface IAuthor {
  id: string;
  fullname: string;
  birthDate?: Date;
}

export type AuthorParamaters = Omit<IAuthor, 'id'>;

export class ActorAuthor extends Actor {
  constructor(props: IAuthor) {
    super(`author-${props.id}`);
  }

  create({ fullname, birthDate }: AuthorParamaters) {
    const author = new ActorAuthor({ id: uuid(), fullname, birthDate });

    console.log(this.id, fullname);
  }
}
