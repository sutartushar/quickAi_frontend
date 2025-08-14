import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { dummyPublishedCreationData } from "../assets/assets";
import { Heart } from "lucide-react";

const Community = () => {
  const { user } = useUser();
  const [creations, setCreations] = useState([]);

  const fetchCreations = () => {
    // For now, we use dummy data
    setCreations(dummyPublishedCreationData);
  };

  useEffect(() => {
    if (user) {
      fetchCreations();
    }
  }, [user]);

  return (
    <div className="flex-1 h-full flex flex-col gap-4 p-6">
      <h2 className="text-3xl font-bold text-gray-800">Community Creations</h2>
      <div className="flex-1 overflow-y-scroll p-4 bg-white rounded-lg border border-gray-200 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {creations.map((creation, index) => (
            <div
              key={index}
              className="relative group bg-gray-100 rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105"
            >
              <div className="w-full aspect-w-4 aspect-h-3">
                <img
                  src={creation.content}
                  alt={creation.prompt}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-70 p-4 text-white flex flex-col transition-all duration-300 transform translate-y-full group-hover:translate-y-0">
                <div className="flex justify-between items-center w-full">
                  <p className="text-sm font-medium truncate pr-2">{creation.prompt}</p>
                  <div className="flex items-center gap-1">
                    <p className="text-xs">{creation.likes.length}</p>
                    <Heart
                      className={`h-5 w-5 cursor-pointer transition-colors duration-200 ${
                        creation.likes.includes(user.id)
                          ? "text-red-500"
                          : "text-gray-400 hover:text-red-300"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Community;