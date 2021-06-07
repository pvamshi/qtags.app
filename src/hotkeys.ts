import { KeyboardEventHandler } from "react";
import {
  BaseEditor,
  Path,
  Editor as SlateEditor,
  Element as SlateElement,
  Node,
  Transforms,
} from "slate";
import { ReactEditor } from "slate-react";
import { nanoid } from "nanoid";
import { getBlock } from "./utils";
import { ElementNode } from "./models";

/**
 * TODO: Handle delete key
 */
const a =
  (editor: BaseEditor & ReactEditor): KeyboardEventHandler<HTMLDivElement> =>
  (event) => {
    if (event.key === "Tab") {
      const block = getBlock(editor);
      // handle list
      if (
        block &&
        SlateElement.isElement(block[0]) &&
        block[0].type === "list-item"
      ) {
        event.preventDefault();
        if (event.shiftKey) {
          // unindent
          const listElement = SlateEditor.above(editor, {
            match: (n) => SlateElement.isElement(n) && n.type === "list",
          });
          const selection = editor.selection;
          if (selection && listElement) {
            const parentPath = Path.parent(listElement[1]);
            if (
              parentPath.length === 0 ||
              SlateEditor.isEditor(Node.get(editor, parentPath))
            ) {
              // its already at root level
              return;
            }
            const offset = selection.focus.offset - 2;
            Transforms.select(editor, SlateEditor.start(editor, block[1]));
            Transforms.delete(editor, { distance: 2, unit: "character" });
            Transforms.move(editor, { distance: offset, unit: "character" });
            Transforms.liftNodes(editor, { at: block[1] });
          }
          return;
        }
        // add extra space at the beginning
        Transforms.insertNodes(
          editor,
          { text: "  " },
          { at: SlateEditor.start(editor, block[1]) }
        );
        const listBlock = SlateEditor.above(editor, { at: block[1] }) as
          | [ElementNode, Path]
          | undefined;
        Transforms.wrapNodes(
          editor,
          {
            id: nanoid(),
            type: "list",
            children: [],
            depth: ((listBlock && listBlock[0].depth) || 0) + 1,
          },
          { at: block[1] }
        );
      }
    }
  };

export default a;
