import { BulletList } from "@tiptap/extension-bullet-list";
import Highlight from "@tiptap/extension-highlight";
import { OrderedList } from "@tiptap/extension-ordered-list";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Typography from "@tiptap/extension-typography";
import type { EditorOptions } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const config: Partial<EditorOptions> = {
  autofocus: true,
  extensions: [
    StarterKit,
    Highlight,
    Typography,
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
