import React, { useState } from "react";

import Home from "./Home";
import TipTap from "./Tiptap";

import HamBurgerIcon from "./icons/hamburger";
import type firebase from "firebase";
import classNames from "classnames";
const App = ({ user }: { user: firebase.User }) => {
  const [file, setFile] = useState<string | null>(null);
  const [showSideBar, setShowSideBar] = useState(false);
  return (
    <div className="flex">
      <div
        className={classNames([
          "flex-none",
          "w-80",
          { hidden: !showSideBar },
          "md:block",
          "bg-white",
          "z-10",
          { absolute: showSideBar },
          { "md:static": showSideBar },
        ])}
      >
        <Home onChange={setFile} user={user} />
      </div>
      <div className="flex-1 p-4">
        <div className="md:hidden absolute right-4 top-4 z-20">
          <button className="" onClick={() => setShowSideBar(!showSideBar)}>
            <HamBurgerIcon />
          </button>
        </div>
        {file && <TipTap uid={user.uid} file={file} />}
      </div>
    </div>
  );
};

export default App;
