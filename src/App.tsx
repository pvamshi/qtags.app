import {
  useSlatePluginsActions,
  useSlatePluginsStore,
} from "@udecode/slate-plugins";
import React, { useEffect } from "react";
import firebase from "firebase";
import { debounce } from "debounce";

const saveToDB = debounce((id: string, data: any) => {
  firebase
    .database()
    .ref("nodes/" + id + "/main")
    .set(data)
    .then(() => {
      console.log("done writinf");
    });
}, 3000);
const App = ({ uid }: { uid: string }) => {
  const store = useSlatePluginsStore();
  const { setValue } = useSlatePluginsActions();
  useEffect(() => {
    const value = store["main"]?.value;
    if (!value) {
      return;
    }
    console.log("val chaneed", value);
    saveToDB(uid, value);
  }, [store, uid]);
  useEffect(() => {
    const dbRef = firebase.database().ref();
    dbRef
      .child("nodes")
      .child(uid)
      .child("main")
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
  // console.log({ store: store["main"].value, actions });
  return null;
};
export default App;

/* 
  firebase
    .database()
    .ref("nodes/" + id)
    .set(data)
    .then(() => {
      console.log("done writinf");
    });u
u
const dbRef = firebase.database().ref();
dbRef
  .child("nodes")
  .child(uid)
  .child("0")
  .get()
  .then((snapshot) => {
    if (snapshot.exists()) {
      // setValue(snapshot.val());
      console.log(snapshot.val());
    } else {
      console.log("No data available");
    }
  })
  .catch((error) => {
    console.error(error);
  });
  */
