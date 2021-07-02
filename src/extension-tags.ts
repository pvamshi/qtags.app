import { Extension } from "@tiptap/core";
import TextStyle from "@tiptap/extension-text-style";
import { Mark, markInputRule, mergeAttributes } from "@tiptap/react";
import { Plugin } from "prosemirror-state";
import tags from "./tags";
import { Suggestion } from "@tiptap/suggestion";

export const Tags = Mark.create({
  name: "tags",
  defaultOptions: {
    HTMLAttributes: {},
  },
  parseHTML() {
    return [
      {
        tag: 'span[data-type="tag"]',
        priority: 51,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "tag",
      }),
      0,
    ];
  },
  addInputRules() {
    console.log("matched ot tag");
    return [markInputRule(/(?:^|\s)((?:#)((?:[^#]+))(?:#))$/gm, this.type)];
  },
  // addProseMirrorPlugins() {
  //   return [
  //     new Plugin({
  //       state: {
  //         init(_, { doc }) {
  //           return tags(doc);
  //         },
  //         apply(transaction, oldState) {
  //           return transaction.docChanged ? tags(transaction.doc) : oldState;
  //         },
  //       },
  //       props: {
  //         decorations(state) {
  //           return this.getState(state);
  //         },
  //       },
  //     }),
  //   ];
  // },
});
