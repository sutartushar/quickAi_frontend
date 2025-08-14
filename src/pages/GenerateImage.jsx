import React, { useState } from "react";
import { Sparkles, Image } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

const GenerateImage = () => {
  const ImageCategory = [
    "3D Style",
    "Cartoon Style",
    "Realistic Style",
    "Anime Style",
    "Ghibli Style",
  ];

  const [inputValue, setInputValue] = useState("");
  const [selectedImageCategory, setSelectedImageCategory] =
    useState("3D Style");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const { getToken } = useAuth();

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);
    const prompt = `Generate a ${selectedImageCategory} image of: "${inputValue}"`;

    const { data } = await axios.post(
      "/api/ai/generate-images",
      { prompt },
      {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      }
    );

    if (data.success) {
      setGeneratedImage(data.content);
    } else {
      toast.error(data.message || "Failed to generate image");
    }

    setInputValue("");
    setSelectedImageCategory("3D Style");

  } catch (error) {
    toast.error("Failed to generate image. Please try again.");
    console.error("Error generating image:", error);
  } finally {
    setLoading(false); // This will always run, whether the request succeeded or failed
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
          <Sparkles className="w-6 text-green-500" />
          <h1 className="text-xl font-semibold text-gray-800">
            Image Generation
          </h1>
        </div>

        <p className="mt-4 text-sm font-medium text-gray-700">
          Describe the image you want to generate
        </p>
        <textarea
          rows={4}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border "
          placeholder="Describe what do you want to see in the image"
          required
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />

        <p className="mt-4 text-sm font-medium text-gray-700">Image Style</p>
        <div className="mt-3 flex gap-2 flex-wrap">
          {ImageCategory.map((style, idx) => (
            <span
              key={idx}
              onClick={() => setSelectedImageCategory(style)}
              className={`text-xs px-3 py-1 border rounded-full cursor-pointer transition-colors duration-200
                ${
                  selectedImageCategory === style
                    ? "bg-green-100 text-green-700 border-green-400"
                    : "bg-gray-50 text-gray-700 hover:bg-green-50"
                }`}
            >
              {style}
            </span>
          ))}
        </div>
        {/* Generate Image Button */}
        <button
          disabled={loading}
          type="submit"
          className="mt-4 cursor-pointer w-full py-2.5 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-green-500 via-emerald-500 to-lime-500 hover:from-green-600 hover:via-emerald-600 hover:to-lime-600 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Image className="w-5 h-5 mr-1" />
          )}
          Generate Image
        </button>
      </form>

      {/* Right side: Placeholder for Generated Titles Display */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px] overflow-y-auto shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <Image className="w-6 text-green-600 h-5" />
          <h1 className="text-xl font-semibold text-gray-800">
            Generated Image
          </h1>
        </div>

        {!generatedImage ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400 text-center p-4">
              <Image className="w-9 h-9" />
              <p>Your generated image will appear here.</p>
              <p>Describe an image and click "Generate Image" to see result.</p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full">
            <img src={generatedImage} alt="Thumbnail..." className="w-full h-full"/>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateImage;
