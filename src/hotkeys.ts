import { KeyboardEventHandler } from "react";
import {
  BaseEditor,
  Editor as SlateEditor,
  Element as SlateElement,
  Node,
  Transforms,
} from "slate";
import { ReactEditor } from "slate-react";
import { nanoid } from "nanoid";

const a =
  (editor: BaseEditor & ReactEditor): KeyboardEventHandler<HTMLDivElement> =>
  (event) => {
    if (event.key === "Tab") {
      console.log("tabbed");

      const parent = SlateEditor.above(editor);
      if (
        parent &&
        parent.length > 0 &&
        SlateElement.isElement(parent[0]) &&
        parent[0].type === "list-item" &&
        Node.string(parent[0]) === "- "
      ) {
        event.preventDefault();
        Transforms.wrapNodes(
          editor,
          { id: nanoid(), type: "list", children: [] },
          { at: parent[1] }
        );
      }
    }
  };

export default a;
