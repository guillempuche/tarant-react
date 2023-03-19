import { IAuthor, IQuote } from './index';

export const mock_quotes: IQuote[] = [
  {
    id: 'quote_1',
    text: 'Luck is the residue of design.',
    author: 'author_id_1',
    createdAt: new Date(2022, 11, 12, 4),
    updatedAt: new Date(2022, 11, 12, 4),
  },
  {
    id: 'quote_2',
    text: 'El sufrimiento de ahora forma parte de la felicidad de antes.',
    author: 'author_id_2',
    createdAt: new Date(2022, 11, 17, 12),
    updatedAt: new Date(2022, 11, 17, 12),
  },
];

export const mock_authors: IAuthor[] = [
  {
    id: 'author_id_1',
    fullname: 'Barkeep',
    birthDate: new Date(1940, 11, 12),
  },
  {
    id: 'author_id_2',
    fullname: 'Anonymous',
    birthDate: new Date(1940, 11, 17),
  },
];
