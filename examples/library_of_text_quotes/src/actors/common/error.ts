import { None, Option, Some } from 'ts-results';

/**
 * Abstract error to be implemented on all kind of errors.
 */
export type Error<T> = {
  readonly data: Option<T>;
  readonly debugMessage: string;
};

export type ErrorLibraryRetrieveQuotes = Error<string>;
export type ErrorLibraryRetrieveQuote = Error<string>;
