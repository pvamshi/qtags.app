import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import "@toast-ui/editor/dist/toastui-editor.css";
import "prismjs/themes/prism.css";

import { EditorType } from "@toast-ui/editor";
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";
import { Editor } from "@toast-ui/react-editor";
import debounce from "debounce";
import firebase from "firebase";
import Prism from "prismjs";
import React, { useEffect, useRef, useState } from "react";

import idGen from "./id-generator-plugin";
import { flattenData, getTree, replaceAttr, revertAttr } from "./persistance";

const saveToDB = debounce((id: string, file: string, data: any) => {
  // IMPORTANT : TODO: Before save to db, make sure to convert it to wyswig doc mode
  const fin: any = {};
  flattenData(data.doc, fin);
  // console.log(JSON.stringify(getTree(fin, "doc")));
  firebase
    .database()
    .ref(`${id}/nodes/${file}`)
    .set(replaceAttr(fin))
    .then(() => {
      console.log("done writing");
    });
}, 1000);

const MyComponent = ({ file, uid }: { file: string; uid: string }) => {
  const ref = useRef<Editor>(null);

  useEffect(() => {
    if (ref && ref.current !== null) {
      const dbRef = firebase.database().ref();
      dbRef
        .child(uid)
        .child("nodes")
        .child(file)
        .get()
        .then((snapshot) => {
          if (snapshot.exists()) {
            const res = revertAttr(getTree(snapshot.val(), "doc"));
            ref.current?.getInstance().exec("setJSON", res);
            // editor?.commands.setContent(revertAttr(snapshot.val()), false);
          } else {
            console.log("No data available");
            ref.current?.getInstance().exec("setJSON", {
              type: "doc",
              content: [
                {
                  type: "heading",
                  attrs: { level: 1 },
                  content: [{ type: "text", text: file }],
                },
              ],
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [ref.current, uid, file]);
  return (
    <>
      <Editor
        initialValue="loading data do not edit!"
        previewStyle="tab"
        height="100%"
        usageStatistics={false}
        initialEditType="wysiwyg"
        useCommandShortcut={true}
        plugins={[[codeSyntaxHighlight, { highlighter: Prism }], idGen]}
        ref={ref}
        theme="dark"
        onChange={(type: EditorType) => {
          const editor = (ref.current as any).editorInst;
          if (type === "markdown") {
            // convert it to node structure
            const mdNode = editor.toastMark.getRootNode();
            const data = editor.convertor.toWysiwygModel(mdNode);
            editor.wwEditor.setModel(data);
          }
          const data = editor.wwEditor.view.state.toJSON();
          saveToDB(uid, file, data);
        }}
      />
    </>
  );
};

export default MyComponent;
