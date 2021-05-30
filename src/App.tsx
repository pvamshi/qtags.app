import { nanoid } from "nanoid";
import { useMemo, useState } from "react";
import * as React from "react";
import { BaseEditor, createEditor, Descendant } from "slate";
import { Editable, ReactEditor, Slate, withReact } from "slate-react";

import withLists from "./with-lists";
import { ElementNode } from "./models";
import handleKeys from "./hotkeys";

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: Partial<ElementNode> & { type: string };
  }
}

const App = () => {
  const editor = useMemo(() => withLists(withReact(createEditor())), []);
  const [value, setValue] = useState<Descendant[]>([
    { type: "paragraph", id: nanoid(), children: [{ text: "starting" }] },
  ]);
  console.log(value);
  return (
    // Add the editable component inside the context.
    <Slate
      editor={editor}
      value={value}
      onChange={(newValue) => setValue(newValue)}
    >
      <Editable onKeyDown={handleKeys(editor)} />
    </Slate>
  );
};

export default App;
