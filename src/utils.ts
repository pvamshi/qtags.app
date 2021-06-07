import { ReactEditor } from ".pnpm/slate-react@0.63.0_c0567ed259c447a57d5e502f74e1a9dd/node_modules/slate-react";
import { nanoid } from "nanoid";
import {
  BaseEditor,
  Editor as SlateEditor,
  Element as SlateElement,
  Transforms,
} from "slate";
export function getBlock(editor: BaseEditor & ReactEditor) {
  return SlateEditor.above(editor, {
    match: (n) => SlateEditor.isBlock(editor, n),
  });
}

export function setListType(editor: BaseEditor & ReactEditor) {
  Transforms.setNodes(
    editor,
    { type: "list-item" },
    {
      match: (n) => SlateEditor.isBlock(editor, n),
    }
  );
  const list = { id: nanoid(), type: "list", children: [], depth: 0 };
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

export function setTaskType(editor: BaseEditor & ReactEditor) {
  Transforms.setNodes(
    editor,
    { task: true },
    {
      match: (n) => SlateEditor.isBlock(editor, n),
    }
  );
}
