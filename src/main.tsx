import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "firebase/firestore";
import firebase from "firebase";
import Plugin from "./Plugin";
import App from "./App";
import Home from "./Home";

const firebaseConfig = {
  apiKey: "AIzaSyDe0MkMRDzySCZA9Bx_0OWNeZcfkBkzB6M",
  authDomain: "qtags-app.firebaseapp.com",
  databaseURL:
    "https://qtags-app-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "qtags-app",
  storageBucket: "qtags-app.appspot.com",
  messagingSenderId: "876480915268",
  appId: "1:876480915268:web:f37cb36be791cd15729911",
  measurementId: "G-TZYHCTL9GG",
};
firebase.initializeApp(firebaseConfig);
const app = (user: firebase.User) => {
  ReactDOM.render(
    <React.StrictMode>
      <div className="flex">
        <div className="flex-none w-64">
          <Home />
        </div>
        <div className="flex-1 pl-5">
          <App uid={user.uid} />
          {<Plugin />}
        </div>
      </div>
      {/* <FirebaseAppProvider firebaseConfig={firebaseConfig}> */}
      {/* </FirebaseAppProvider> */}
    </React.StrictMode>,
    document.getElementById("root")
  );
};
// firebase
//   .auth()
//   .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
//   .then(() => {
var provider = new firebase.auth.GoogleAuthProvider();
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    app(user);
  } else {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential: firebase.auth.OAuthCredential | null =
          result.credential;

        if (credential !== null) {
          var token = credential.accessToken;
          // The signed-in user info.
          var user = result.user;
          if (user) {
            app(user);
          } else {
            document.createElement("<p> Error while logging in</p>");
          }
        } else {
          document.createElement("<p> Error while logging in</p>");
        }
        // This gives you a Google Access Token. You can use it to access the Google API.
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
    // });
  }
});
