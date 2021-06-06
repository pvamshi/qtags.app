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
          console.log("unindent");
          Transforms.select(editor, SlateEditor.start(editor, block[1]));
          Transforms.delete(editor, { distance: 2, unit: "character" });
          // Transforms.select(editor, SlateEditor.start(editor, block[1]));
          // TODO: Move cursor where it was earlier
          // TODO: add element to previous level
          // if prev is list, let it be list , else convert to paragraph
          // if its in the middle, split the list (??)
          const target = [...block[1]];
          // target.pop();
          // Transforms.moveNodes(editor, { at: block[1], to: target });

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

        const node = Node.get(editor, block[1]);
        if (SlateElement.isElement(node) && node.type === "list") {
          const elder = Node.get(editor, Path.previous(block[1]));
          if (
            elder &&
            SlateElement.isElement(elder) &&
            elder.type === "list-item"
          ) {
            Transforms.moveNodes(editor, {
              at: block[1],
              to: Path.previous(block[1]).concat(1),
            });
          }
        }
      }
    }
  };

export default a;
