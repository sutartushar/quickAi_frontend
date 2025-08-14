import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import Button from "@mui/material/Button";
import { ArrowRight } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

const NavBar = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn } = useClerk();
  return (
    <div className="fixed z-5 w-full backdrop-blur-2xl flex justify-between items-center px-4 py-3 sm-px:20 xl-px:32 ">
      <img
        src={assets.logo}
        alt="logo"
        className="w-32 sm:w-44 cursor-pointer"
        onClick={() => navigate("/")}
      />

      {user ? (
        <UserButton />
      ) : (
        <Button variant="contained" onClick={openSignIn}>
          Get started
          <ArrowRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default NavBar;
