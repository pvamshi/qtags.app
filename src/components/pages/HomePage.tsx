import { nanoid } from "nanoid";
import { useMemo, useState } from "react";
import * as React from "react";
import {
  BaseEditor,
  createEditor,
  Descendant,
  Node,
  Element as SlateElement,
  Transforms,
  Range,
  Editor as SlateEditor,
} from "slate";
import { Editable, ReactEditor, Slate, withReact } from "slate-react";

import { createNode } from "../model/create";
import ElementNode from "../model/ElementNode";
import List from "../model/List";

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: Partial<ElementNode> & { type: string };
  }
}

function withCustom(editor: BaseEditor & ReactEditor) {
  const { insertBreak, insertText } = editor;
  editor.insertBreak = () => {
    insertBreak();
    Transforms.setNodes(editor, { id: nanoid() });
  };
  editor.insertText = (text) => {
    insertText(text);
    const { selection } = editor;
    if (text === " " && selection && Range.isCollapsed(selection)) {
      const { anchor } = selection;
      const block = SlateEditor.above(editor, {
        match: (n) => SlateEditor.isBlock(editor, n),
      });
      const path = block ? block[1] : [];
      const start = SlateEditor.start(editor, path);
      const range = { anchor, focus: start };
      const beforeText = SlateEditor.string(editor, range);

      if (beforeText.startsWith("- ")) {
        Transforms.setNodes(
          editor,
          { type: "list-item" },
          {
            match: (n) => SlateEditor.isBlock(editor, n),
          }
        );
        const list = new List(nanoid(), { ordered: false }).plainObject();
        list.type = "list";
        Transforms.wrapNodes(editor, list, {
          match: (n) => {
            const m =
              !SlateEditor.isEditor(n) &&
              SlateElement.isElement(n) &&
              n.type === "list-item";

            console.log({ m, n });
            return m;
          },
        });
      }

      console.log({ beforeText });
    }
  };

  return editor;
}
const App = () => {
  const editor = useMemo(() => withCustom(withReact(createEditor())), []);
  const [value, setValue] = useState<Descendant[]>([
    createNode("paragraph", {
      text: "a line of paragrah",
    }).plainObject() as Descendant,
  ]);
  console.log(value);
  return (
    // Add the editable component inside the context.
    <Slate
      editor={editor}
      value={value}
      onChange={(newValue) => setValue(newValue)}
    >
      <Editable />
    </Slate>
  );
};

export default App;
