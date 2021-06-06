import { ReactEditor } from ".pnpm/slate-react@0.63.0_c0567ed259c447a57d5e502f74e1a9dd/node_modules/slate-react";
import { BaseEditor, Editor } from "slate";
export function getBlock(editor: BaseEditor & ReactEditor) {
  return Editor.above(editor, {
    match: (n) => Editor.isBlock(editor, n),
  });
}
