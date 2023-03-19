import { Actor } from 'tarant';
import { None, Ok, Option, Result, Some } from 'ts-results';
import { simulateLoad } from '../repositories/simulate_load';

import {
  Error,
  ErrorLibraryRetrieveQuote,
  ErrorLibraryRetrieveQuotes,
} from './common';
import { mock_authors, mock_quotes } from './mock_data';
import { IAuthor, IQuote } from './index';

export class ActorLibrary extends Actor {
  // private readonly quotes: Map<string, IQuote>;
  // _quotes: Map<string, IQuote>;
  _quotes: IQuote[];
  private readonly authors: IAuthor[];
  private readonly topic: ProtocolLibrary;

  // public get quotes(): Map<string, IQuote> {
  //   return this._quotes;
  // }
  public get quotes(): IQuote[] {
    return this._quotes;
  }

  constructor(topic: ProtocolLibrary) {
    super();

    // this._quotes = new Map(
    //   mock_quotes.map((quote) => [quote.id, quote] as [string, IQuote])
    // );
    this._quotes = mock_quotes;
    this.authors = mock_authors;
    this.topic = topic;
  }

  async load() {
    this.topic.onQuotesChanged(Array.from(this._quotes.values()));
    this.topic.onAuthorsChanged(Array.from(this.authors.values()));
    this.topic.onChange();
  }

  getAllQuotes(): Result<IQuote[], ErrorLibraryRetrieveQuotes> {
    const quotes = Array.from(this._quotes.values());

    return Ok(quotes);
  }

  async retrieveAllQuotes(): Promise<
    Result<IQuote[], ErrorLibraryRetrieveQuotes>
  > {
    const quotes = Array.from(this._quotes.values());

    await simulateLoad();
    console.log('Loaded');

    return Ok(quotes);
  }

  async getQuote(
    text: string
  ): Promise<Result<Option<IQuote>, ErrorLibraryRetrieveQuote>> {
    await simulateLoad();

    const found = Array.from(this._quotes.values()).find(
      (quote) => quote.text === text
    );

    return Ok(found !== undefined ? Some(found) : None);
  }

  async addQuote(quote: IQuote): Promise<Result<None, Error<String>>> {
    await simulateLoad();

    // this._quotes.set(quote.id, quote);
    this._quotes.push(quote);
    return Ok(None);
  }

  async addAuthor(author: IAuthor): Promise<Result<None, Error<String>>> {
    this.authors.push(author);
    return Ok(None);
  }
}

export class ProtocolLibrary extends Actor {
  public constructor() {
    super();
  }

  onChange(): void {}
  onQuotesChanged(quotes: IQuote[]): void {}
  onAuthorsChanged(authors: IAuthor[]): void {}
}
