import React, { HTMLProps } from 'react';
import { Button } from '../components_atomic';

// TODO: support actors
export type LibraryItemProps = {
  quote: any;
  author: any;
};

export const CoLibraryItem: React.FC<LibraryItemProps> = ({
  quote,
  author
}) => {
  function deleteQuote() {
    // TODO delete quote from library via actors.
    console.log('Delete quote');
  }

  return (
    <div className="rounded-3xl p-5 space-y-3 bg-green-50 dark:bg-stone-900 hover:bg-green-100 dark:hover:bg-green-900">
      <p className="dark:text-white ">{quote}</p>
      <div className="flex space-x-3">
        <p className="justify-self-stretch dark:text-white">- {author}</p>
        <Button onClick={deleteQuote} className="justify-self-end self-end">
          Delete
        </Button>
      </div>
    </div>
  );
};
