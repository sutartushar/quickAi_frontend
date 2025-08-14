import React, { useState } from "react";
import { Sparkles, Hash } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const BlogTitles = () => {
  const blogCategories = [
    "General",
    "Technology",
    "Health",
    "Business",
    "Lifestyle",
    "Travel",
    "Education",
    "Entertainment",
    "Finance",
  ];

  const [inputValue, setInputValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("General");
  const [generatedArticle, setGeneratedArticle] = useState("");
  const [loading, setLoading] = useState(false);

  const { getToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Generate blog titles for the topic: "${inputValue}" in the category: "${selectedCategory}"`;

      const { data } = await axios.post(
        "/api/ai/blog-titles",
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );
      if (data.success) {
        setGeneratedArticle(data.content);
      } else {
        toast.error(data.message || "Failed to generate article");
      }
      setLoading(false);
      setInputValue("");
      setSelectedCategory("General");
    } catch (error) {
      toast.error("Failed to generate titles. Please try again.");
      console.error("Error generating titles:", error);
    }
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700 font-sans">
      {/* Left side: Input Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200 shadow-md"
      >
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-6 text-purple-500" />
          <h1 className="text-xl font-semibold text-gray-800">
            Title Generation
          </h1>
        </div>

        <p className="mt-4 text-sm font-medium text-gray-700">
          Blog Topic or Keywords
        </p>
        <input
          type="text"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border"
          placeholder="e.g., The benefits of mindfulness, Future of AI in healthcare"
          required
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />

        {/* New section for Blog Categories as pill shapes */}
        <p className="mt-4 text-sm font-medium text-gray-700">
          Blog Categories
        </p>
        <div className="mt-3 flex gap-2 flex-wrap">
          {blogCategories.map((category, idx) => (
            <span
              key={idx}
              onClick={() => setSelectedCategory(category)}
              className={`text-xs px-3 py-1 border rounded-full cursor-pointer transition-colors duration-200
                ${
                  selectedCategory === category
                    ? "bg-purple-50 text-purple-700"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-200"
                }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          ))}
        </div>

        <button
          disabled={loading}
          type="submit"
          className="mt-8 cursor-pointer w-full py-2.5 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-600 via-violet-700 to-fuchsia-800 hover:from-purple-700 hover:via-violet-800 hover:to-fuchsia-900 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Hash className="w-5 h-5 mr-1" />
          )}
          Generate Titles
        </button>
      </form>

      {/* Right side: Placeholder for Generated Titles Display */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px] overflow-y-auto shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <Hash className="w-6 text-purple-600 h-5" />
          <h1 className="text-xl font-semibold text-gray-800">
            Generated Blog Titles
          </h1>
        </div>

        {!generatedArticle ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400 text-center p-4">
              <Hash className="w-9 h-9" />
              <p>Your generated blog titles will appear here.</p>
              <p>Enter a topic and click "Generate Titles" to see results.</p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full overflow-y-scroll text-sm text-gray-700">
            <div className="reset-tw">
              <Markdown>{generatedArticle}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogTitles;
