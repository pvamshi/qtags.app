import React, { useEffect, useState } from "react";
import File from "./File";
import AddFileIcon from "./AddFileIcon";
import type firebase from "firebase";

const Home = ({
  user,
  onChange,
}: {
  user: firebase.User;
  onChange: (file: string) => void;
}) => {
  const [files, setFiles] = useState<string[]>([
    "20210704",
    "20210625",
    "20210624",
    "qtagsapp",
  ]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    if (files.length > 0) {
      onChange(files[0]);
    }
  }, []);
  return (
    <div className="flex flex-col  h-screen px-4 py-4 bg-white  dark:bg-gray-800 dark:border-gray-600 fixed ">
      <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">
        +qTags.app
      </h1>

      <div className="relative mt-6">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            className="w-5 h-5 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </span>

        <form className="w-full max-w-sm">
          <div className="flex items-center border-b border-teal-500 py-2">
            <input
              className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="text"
              value={searchText}
              placeholder=""
              aria-label="Full name"
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button
              className="flex-shrink-0  text-sm  text-white py-1 px-2 rounded"
              type="button"
              onClick={() => {
                if (searchText) {
                  setFiles([searchText, ...files]);
                  setSelectedIndex(0);
                  onChange(searchText);
                  setSearchText("");
                }
              }}
            >
              <AddFileIcon />
            </button>
          </div>
        </form>
        {/* <input
          type="text"
          className="w-full py-3 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
          placeholder="Search"
        /> */}
      </div>

      <div className="flex flex-col justify-between flex-1 mt-6">
        <nav>
          {files.map((f, index) => (
            <File
              key={index}
              name={f}
              selected={index === selectedIndex}
              onClick={() => {
                setSelectedIndex(index);
                onChange(files[index]);
              }}
            />
          ))}
        </nav>

        <div className="flex items-center px-4 -mx-2">
          {user.photoURL && (
            <img
              className="object-cover mx-2 rounded-full h-9 w-9"
              src={user.photoURL}
              alt="avatar"
            />
          )}
          <h4 className="mx-2 font-medium text-gray-800 dark:text-gray-200 hover:underline">
            {user.displayName}
          </h4>
        </div>
      </div>
    </div>
  );
};
export default Home;
