import { Actor } from 'tarant';
import { None, Ok, Option, Result } from 'ts-results';
import { simulateLoad } from '../repositories/simulate_load';

import { Error } from '../../../actors';
import { mock_authors, mock_quotes } from './mock_data';
import { ActorAuthor, ActorCollection, ActorQuote } from '.';

export interface ILibrary {
  quotes: ActorQuote[];
  authors: ActorAuthor[];
  currentEdit: CurrentEdit;
}

type CurrentEdit = Option<ActorQuote | ActorAuthor | ActorCollection>;

export class ActorLibrary extends Actor {
  readonly props: ILibrary;

  private readonly topic: ProtocolLibrary;

  constructor(topic: ProtocolLibrary) {
    super();

    const authors = mock_authors.map((el) =>
      ActorAuthor.create({
        id: el.id,
        fullname: el.fullname,
        birthDate: el.birthDate,
      }).unwrap()
    );

    const quotes = mock_quotes.map((mock) => {
      return ActorQuote.create({
        id: mock.id,
        text: mock.text,
        authorRef: mock.authorRef,
        collectionRef: mock.collectionRef,
        createdAt: mock.createdAt,
        updatedAt: mock.updatedAt,
      }).unwrap();
    });

    const currentEdit = None;

    this.props = {
      quotes,
      authors,
      currentEdit,
    };
    this.topic = topic;
  }

  /**
   * Simulate a load of all quotes and authors
   */
  async load() {
    await simulateLoad();

    // this.topic.onQuotesChanged();
    // this.topic.onAuthorsChanged(Array.from(this.authors.values()));
    // this.topic.onChange();
  }

  // getAllQuotes(): Result<IQuote[], ErrorLibraryRetrieveQuotes> {
  //   const quotes = Array.from(this.quotes.values());
  //   return Ok(quotes);
  // }

  // async retrieveAllQuotes(): Promise<
  //   Result<IQuote[], ErrorLibraryRetrieveQuotes>
  // > {
  //   const quotes = Array.from(this.quotes.values());
  //   await simulateLoad();
  //   console.log('Loaded');
  //   return Ok(quotes);
  // }

  // async getQuote(
  //   text: string
  // ): Promise<Result<Option<IQuote>, ErrorLibraryRetrieveQuote>> {
  //   await simulateLoad();
  //   const found = Array.from(this.quotes.values()).find(
  //     (quote) => quote.text === text
  //   );
  //   return Ok(found !== undefined ? Some(found) : None);
  // }

  async addQuote(quote: ActorQuote): Promise<Result<None, Error<String>>> {
    // addQuote(quote: ActorQuote): Result<None, Error<String>> {
    console.log(`adding quote`);
    await simulateLoad();

    this.props.quotes.push(quote);

    return Ok(None);
  }

  async updateQuote(quote: ActorQuote): Promise<Result<None, Error<String>>> {
    // addQuote(quote: ActorQuote): Result<None, Error<String>> {
    console.log(`adding quote`);
    await simulateLoad();

    this.props.quotes.push(quote);

    return Ok(None);
  }

  async updateCurrentEdit(currentEdit: CurrentEdit) {
    this.props.currentEdit = currentEdit;
  }

  print() {
    console.log(`printing`);
  }

  // async addAuthor(author: IAuthor): Promise<Result<None, Error<String>>> {
  //   await simulateLoad();

  //   this.authors.push(author);

  //   return Ok(None);
  // }
}

export class ProtocolLibrary extends Actor {
  public constructor() {
    super();
  }

  onChange(): void {}
  // onQuotesChanged(quotes: ActorQuote[]): void {}
  // onAuthorsChanged(authors: IAuthor[]): void {}
}
