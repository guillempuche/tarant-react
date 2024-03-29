import { Topic } from "tarant";

import { actorSystem } from "@/common_actors";
// import { ActorSearch } from "../../searcher/actors/search";
import { IProtocolActorAuthor } from "./author";
import { IProtocolActorEditor } from "./editor";
import { ActorEditorsManager } from "./editors";
import { ActorLibrary, IProtocolNewContent } from "./library";
import { IProtocolActorQuote } from "./quote";

export enum LibraryIds {
	author = "author",
	collection = "collection",
	editorsManager = "editors-manager",
	editor = "editor",
	quote = "quote",
}

// Topics
export const topicNewContent = Topic.for<IProtocolNewContent>(
	actorSystem,
	"new-content",
);
export const topicActorQuote = Topic.for<IProtocolActorQuote>(
	actorSystem,
	"ActorQuote",
);
export const topicActorAuthor = Topic.for<IProtocolActorAuthor>(
	actorSystem,
	"ActorAuthor",
);
export const topicActorEditor = Topic.for<IProtocolActorEditor>(
	actorSystem,
	"ActorEditor",
);

// Actors
export const actorLibrary = actorSystem.actorOf(ActorLibrary, {
	subscriberTopicNewContent: topicNewContent,
	subscriberTopicActorQuote: topicActorQuote,
	subscriberTopicActorAuthor: topicActorAuthor,
});
export const actorEditorsManager = actorSystem.actorOf(ActorEditorsManager, {
	topicOnNewContent: topicNewContent,
	subscriberTopicActorEditor: topicActorEditor,
	subscriberTopicActorQuote: topicActorQuote,
});
// export const actorSearch = actorSystem.actorOf(ActorSearch, []);

// Actors types
export * from "./author";
export * from "./collection";
export * from "./editors";
export * from "./editor";
export * from "./library";
export * from "./quote";
export * from "./utils";
