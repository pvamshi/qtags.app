import React from "react";
import File from "./File";

const Home = () => (
  <div className="flex flex-col w-0 md:w-64 h-screen px-4 py-8 bg-white border-r dark:bg-gray-800 dark:border-gray-600 fixed ">
    <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">
      +qTags.app
    </h2>

    <div className="relative mt-6">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
        <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none">
          <path
            d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      </span>

      <input
        type="text"
        className="w-full py-3 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
        placeholder="Search"
      />
    </div>

    <div className="flex flex-col justify-between flex-1 mt-6">
      <nav>
        {["file1", "file2", "file3"].map((f, index) => (
          <File key={index} name={f} selected={index === 0} />
        ))}
      </nav>

      <div className="flex items-center px-4 -mx-2">
        <img
          className="object-cover mx-2 rounded-full h-9 w-9"
          src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
          alt="avatar"
        />
        <h4 className="mx-2 font-medium text-gray-800 dark:text-gray-200 hover:underline">
          John Doe
        </h4>
      </div>
    </div>
  </div>
);
export default Home;
