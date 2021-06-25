import React from "react";
import clx from "classnames";

function File({
  name,
  selected = false,
  onClick,
}: {
  name: string;
  selected?: boolean;
  onClick: () => void;
}) {
  return (
    <a
      onClick={onClick}
      className={clx([
        "flex",
        "items-center",
        "px-2",
        "py-1",
        "mt-1",
        selected ? "text-gray-600" : "text-gray-700",
        selected ? "bg-gray-200" : "",
        "transition-colors",
        "duration-200",
        "transform",
        "rounded-md",
        "dark:text-gray-400",
        "hover:bg-gray-200",
        "dark:hover:bg-gray-700",
        "dark:hover:text-gray-200",
        "hover:text-gray-700",
      ])}
      href="#"
    >
      <svg
        className="w-5 h-5"
        enableBackground="new 0 0 24 24"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <path
            d="m18.25 23.25h-12.5c-1.105 0-2-.895-2-2v-18.5c0-1.105.895-2 2-2h12.5c1.105 0 2 .895 2 2v18.5c0 1.105-.895 2-2 2z"
            fill="#eceff1"
          />
        </g>
        <g>
          <path d="m18.25 24h-12.5c-1.517 0-2.75-1.233-2.75-2.75v-18.5c0-1.517 1.233-2.75 2.75-2.75h12.5c1.517 0 2.75 1.233 2.75 2.75v18.5c0 1.517-1.233 2.75-2.75 2.75zm-12.5-22.5c-.689 0-1.25.561-1.25 1.25v18.5c0 .689.561 1.25 1.25 1.25h12.5c.689 0 1.25-.561 1.25-1.25v-18.5c0-.689-.561-1.25-1.25-1.25z" />
        </g>
        <g>
          <path d="m17.25 14.5h-10.5c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h10.5c.414 0 .75.336.75.75s-.336.75-.75.75z" />
        </g>
        <g>
          <path d="m17.25 18.5h-10.5c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h10.5c.414 0 .75.336.75.75s-.336.75-.75.75z" />
        </g>
        <g>
          <path d="m17.25 10.5h-10.5c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h10.5c.414 0 .75.336.75.75s-.336.75-.75.75z" />
        </g>
        <g>
          <path d="m12.25 6.5h-5.5c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h5.5c.414 0 .75.336.75.75s-.336.75-.75.75z" />
        </g>
      </svg>

      <span className="mx-4 font-medium">{name}</span>
    </a>
  );
}

export default File;
