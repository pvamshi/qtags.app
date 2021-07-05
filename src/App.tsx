import React, { useState } from "react";

import Home from "./Home";

import HamBurgerIcon from "./icons/hamburger";
import type firebase from "firebase";
import classNames from "classnames";
import Tui from "./tui";
const App = ({ user }: { user: firebase.User }) => {
  const [file, setFile] = useState<string | null>(null);
  const [showSideBar, setShowSideBar] = useState(false);
  return (
    <div className="flex bg-white h-full">
      <div
        className={classNames([
          "flex-none",
          "w-80",
          { hidden: !showSideBar },
          "lg:block",
          "bg-white",
          "z-10",
          { absolute: showSideBar },
          { "lg:static": showSideBar },
        ])}
      >
        <Home
          onChange={(file) => {
            console.log("filie ch");
            setFile(file);
            setShowSideBar(false);
          }}
          user={user}
        />
      </div>
      <div className="flex-1 p-4 h-full">
        <div className="lg:hidden absolute right-4 top-4 z-20">
          <button className="" onClick={() => setShowSideBar(!showSideBar)}>
            <HamBurgerIcon />
          </button>
        </div>
        {/* {file && <TipTap uid={user.uid} file={file} />} */}
        {file && <Tui file={file} uid={user.uid} />}
      </div>
    </div>
  );
};

export default App;
