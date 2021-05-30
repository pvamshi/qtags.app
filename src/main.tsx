import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import "firebase/firestore";
import { FirebaseAppProvider } from "reactfire";

const firebaseConfig = {
  apiKey: "AIzaSyAtJ25nFF2VABsK5R27GJ3gcDbfODam67U",
  authDomain: "qtags-6dade.firebaseapp.com",
  projectId: "qtags-6dade",
  storageBucket: "qtags-6dade.appspot.com",
  messagingSenderId: "739622288531",
  appId: "1:739622288531:web:9059f5cf128205a02c6166",
  measurementId: "G-2W1F9SZHQJ",
};

ReactDOM.render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <App />
    </FirebaseAppProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
