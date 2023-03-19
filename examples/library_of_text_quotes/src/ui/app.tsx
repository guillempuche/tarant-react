import { useEffect, useState } from 'react';
import { useActorState } from 'tarant-react';

import {
  ActorLibrary,
  actorLibrary,
  ProtocolLibrary,
  protocolLibrary,
} from '../actors';
import { Button } from './components_atomic';
import { CoLibraryItem } from './components_molecules';

export function App() {
  const library: ActorLibrary = useActorState(actorLibrary);
  const topic: ProtocolLibrary = useActorState(protocolLibrary);

  const [form, setForm] = useState({ quote: '', author: '' });

  useEffect(() => {
    actorLibrary.load();

    // console.log('useEffect library=', library);
  }, []);

  function saveToLibrary(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();

    // TODO: save data via Actor
    console.log(form);

    setForm({ quote: '', author: '' });
  }

  return (
    <div className="flex flex-col grow h-screen max-w-lg mx-auto px-6 pt-3 pb-2 space-y-4 bg-white dark:bg-black">
      <div className="flex flex-col overflow-auto rounded-xl justify-start space-y-4">
        <h2 className="dark:text-white">Your Library</h2>
        {library.quotes === undefined || library.quotes.length === 0 ? (
          <div className="grow flex justify-center items-center rounded-3xl p-6">
            <div className="text-center dark:text-white">
              You don't have quotes
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            {library.quotes.map((quote) => (
              <CoLibraryItem
                key={quote.id}
                quote={quote.text}
                author={quote.author}
              />
            ))}
          </div>
        )}
      </div>
      <div className="rounded-3xl p-5 bg-green-200 dark:bg-green-900">
        <form onSubmit={saveToLibrary} className="flex flex-col space-y-4">
          <textarea
            rows={2}
            placeholder="Write the quote..."
            value={form.quote}
            onChange={(e) => setForm({ ...form, quote: e.target.value })}
            className="w-full rounded-3xl p-4 dark:bg-stone-700 dark:text-white"
            style={{ resize: 'none' }}
          />
          <input
            placeholder="Write the author..."
            autoComplete="false"
            spellCheck="true"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            className="rounded-3xl p-4 dark:bg-stone-700 dark:text-white"
          />

          <Button type="submit">Save</Button>
        </form>
      </div>
    </div>
  );
}
