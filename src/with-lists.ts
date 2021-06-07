import { nanoid } from "nanoid";
import {
  BaseEditor,
  Editor as SlateEditor,
  Element as SlateElement,
  Path,
  Node,
  Range,
  Transforms,
} from "slate";
import { ReactEditor } from "slate-react";
import { ElementNode } from "./models";
import { getBlock, setListType, setTaskType } from "./utils";

export default function withLists(editor: BaseEditor & ReactEditor) {
  const { insertBreak, insertText, normalizeNode } = editor;
  editor.insertBreak = () => {
    // if current element is empty , just convert it to paragraph
    const parent1 = SlateEditor.above(editor);
    if (
      parent1 &&
      parent1.length > 0 &&
      SlateElement.isElement(parent1[0]) &&
      parent1[0].type !== "paragraph" &&
      Node.string(parent1[0]) === "- "
    ) {
      // delete node
      // Transforms.delete(editor, { unit: "block" });
      Transforms.removeNodes(editor, { at: parent1[1] });
      const p = [...parent1[1]];
      p.pop();
      p[p.length - 1] = p[p.length - 1] + 1;
      Transforms.insertNodes(
        editor,
        {
          type: "paragraph",
          id: nanoid(),
          children: [{ text: "" }],
        },
        { at: p }
      );
      Transforms.select(editor, p);
      // Transforms.setSelection(editor, { anchor: { path: p, offset: 0 } });
    } else {
      insertBreak();
      // set id for each element
      Transforms.setNodes(editor, { id: nanoid() });
      // add list identifier if its a list
      const parent = getBlock(editor);
      if (
        parent &&
        parent.length > 0 &&
        SlateElement.isElement(parent[0]) &&
        parent[0].type === "list-item"
      ) {
        const listBlock = SlateEditor.above(editor, { at: parent[1] }) as
          | [ElementNode, Path]
          | undefined;
        const indentText = new Array((listBlock && listBlock[0].depth) || 0)
          .fill("  ")
          .join("");
        Transforms.insertText(
          editor,
          indentText + (parent[0].task ? "- [ ] " : "- ")
        );
      }
    }
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

      if (
        beforeText.startsWith("- ") &&
        block &&
        SlateElement.isElement(block[0]) &&
        block[0].type === "paragraph"
      ) {
        setListType(editor);
      }

      if (
        beforeText.match(/^\s*- \[ \] $/) &&
        block &&
        SlateElement.isElement(block[0]) &&
        block[0].type === "list-item"
      ) {
        setTaskType(editor);
      }
    }

    // TODO: if two lists are one after other of same type,  just merge them together
    // editor.normalizeNode = ([node, path]) => {
    // };
  };

  return editor;
}
