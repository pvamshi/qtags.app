import React, { useState } from "react";

import Home from "./Home";
import TipTap from "./Tiptap";

import type firebase from "firebase";
const App = ({ user }: { user: firebase.User }) => {
  const [file, setFile] = useState<string | null>(null);
  return (
    <div className="flex">
      <div className="flex-none w-80">
        <Home onChange={setFile} user={user} />
      </div>
      <div className="flex-1 p-4">
        {file && <TipTap uid={user.uid} file={file} />}
      </div>
    </div>
  );
};

export default App;
