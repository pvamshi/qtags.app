import { BulletList } from "@tiptap/extension-bullet-list";
import Highlight from "@tiptap/extension-highlight";
import Heading from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";
import { OrderedList } from "@tiptap/extension-ordered-list";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Typography from "@tiptap/extension-typography";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";
import StarterKit from "@tiptap/starter-kit";

import { IDGenerator } from "./extension-id";

import { EditorOptions, mergeAttributes, NodeConfig } from "@tiptap/react";
import { nanoid } from "nanoid";

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
    TaskItem.extend(idGen).configure(idDefault).configure({ nested: true }),
    TaskList.extend(idGen).configure(idDefault),
  ],
};

export default config;
