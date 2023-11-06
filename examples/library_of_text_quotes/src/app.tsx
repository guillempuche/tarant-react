import { useEffect } from 'react';
import { useActorState } from 'tarant-react-hook';

import { actorLibrary, ActorLibrary } from './bounded_contexts/library/actors';
import {
  CoLibraryItem,
  CoQuoteEditor,
} from './bounded_contexts/library/ui/components_molecules';

export function App() {
  const library: ActorLibrary = useActorState(actorLibrary);

  useEffect(() => {
    // Simulate the loading of quotes and authors.
    actorLibrary.load();
  }, []);

  return (
    <div className="flex flex-col grow h-screen max-w-lg mx-auto px-6 pt-3 pb-2 space-y-4 bg-white dark:bg-black">
      <div className="flex-1 flex-col overflow-auto rounded-xl space-y-4">
        <h2 className="dark:text-white">
          Your Library ({library.props.quotes.length})
        </h2>
        {library.props.quotes === undefined ||
        library.props.quotes.length === 0 ? (
          <div className="grow flex justify-center items-center rounded-3xl p-6">
            <div className="text-center dark:text-white">
              You don't have quotes
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            {library.props.quotes.map((quote) => (
              <CoLibraryItem key={quote.props.id} quote={quote} />
            ))}
          </div>
        )}
      </div>
      <CoQuoteEditor />
    </div>
  );
}
