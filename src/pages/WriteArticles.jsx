import React, { useState } from "react";
import { Edit, Sparkles, SquarePen } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const WriteArticles = () => {
  const articleLengthOptions = [
    { length: "short", label: "Short (100-300 words)", tokens: 300 },
    { length: "medium", label: "Medium (300-700 words)", tokens: 700 },
    { length: "long", label: "Long (700+ words)", tokens: 1000 },
  ];

  const [inputValue, setInputValue] = useState("");
  const [selectedLength, setSelectedLength] = useState(articleLengthOptions[0]);
  const [generatedArticle, setGeneratedArticle] = useState("");
  const [loading, setLoading] = useState(false);

  const { getToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Generate a ${selectedLength.length} article on the topic: "${inputValue}"`;

      const { data } = await axios.post(
        "/api/ai/generate-article",
        { prompt, length: selectedLength.tokens },
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
    } catch (error) {
      console.error("Error generating article:", error);
      toast.error("Failed to generate article. Please try again.");
    }
    setLoading(false);
    setInputValue("");
    setSelectedLength(articleLengthOptions[0]);
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* {left side } */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#4a7aff]" />
          <h1 className="text-xl font-semibold">Article Configuration</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Article Topics</p>
        <input
          type="text"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border"
          placeholder="The future of artificial intelligence is..."
          required
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <p className="mt-4 text-sm font-medium">Article length</p>
        <div className="mt-3 flex gap-3 flex-wrap sm:max-w-9/11">
          {articleLengthOptions.map((items, idx) => (
            <span
              key={idx}
              onClick={() => setSelectedLength(items)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedLength.length === items.length
                  ? "bg-blue-50 text-blue-700"
                  : "bg-gray-50 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {items.label}
            </span>
          ))}
        </div>
        <br />
        <button
          disabled={loading}
          type="submit"
          className="cursor-pointer w-full py-2 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-sky-500 via-indigo-500 to-blue-700 hover:from-sky-600 hover:via-indigo-600 hover:to-blue-800 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <SquarePen className="w-5 h-5 mr-1" />
          )}
          Generate Article
        </button>
      </form>
      {/* right side */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border  border-gray-200 min-h-96 max-h-[600px] overflow-y-auto">
        <div className="flex items-center gap-3">
          <Edit className="w-6 text-[#4a7aff] h-5" />
          <h1 className="text-xl font-semibold">Generate article</h1>
        </div>
        {!generatedArticle ? (
          <div className="flex- 1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Edit className="w-9 h-9" />
              <p>Enter a topic and click "Generate article" to get started</p>
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

export default WriteArticles;
