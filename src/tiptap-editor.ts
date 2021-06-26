import { BulletList } from "@tiptap/extension-bullet-list";
import Highlight from "@tiptap/extension-highlight";
import Paragraph from "@tiptap/extension-paragraph";
import { OrderedList } from "@tiptap/extension-ordered-list";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Typography from "@tiptap/extension-typography";
import StarterKit from "@tiptap/starter-kit";

import { IDGenerator } from "./extension-id";

import { EditorOptions, mergeAttributes } from "@tiptap/react";
import { nanoid } from "nanoid";
const config: Partial<EditorOptions> = {
  autofocus: true,
  extensions: [
    StarterKit,
    Highlight,
    Typography,
    Paragraph.extend({
      onTransaction() {
        const nodeid = this.editor.getNodeAttributes(this.name);
        if (nodeid.nodeid === "default")
          this.editor.commands.updateAttributes(this.name, {
            nodeid: nanoid(),
          });
      },
      addAttributes() {
        return {
          nodeid: {
            default: this.options.HTMLAttributes["nodeid"],
            keepOnSplit: false,
          },
        };
      },
    }).configure({ HTMLAttributes: { nodeid: "default" } }),
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
    }),
    OrderedList.extend({
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
    TaskItem.configure({ nested: true }),
    TaskList,
  ],
};

export default config;
