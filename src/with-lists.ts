import { nanoid } from "nanoid";
import {
  BaseEditor,
  Editor as SlateEditor,
  Element as SlateElement,
  Path,
  Node,
  Range,
  Transforms,
  Editor,
} from "slate";
import { ReactEditor } from "slate-react";
import { ElementNode } from "./models";
import { getBlock, setListType, setTaskType } from "./utils";

export default function withLists(editor: BaseEditor & ReactEditor) {
  const { insertBreak, insertText, deleteBackward, deleteForward } = editor;
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
          .map((t) => ({ type: "indent", text: t }));
        // Transforms.insertText(
        //   editor,
        //   indentText + (parent[0].task ? "- [ ] " : "- ")
        // );
        const selection = editor.selection;
        if (!selection) {
          return;
        }
        // const offset = selection.focus.offset;
        console.log("p", parent[0]);
        Transforms.removeNodes(editor, { at: parent[1] });
        Transforms.insertNodes(
          editor,
          {
            type: "list-item",
            children: [
              ...indentText,
              {
                type: "mark",
                text: parent[0].task ? "- [ ] " : "- ",
              },
              { text: "" },
            ],
          } as Node,
          { at: parent[1] }
        );

        // Transforms.select(editor, SlateEditor.start(editor, parent[1] || []));
        // Transforms.setSelection(editor, {
        //   focus: { path: [...(parent[1] || []), 1], offset: 0 },
        //   anchor: { offset: 0, path: [...(parent[1] || []), 1] },
        // });
        Transforms.select(editor, SlateEditor.end(editor, parent[1]));
        // console.log(parent[1], {
        //   distance: indentText.length * 2 + 2 + (offset || 0),
        // });
        // Transforms.move(editor, {
        //   distance: indentText.length * 2 + 2 + offset,
        //   unit: "character",
        // });
      }
    }
  };
  editor.insertText = (text) => {
    const [block, path] = getBlock(editor);
    if (
      block &&
      SlateElement.isElement(block) &&
      (Node.string(block).match(/^\s*- $/) ||
        Node.string(block).match(/^\s*- \[[xX ]\]/))
    ) {
      Transforms.insertNodes(editor, { text });
      return;
    }
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
        beforeText.match(/^\s*- \[[xX ]\] $/) &&
        block &&
        SlateElement.isElement(block[0]) &&
        block[0].type === "list-item"
      ) {
        setTaskType(editor);
      }
    }

    editor.deleteBackward = (...args) => {
      console.log("de");
      deleteBackward(...args);
      updateBlockType(editor);
    };

    // TODO: if two lists are one after other of same type,  just merge them together
    // editor.normalizeNode = ([node, path]) => {
    //   if (node && node.type === "mark") {
    //     console.log("mark");
    //     if (!Node.string(node).match(/^\s*- $/)) {
    //       const newt = Node.string(node).slice(-1);
    //       Transforms.insertText(editor, newt, {
    //         at: SlateEditor.end(editor, path),
    //       });
    //     }
    //   }
    // };
  };

  return editor;
}

function updateBlockType(editor: BaseEditor & ReactEditor) {
  const blockEntry = getBlock(editor);
  console.log({ blockEntry });
  if (!blockEntry || !SlateElement.isElement(blockEntry[0])) {
    return;
  }
  console.log(blockEntry);
  const [block, path] = blockEntry as [SlateElement, Path];
  const text = Node.string(block);
  if (block.type === "list-item") {
    // convert task to regular
    if (block.task) {
      if (!text.match(/^\s*- \[[xX ]\]/)) {
        console.log("updating task item type");
        // Transforms.splitNodes(editor, { at: path });
        Transforms.setNodes(editor, { task: false }, { at: path });
      }
    }
    // make sure its still list-tem
    if (!text.match(/^\s*- /)) {
      console.log("updating list item type");
      // Transforms.splitNodes(editor, { at: path });
      Transforms.unwrapNodes(editor, { at: path, split: true });
      // Transforms.setNodes(editor, { type: "paragraph" }, { at: path });
    }
    // check the indentation levels are proper
  } else {
    //check if it is a list item now
  }
}
