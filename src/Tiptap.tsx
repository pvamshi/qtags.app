import {
  useEditor,
  EditorContent,
  mergeAttributes,
  Extension,
  Node,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { BulletList } from "@tiptap/extension-bullet-list";
import { OrderedList } from "@tiptap/extension-ordered-list";
import React from "react";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";

import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { TaskListOptions } from "@tiptap/extension-task-list";

const Tiptap = () => {
  const editor = useEditor({
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
    content: `<p>Hello World! 🌎️</p>
<ul><li>some text
    <ul data-type="taskList">
    <li data-type="taskItem" data-checked="true">flour</li>
    <li data-type="taskItem" data-checked="true">baking powder</li>
    <li data-type="taskItem" data-checked="true">salt</li>
    <li data-type="taskItem" data-checked="false">sugar</li>
    <li data-type="taskItem" data-checked="false">milk</li>
    <li data-type="taskItem" data-checked="false">eggs</li>
    <li data-type="taskItem" data-checked="false">butter</li>
  </ul></li>
  </ul>

    `,
  });
  editor?.on("update", (c: any) => {
    // The content has changed.
    // console.log({ c });
  });

  console.log(editor?.getJSON());
  return <EditorContent editor={editor} />;
};

export default Tiptap;
