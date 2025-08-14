import React from "react";
import "../index.css";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <div
      id="hero-bg"
      className="px-4 sm:px-20 xl:px-32 relative inline-flex flex-col w-full justify-center min-h-screen bg-[url('/assets/gradientBackground.png')]"
    >
      <div className="text-center mb-6">
        <h1 className="text-black text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-semibold mx-auto leading-[1.2]">
          Create amazing content <br /> with{" "}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
            {" "}
            AI tools
          </span>
        </h1>
        <p className="mt-4 max-w-s sm:max-w-lg 2xl:max-w-xl m-auto max-sm:text-xs text-gray-600">
          Transform your content creation with our suite of premium AI tools.
          Write articles, generate images, and enhance your workflow.
        </p>
      </div>
      <div className="flex justify-center mt-8">
        <button
          className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          onClick={() => navigate("/ai")} 
        >
          Start creating now
        </button>
      </div>
      <div className="flex items-center g-4 mt-8 mx-auto text-gray-600">
        <img src={assets.user_group} alt="user_group" className="h-8 mr-1" />
        trusted by 10k+ people
      </div>
    </div>
  );
};

export default Hero;
