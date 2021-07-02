import Suggestion from "@tiptap/suggestion";
import Blockquote from "@tiptap/extension-blockquote";
import { BulletList } from "@tiptap/extension-bullet-list";
import CodeBlock from "@tiptap/extension-code-block";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import Mention from "@tiptap/extension-mention";
import { OrderedList } from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Typography from "@tiptap/extension-typography";
import { Node, mergeAttributes } from "@tiptap/core";

import {
  EditorOptions,
  extensions,
  NodeConfig,
  ReactRenderer,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";
import tippy from "tippy.js";

import { IDGenerator } from "./extension-id";
import { Tags } from "./extension-tags";
import { MentionList } from "./MentionList";

const idGen: Partial<NodeConfig> = {
  // onTransaction(trr) {
  // console.log(trr.transaction.selection.ranges);
  // const nodeid = this.editor.getNodeAttributes(this.name);
  // if (nodeid.nodeid === null)
  //   this.editor.commands.updateAttributes(this.name, {
  //     nodeid: nanoid(),
  //   });
  // },
  addAttributes() {
    return {
      ...(this.parent ? this.parent() : {}),
      nodeid: {
        keepOnSplit: false,
      },
    };
  },
};
const idDefault = { HTMLAttributes: { nodeid: null } };
const config: Partial<EditorOptions> = {
  autofocus: true,

  extensions: [
    IDGenerator,
    StarterKit,
    Highlight,
    Typography,
    Paragraph.extend(idGen).configure(idDefault),
    Blockquote.extend(idGen).configure(idDefault),
    Heading.extend(idGen).configure(idDefault),
    CodeBlock.extend(idGen).configure(idDefault),
    BulletList.extend({
      content: "taskItem+",
      addCommands() {
        return {
          toggleBulletList:
            () =>
            ({ commands }) => {
              return commands.toggleList("bulletList", "taskItem");
            },
        };
      },
      ...idGen,
    }).configure(idDefault),
    OrderedList.extend(idGen)
      .configure(idDefault)
      .extend({
        content: "taskItem+",
        addCommands() {
          return {
            toggleBulletList:
              () =>
              ({ commands }) => {
                return commands.toggleList("bulletList", "taskItem");
              },
          };
        },
      }),
    TaskItem.extend(idGen).configure({
      nested: true,
      HTMLAttributes: { nodeid: null, checked: false },
    }),
    TaskList.extend(idGen).configure(idDefault),
    // Node.create({
    //   addProseMirrorPlugins() {
    //     return [
    //       Suggestion({
    //         editor: this.editor,
    //         char: "#",
    //         decorationClass: "hashtag",
    //         items: () => ["abc", "def"],
    //         render: () => ({
    //           onStart: () => {
    //             return "hello";
    //           },
    //         }),
    //       }),
    //     ];
    //   },
    // }),
    Mention.configure({
      suggestion: {
        char: "#",
        decorationClass: "hashtag",
        items: () => ["abc", "def"],
      },
    }),
  ],
};

export default config;
