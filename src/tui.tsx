import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";

import { Editor } from "@toast-ui/react-editor";
import { PluginContext, PluginInfo } from "@toast-ui/editor";
import React, { useRef } from "react";
import "prismjs/themes/prism.css";
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import Prism from "prismjs";
import { EditorState } from "prosemirror-state";

import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";

import { TextSelection } from "prosemirror-state";
import {
  Schema,
  Node as ProseMirrorNode,
  ParseOptions,
  DOMParser,
} from "prosemirror-model";

function Hashtag(context: PluginContext, options?: any): PluginInfo {
  console.log({ context, options });
  return {};
}
const tagRe = /([\s])(\#\w+)([\s])/;

export const setContent =
  (content, emitUpdate = false, parseOptions = {}) =>
  ({ tr, editor, dispatch }) => {
    const { doc } = tr;
    const document = createDocument(content, editor.schema, parseOptions);
    const selection = TextSelection.create(doc, 0, doc.content.size);

    if (dispatch) {
      tr.setSelection(selection)
        .replaceSelectionWith(document, false)
        .setMeta("preventUpdate", !emitUpdate);
    }

    return true;
  };
let stop = false;
const MyComponent = () => {
  const ref = useRef(null); // ref => { current: null }
  console.log(ref);

  return (
    <Editor
      initialValue="hello react editor world!"
      previewStyle="tab"
      height="100%"
      usageStatistics={false}
      initialEditType="markdown"
      useCommandShortcut={true}
      widgetRules={[
        {
          rule: tagRe,
          toDOM: (text) => {
            const matched = text.match(tagRe);
            console.log({ text, matched });
            if (matched === null) {
              return document.createElement("span");
            }
            const span = document.createElement("span");
            const spanInner = document.createElement("span");
            spanInner.setAttribute("data-type", "tag");
            spanInner.appendChild(
              document.createTextNode(matched ? matched[2] : "")
            );
            if (matched[1] === " ")
              span.appendChild(document.createTextNode(" "));
            span.appendChild(spanInner);
            if (matched[3] === " ")
              span.appendChild(document.createTextNode(" "));
            return span;
          },
        },
      ]}
      plugins={[[codeSyntaxHighlight, { highlighter: Prism }], Hashtag]}
      ref={ref}
      theme="dark"
      onFocus={() => {
        console.log("foc");
        const state = (ref.current as any).editorInst.mdEditor.view
          .state as EditorState;
        const selection = TextSelection.create(
          state.doc,
          0,
          state.doc.content.size
        );
        // (ref.current as any).editorInst.mdEditor.view.dispatch(
        //   state.tr.insertText("som.......")
        // );

        const parser = DOMParser.fromSchema(
          (ref.current as any).editorInst.mdEditor.schema
        );
        const schema = (ref.current as any).editorInst.mdEditor
          .schema as Schema;
        // (ref.current as any).editorInst.commandManager.mdCommands.selectAll();
        (ref.current as any).editorInst.mdEditor.view.dispatch(
          state.tr
            // .replaceRangeWith(
            // (ref.current as any).editorInst.mdEditor.view.state.selection
            //   .$anchor.pos,
            .setSelection(selection)
            .replaceSelectionWith(
              schema.nodeFromJSON({
                type: "paragraph",
                content: [{ type: "text", text: "Wow !!" }],
              }),
              true
            )
        );
        console.log(
          "replace w",
          parser.parse(
            new window.DOMParser().parseFromString(
              `<body><p>some other randommm</p></body>`,
              "text/html"
            ).body
          ),
          schema.nodeFromJSON({
            type: "paragraph",
            content: [{ type: "text", text: "Wow !!" }],
          })
        );
      }}
      onBeforeConvertWysiwygToMarkdown={(...args) => {
        console.log(args);
        // (ref.current as any).editorInst.mdEditor.view.state.create({
        //   doc: {
        //     type: "doc",
        //     content: [
        //       {
        //         type: "paragraph",
        //         content: [{ type: "text", text: "updated  text value" }],
        //       },
        //     ],
        //   },
        // });

        return args[0];
      }}
      onChange={(...args) => {
        console.log(
          (ref.current as any).editorInst.mdEditor.view.state.toJSON()
        );
        const parser = DOMParser.fromSchema(
          (ref.current as any).editorInst.wwEditor.schema
        );
        stop = true;
        // ;

        // (ref.current as any).editorInst.commandManager.mdCommands.selectAll();
        // .setSelection(selection)
        // .replaceSelectionWith(
        //   parser.parse(
        //     new window.DOMParser().parseFromString(
        //       `<body><p>some other randommm</p></body>`,
        //       "text/html"
        //     ).body
        //   )
        // );

        // console.log((ref.current as any).editorInst.toastMark.getRootNode());
        // console.log(ref.current as any);
        return args[0];
      }}
    />
  );
};

export default MyComponent;
