/// <reference types="node" />

declare module "prosemirror-mentions" {
  import {
    getMentionsPlugin,
    addMentionNodes,
    addTagNodes,
    tagNode,
    mentionNode,
  } from "prosemirror-mentions";

  export const getMentionsPlugin;
  export const addMentionNodes;
  export const addTagNodes;
  export const tagNode;
  export const mentionNode;
}
