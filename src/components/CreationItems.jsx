import React, { useState } from "react";
import MarkDown from "react-markdown";

const CreationItems = ({ items }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="p-4 max-w-5xl text-sm bg-white border border-gray-200 rounded-lg cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1"
    >
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2 className="hover:underline transition-all duration-200 ease-in-out">
            {items.prompt}
          </h2>
          <p className="text-gray-500">
            {items.type} -{" "}
            {items.created_at
              ? new Date(items.created_at).toLocaleDateString()
              : "No date"}
          </p>
        </div>
        <button className="bg-[#eff6ff] border border-[#bfdbfe] text-[#1e40af] px-4 py-1 rounded-full">
          {items.type}
        </button>
      </div>

      {expanded && (
        <div>
          {items.type === "image" ? (
            <div>
              <img
                src={items.content}
                alt="image"
                className="mt-3 w-full max-w-md"
              />
            </div>
          ) : (
            <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-700">
              {/* Added a class to handle overflow specifically for markdown content */}
              <div className="reset-tw markdown-content overflow-x-auto">
                <MarkDown>{items.content}</MarkDown>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreationItems;