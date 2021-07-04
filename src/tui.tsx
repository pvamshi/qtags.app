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
import React, { useCallback, useEffect, useRef, useState } from "react";

import idGen from "./id-generator-plugin";

const saveToDB = debounce((id: string, file: string, data: any) => {
  // console.log("writing data", id, file, data);
  // IMPORTANT : TODO: Before save to db, make sure to convert it to wyswig doc mode
  // const fin: any[] = [];
  // flattenData({ attrs: { nodeid: "root" }, ...data }, fin);
  // console.log(fin);
  // console.log(JSON.stringify(buildTree(fin)));
  firebase
    .database()
    .ref(`nodes/${id}/${file}`)
    .set(replaceAttr(data))
    .then(() => {
      console.log("done writing");
    });
}, 5000);

const MyComponent = ({ file, uid }: { file: string; uid: string }) => {
  const ref = useRef<Editor>(null);
  const [init, setInit] = useState(false);

  useEffect(() => {
    if (init) return;
    if (ref && ref.current !== null) {
      const dbRef = firebase.database().ref();
      dbRef
        .child("nodes")
        .child(uid)
        .child(file)
        .get()
        .then((snapshot) => {
          if (snapshot.exists()) {
            console.log("s", snapshot.val(), revertAttr(snapshot.val()));
            ref.current
              ?.getInstance()
              .exec("setJSON", revertAttr(snapshot.val()));
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
      setInit(true);
    }
  }, [ref.current, init, setInit]);
  return (
    <>
      <Editor
        initialValue="loading data do not edit!"
        previewStyle="vertical"
        height="100%"
        usageStatistics={false}
        initialEditType="wysiwyg"
        useCommandShortcut={true}
        plugins={[[codeSyntaxHighlight, { highlighter: Prism }], idGen]}
        ref={ref}
        theme="dark"
        onChange={(type: EditorType) => {
          if (type === "markdown") {
            // convert it to node structure
          } else {
            const data = (
              ref.current as any
            ).editorInst.wwEditor.view.state.toJSON();
            console.log(data);
            saveToDB(uid, file, data);
          }
        }}
      />
    </>
  );
};

export default MyComponent;
function replaceAttr(obj: any) {
  if (obj.hasOwnProperty("attrs")) {
    obj.attrs = JSON.stringify(obj["attrs"]);
  }
  if (obj.content) {
    obj.content = obj.content.map((c: any) => replaceAttr(c));
  }
  return obj;
}

function revertAttr(obj: any) {
  if (obj.hasOwnProperty("attrs")) {
    obj.attrs = JSON.parse(obj["attrs"]);
  }
  if (obj.content) {
    obj.content = obj.content.map((c: any) => revertAttr(c));
  }
  return obj;
}
