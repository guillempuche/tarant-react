import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useActorState } from 'tarant-react';
import { None } from 'ts-results';

import { Button } from '../../../../ui/components_atomic';
import { ActorLibrary, actorLibrary, ActorQuote } from '../../actors';

export type CoQuoteEditorProps = {
  // quote?: ActorQuote;
  // onCancel: () => void;
};

interface CoQuoteEditorPropsDefault
  extends CoQuoteEditorProps,
    React.HTMLAttributes<HTMLDivElement> {}

enum EditorMode {
  isCreating,
  isUpdating,
}

export const CoQuoteEditor: React.FC<CoQuoteEditorPropsDefault> = ({
  // onCancel,
  className,
}) => {
  const library: ActorLibrary = useActorState(actorLibrary);
  const [editorMode, setEditorMode] = useState(EditorMode.isCreating);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    text: '',
    author: '',
  });

  useEffect(() => {
    // // When a quote is provided, means is updating a quote.
    // if (library.props.currentEdit.some) setEditorMode(EditorMode.isUpdating);
    // else setEditorMode(EditorMode.isCreating);
    // // Functional update of the state because it doesn't depend on the form state.
    // setForm((prev) => ({
    //   ...prev,
    //   text: quote?.props.text ?? '',
    //   author: quote
    //     ? quote?.props.authorRef.some
    //       ? library.props.author.val.props.fullname
    //       : ''
    //     : '',
    // }));
  }, []);

  // When is not saving, the component updates the form when there's
  // a change in the library.
  useEffect(() => {
    if (!isSaving) {
      // When a quote is provided, means is updating a quote.
      if (library.props.currentEdit.some) setEditorMode(EditorMode.isUpdating);
      else setEditorMode(EditorMode.isCreating);

      const currentEdit = library.props.currentEdit;

      if (currentEdit instanceof ActorQuote) {
        const foundQuote =
          currentEdit.some && library.props.currentEdit.unwrap()
            ? (library.props.currentEdit.unwrap() as ActorQuote)
            : None;
        const foundAuthor = library.props.authors.find(
          (el) =>
            foundQuote !== None &&
            el.id === (foundQuote as ActorQuote).props.authorRef.unwrap()
        );

        // Functional update of the state because it doesn't depend on the form state.
        setForm((prev) => ({
          ...prev,
          text:
            foundQuote !== None ? (foundQuote as ActorQuote).props.text : '',
          author: foundAuthor?.props.fullname ?? '',
        }));
      }
    }
  }, [library.props.currentEdit, library.props.authors, isSaving]);

  function resetForm() {
    actorLibrary.updateCurrentEdit(None);
  }

  /**
   * Save new quote or update existing.
   */
  async function saveToLibrary(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);

    if (editorMode === EditorMode.isCreating) {
      const newQuote = ActorQuote.createSimple({ text: form.text });
      if (newQuote.err) {
        return;
      }

      actorLibrary.print();
      const result = await actorLibrary.addQuote(newQuote.val);

      console.log(result);

      resetForm();
    } else if (editorMode === EditorMode.isUpdating) {
      // TODO
    }

    setIsSaving(false);
  }

  return (
    <div
      className={classNames(
        'rounded-3xl p-5 flex-none bg-green-200 dark:bg-green-900',
        className
      )}
    >
      <form onSubmit={saveToLibrary} className="flex flex-col space-y-4">
        <textarea
          rows={2}
          placeholder="Quote..."
          value={form.text}
          autoComplete="false"
          inputMode="text"
          onChange={(e) => setForm({ ...form, text: e.target.value })}
          className="w-full rounded-3xl p-4 dark:bg-stone-700 dark:text-white"
          style={{ resize: 'none' }}
        />
        <div className="flex items-center space-x-3">
          <input
            placeholder="(optional) Author fullname..."
            value={form.author}
            autoComplete="false"
            spellCheck="true"
            inputMode="text"
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            className="w-full rounded-3xl p-4 dark:bg-stone-700 dark:text-white"
          />
          <Button
            type="submit"
            disabled={form.text === ''}
            isLoading={isSaving}
          >
            {editorMode === EditorMode.isCreating ? 'Save' : 'Update'}
          </Button>
          <Button
            disabled={isSaving || (form.text === '' && form.author === '')}
            onClick={resetForm}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
