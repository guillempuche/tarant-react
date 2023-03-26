import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useActorState } from 'tarant-react';
import { None, Option, Some } from 'ts-results';

import { Button } from '../../../../ui/components_atomic';
import {
  ActorAuthor,
  ActorLibrary,
  actorLibrary,
  ActorQuote,
} from '../../actors';

// TODO: support actors
export type LibraryItemProps = {
  quote: ActorQuote;
  // onClickUpdate: () => void;
};

interface LibraryItemPropsDefault
  extends LibraryItemProps,
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    > {}

export const CoLibraryItem: React.FC<LibraryItemPropsDefault> = ({
  quote,
  className,
}) => {
  const library: ActorLibrary = useActorState(actorLibrary);
  const [author, setAuthor] = useState<Option<ActorAuthor>>(None);

  function deleteQuote() {
    // TODO delete quote from library via actors.
    console.log('Delete quote');
  }

  useEffect(() => {
    if (quote.props.authorRef.some) {
      const findAuthor = library.props.authors.find(
        (el) => el.props.id === quote.props.authorRef.unwrap()
      );
      setAuthor(findAuthor !== undefined ? Some(findAuthor) : None);
    } else {
      setAuthor(None);
    }
  }, [quote, library.props.authors]);

  return (
    <div
      className={classNames(
        'rounded-3xl p-5 space-y-3 bg-green-50 dark:bg-stone-900 hover:bg-green-100 dark:hover:bg-green-900',
        className
      )}
    >
      <p className="dark:text-white">{quote.props.text}</p>
      <div className="flex space-x-3">
        <p className="dark:text-white flex-1">
          - {author.some ? author.val.props?.fullname : 'Anonymous'}
        </p>
        {/* <Button onClick={onClickUpdate}>Update</Button> */}
        <Button onClick={() => actorLibrary.updateCurrentEdit(Some(quote))}>
          Update
        </Button>
        <Button onClick={deleteQuote}>Delete</Button>
      </div>
    </div>
  );
};
