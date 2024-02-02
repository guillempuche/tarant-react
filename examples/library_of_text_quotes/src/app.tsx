import { useEffect } from "react";
import { Tooltip } from "react-tooltip";
import { useActor } from "tarant-react-hook";
import { None } from "ts-results";

import {
	actorEditorsManager,
	actorLibrary,
} from "@/bounded_contexts/library/actors";
import { Editor, LibraryItem } from "@/bounded_contexts/library/ui";
import { Button } from "@/common_ui";

export function App() {
	const libraryState = useActor(actorLibrary);
	const editorsManagerState = useActor(actorEditorsManager);

	useEffect(() => {
		actorLibrary.getRecommendations();
	}, []);

	const renderQuotes = () => {
		if (libraryState.quotes.none || libraryState.authors.none)
			return <div className="text-center dark:text-white">Loading...</div>;

		if (libraryState.quotes.val.length === 0)
			return (
				<div className="grow flex justify-center items-center rounded-3xl p-6">
					<div className="text-center dark:text-white">
						You have no quotes or authors.
					</div>
				</div>
			);

		const quotes = libraryState.quotes.val?.map((quote) => quote);
		const authors = libraryState.authors.val?.map((quote) => quote);
		return (
			<div className="flex flex-col space-y-2">
				{quotes.map((quote) => {
					const foundAuthor = quote.authorRef.some
						? authors.find((author) => author.id === quote.authorRef.unwrap())
						: undefined;
					return (
						<LibraryItem key={quote.id} quote={quote} author={foundAuthor} />
					);
				})}
			</div>
		);
	};

	const renderEditors = () => {
		if (editorsManagerState.editors.some) {
			return editorsManagerState.editors.val.map((editor) => (
				<Editor key={editor.id} editor={editor} />
			));
		}
	};

	return (
		<div className="flex flex-col grow h-screen max-w-lg mx-auto px-6 pt-3 space-y-4 bg-white dark:bg-black">
			<div className="flex-1 overflow-x-hidden rounded-xl space-y-4">
				{renderQuotes()}
			</div>
			<div className="flex flex-col items-end space-y-1 pb-3">
				{renderEditors()}
			</div>
			{/* Floating button */}
			<Button
				tooltip="ACTION: ActorEditorsManager.addEditor"
				onClick={() => actorEditorsManager.addEditor(None)}
				className="fixed top-0 right-0 m-4"
			>
				Add Quote
			</Button>
			<Tooltip id="tooltip" />
		</div>
	);
}
