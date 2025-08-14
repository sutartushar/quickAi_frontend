import React from "react";
import { useUser, useClerk, Protect } from "@clerk/clerk-react";
import {
  Eraser,
  FileText,
  Hash,
  House,
  Image,
  LogOut,
  Scissors,
  SquarePen,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navigationItems = [
  { to: "/ai", label: "Dashboard", icon: House },
  { to: "/ai/write-article", label: "Write Article", icon: SquarePen },
  { to: "/ai/blog-titles", label: "Blog Titles", icon: Hash },
  { to: "/ai/generate-images", label: "Generate Images", icon: Image },
  { to: "/ai/remove-background", label: "Erase Background", icon: Eraser },
  { to: "/ai/remove-object", label: "Remove Object", icon: Scissors },
  { to: "/ai/review-resume", label: "Review Resume", icon: FileText },
  { to: "/ai/community", label: "Community", icon: Users },
];

const Sidebar = ({ sideBarOpen, setSidebarOpen }) => {
  const { user, isLoaded } = useUser();
  const { signOut, openUserProfile } = useClerk();

  return (
    <div
      className={`w-60 bg-white border-r border-gray-200 flex flex-col justify-between items-center max-sm:absolute top-14 bottom-0 ${
        sideBarOpen ? "translate-x-0" : "max-sm:-translate-x-full"
      } transition-all duration-300 ease-in-out`}
    >
      <div className="flex flex-col flex-grow w-full">
        <div className="my-7 w-full">
          {isLoaded && user ? (
            <div className="flex flex-col items-center">
              <img
                src={user.imageUrl}
                alt="user avatar"
                className="w-13 rounded-full mx-auto"
              />
              <span className="mt-2 text-gray-700 font-semibold text-base">
                {user.fullName || user.username}
              </span>

              {/* Navigation links */}
              <div className="mt-5 w-full px-4 text-sm font-medium">
                {navigationItems.map(({ to, label, icon: IconComponent }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === "/ai"}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `px-3.5 py-2.5 flex items-center gap-3 rounded mb-2 w-full ${
                        isActive
                          ? "bg-gradient-to-r from-[#3c81f6] to-[#9234fa] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <IconComponent
                          className={`w-4 h-4 ${
                            isActive ? "text-white" : "text-gray-500"
                          }`}
                        />
                        {label}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-13 h-13 rounded-full mx-auto bg-gray-200 flex items-center justify-center">
              Loading...
            </div>
          )}
        </div>
      </div>
      {/* This section will be pushed to the bottom */}
      <div className="w-full flex items-center justify-between border-t border-gray-200 p-4 px-7">
        <div
          onClick={openUserProfile}
          className="flex gap-2 items-center cursor-pointer"
        >
          <img src={user.imageUrl} alt="user" className="w-8 rounded-full" />
          <div>
            <h1 className="text-sm font-medium">{user.fullName}</h1>
            <p className="text-xs text-gray-500">
              <Protect plan="premium" fallback="free">
                Premium
              </Protect>
              {" "}Plan
            </p>
          </div>
        </div>
        <LogOut
          onClick={signOut}
          className="w-4.5 text-gray-400 hover:text-gray-700 transition cursor-pointer ml-auto"
        />
      </div>
    </div>
  );
};

export default Sidebar;