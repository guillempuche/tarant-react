import { None, Some } from 'ts-results';
import { v4 as uuid } from 'uuid';

import { IAuthor, ICollection, IQuote } from '.';

export const mock_authors: IAuthor[] = [
  {
    id: 'barkeep',
    fullname: 'Barkeep',
    birthDate: Some(new Date(1940, 11, 12)),
  },
  {
    id: 'tyler',
    fullname: 'Tyler Perry',
    birthDate: None,
  },
  {
    id: 'fermin',
    fullname: 'Fermín Colomer',
    birthDate: None,
  },
  {
    id: 'diego',
    fullname: 'Diego Ruzzarin',
    birthDate: None,
  },
];

export const mock_collections: ICollection[] = [
  {
    id: 'design',
    name: 'Design',
    parentRef: None,
  },
  {
    id: 'life',
    name: 'Life',
    parentRef: None,
  },
  {
    id: uuid(),
    name: 'Socratism',
    parentRef: Some('life'),
  },
];

export const mock_quotes: IQuote[] = [
  {
    id: uuid(),
    text: 'Luck is the residue of design.',
    authorRef: Some('barkeep'),
    collectionRef: Some('design'),
    createdAt: new Date(2022, 11, 12, 4),
    updatedAt: Some(new Date(2022, 11, 13, 4)),
  },
  {
    id: uuid(),
    text: 'El sufrimiento de ahora forma parte de la felicidad de antes.',
    authorRef: None,
    collectionRef: None,
    createdAt: new Date(2022, 11, 17, 12),
    updatedAt: None,
  },
  {
    id: uuid(),
    text: 'There are people who come into your life to be there for a season.',
    authorRef: Some('tyler'),
    collectionRef: None,
    createdAt: new Date(2022, 11, 17, 12),
    updatedAt: None,
  },
  {
    id: uuid(),
    text: 'Pixar és un plaer dels pobres.',
    authorRef: Some('fermin'),
    collectionRef: None,
    createdAt: new Date(2022, 12, 22, 12),
    updatedAt: Some(new Date(2022, 12, 22, 13)),
  },
  {
    id: uuid(),
    text: 'Una persona reparada es más bonita que una que nunca sufrió.',
    authorRef: Some('diego'),
    collectionRef: None,
    createdAt: new Date(2023, 1, 2, 12),
    updatedAt: None,
  },
];
