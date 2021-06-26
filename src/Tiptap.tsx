import { EditorContent, useEditor } from "@tiptap/react";
import { debounce } from "debounce";
import firebase from "firebase/app";
import React, { useEffect, useState } from "react";
import "firebase/database";
import { buildTree, flattenData } from "./persistance";

import tiptapConfig from "./tiptap-editor";

const saveToDB = debounce((id: string, file: string, data: any) => {
  // console.log("writing data", id, file, data);
  const fin: any[] = [];
  flattenData({ attrs: { nodeid: "root" }, ...data }, fin);
  console.log(fin);
  // console.log(JSON.stringify(buildTree(fin)));
  // firebase
  //   .database()
  //   .ref(`nodes/${id}/${file}`)
  //   .set(replaceAttr(data))
  //   .then(() => {
  //     console.log("done writinf");
  //   });
}, 1000);

const Tiptap = ({ uid, file }: { uid: string; file: string }) => {
  const editor = useEditor({
    ...tiptapConfig,
    content: `loading ...`,
  });
  useEffect(() => {
    console.log("editor");
  }, [editor]);
  useEffect(() => {
    editor?.commands.setContent("<p>write</p>");
    // const dbRef = firebase.database().ref();
    // dbRef
    //   .child("nodes")
    //   .child(uid)
    //   .child(file)
    //   .get()
    //   .then((snapshot) => {
    //     if (snapshot.exists()) {
    //       console.log("s", snapshot.val(), revertAttr(snapshot.val()));
    //       editor?.commands.setContent(revertAttr(snapshot.val()), false);
    //     } else {
    //       console.log("No data available");
    //       editor?.commands.setContent(`<h1>${file}</h1><p></p>`);
    //     }
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
  }, [editor, file]);
  editor?.on("update", (c: any) => {
    // The content has changed.
    // console.log({ c });
    const content = editor?.getJSON();
    if (content) {
      saveToDB(uid, file, content);
    }
  });

  return <EditorContent editor={editor} />;
};

export default Tiptap;
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
