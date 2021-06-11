import { nanoid } from "nanoid";
import { useMemo, useState } from "react";
import * as React from "react";
import { BaseEditor, createEditor, Descendant } from "slate";
import { Editable, ReactEditor, Slate, withReact } from "slate-react";
import logTree from "console-log-tree";
import { debounce } from "debounce";

import withLists from "./with-lists";
import { ElementNode } from "./models";
import handleKeys from "./hotkeys";
import firebase from "firebase";
import { useEffect } from "react";

// var user = firebase.auth().currentUser;

// var database = firebase.database();
function writeUserData(id: string, data: any) {
  console.log("writing");
  firebase
    .database()
    .ref("nodes/" + id)
    .set(data)
    .then(() => {
      console.log("done writinf");
    });
}
const update = debounce(writeUserData, 1000);
declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: ElementNode;
  }
}

/* 
  - Handle tasks
    - handle done state
  - Hanlde multiple types of list chars
  - handle number types
  - Add header and other plugins
  - Style tags with lighter color
  - add tags and queries
  - save and retrieve from database
*/
const App = ({ uid }: { uid: string }) => {
  const editor = useMemo(() => withLists(withReact(createEditor())), []);
  const [value, setValue] = useState<Descendant[]>([
    { type: "paragraph", id: nanoid(), children: [{ text: "starting" }] },
  ]);
  useEffect(() => {
    const dbRef = firebase.database().ref();
    dbRef
      .child("nodes")
      .child(uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          setValue(snapshot.val());
          console.log(snapshot.val());
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [setValue]);
  logTree.log(log(value));
  console.log(value);
  const updateData = (data: Descendant[]) => {
    setValue(data);
    update(uid, data);
  };
  return (
    // Add the editable component inside the context.
    <>
      {uid}
      <Slate
        editor={editor}
        value={value}
        onChange={(newValue) => updateData(newValue)}
      >
        <Editable onKeyDown={handleKeys(editor)} placeholder={"dump"} />
      </Slate>
    </>
  );
};

export default App;

function log(value: any[]): any {
  return value.map((val: any) => ({
    name: val.children
      ?.filter((c: any) => !c.children)
      .map((c: any) => c.text.trim()),
    children: log(val.children?.filter((c: any) => c.children)),
  }));
}
