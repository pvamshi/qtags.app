import React from "react";
import { ReactEditor } from "slate-react";
import { getBlock } from "./utils";
import {
  Range,
  Editor,
  Point,
  Transforms,
  Element as SlateElement,
  BaseEditor,
  Path,
} from "slate";
const SHORTCUTS: { [key: string]: string } = {
  ">": "block-quote",
  "#": "heading-one",
  "##": "heading-two",
  "###": "heading-three",
  "####": "heading-four",
  "#####": "heading-five",
  "######": "heading-six",
};
export const withShortcuts = (editor: BaseEditor & ReactEditor) => {
  const { deleteBackward, insertText, insertBreak } = editor;

  editor.insertBreak = () => {
    insertBreak();
    const blockEntry = getBlock(editor);
    if (
      blockEntry &&
      SlateElement.isElement(blockEntry[0]) &&
      !["paragraph", "list-item"].includes(blockEntry[0].type)
    ) {
      Transforms.setNodes(editor, { type: "paragraph" }, { at: blockEntry[1] });
    }
  };
  editor.insertText = (text) => {
    const { selection } = editor;

    if (text === " " && selection && Range.isCollapsed(selection)) {
      insertText(text);
      const { anchor } = selection;
      const block = Editor.above(editor, {
        match: (n) => Editor.isBlock(editor, n),
      });
      const path = block ? block[1] : [];
      const start = Editor.start(editor, path);
      const range = { anchor, focus: start };
      const beforeText = Editor.string(editor, range);
      const type: string = SHORTCUTS[beforeText];

      if (block && type && SlateElement.isElement(block[0])) {
        // Transforms.select(editor, range);
        // Transforms.delete(editor);
        const newProperties: Partial<SlateElement & { type: string }> = {
          type,
        };
        Transforms.setNodes(editor, newProperties, {
          match: (n) => Editor.isBlock(editor, n),
        });
        // Tra
        // Transforms.insertText(editor, beforeText, { at: path });

        return;
      }
    }

    insertText(text);
  };

  editor.deleteBackward = (...args) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const match = Editor.above(editor, {
        match: (n) => Editor.isBlock(editor, n),
      });

      if (match) {
        const [block, path] = match;
        const start = Editor.start(editor, path);

        if (
          !Editor.isEditor(block) &&
          SlateElement.isElement(block) &&
          block.type !== "paragraph" &&
          Point.equals(selection.anchor, start)
        ) {
          const newProperties: Partial<SlateElement> = {
            type: "paragraph",
          };
          Transforms.setNodes(editor, newProperties);
          return;
        }
      }

      deleteBackward(...args);
    }
  };

  return editor;
};

export const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case "block-quote":
      return <blockquote {...attributes}>{children}</blockquote>;
    // case "bulleted-list":
    //   return <ul {...attributes}>{children}</ul>;
    case "heading-one":
      return <h1 {...attributes}>{children}</h1>;
    case "heading-two":
      return <h2 {...attributes}>{children}</h2>;
    case "heading-three":
      return <h3 {...attributes}>{children}</h3>;
    case "heading-four":
      return <h4 {...attributes}>{children}</h4>;
    case "heading-five":
      return <h5 {...attributes}>{children}</h5>;
    case "heading-six":
      return <h6 {...attributes}>{children}</h6>;
    // case "list-item":
    //   return <li {...attributes}>{children}</li>;
    default:
      return <div {...attributes}>{children}</div>;
  }
};
