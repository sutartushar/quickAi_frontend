import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { Menu, X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useUser, SignIn } from "@clerk/clerk-react";

const Layout = () => {
  const navigate = useNavigate();
  const [sideBarOpen, setSidebarOpen] = useState(false);
  const { user } = useUser();

  return user ? (
    <div className="flex flex-col h-screen">
      <nav className="w-full px-8 min-h-14 flex items-center justify-between border-b border-gray-200">
        <img src={assets.logo} alt="Logo" onClick={() => navigate("/")} />
        {sideBarOpen ? (
          <X
            onClick={() => setSidebarOpen(false)}
            className="w-6 h-6 text-gray-600 sm:hidden"
          />
        ) : (
          <Menu
            onClick={() => setSidebarOpen(true)}
            className="w-6 h-6 text-gray-600 sm:hidden"
          />
        )}
      </nav>

      <div className="flex flex-row flex-1 w-full h-full">
        <Sidebar sideBarOpen={sideBarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto bg-[#f4f7fb]">
          <Outlet />
        </main>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen">
      <SignIn />
    </div>
  );
};

export default Layout;
