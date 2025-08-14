import React, { useState } from "react";
import { Sparkles, Eraser, Upload } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const RemoveBackground = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);


  const { getToken } = useAuth();

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Only JPG, PNG, or WEBP files are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", selectedFile);

      const { data } = await axios.post("/api/ai/remove-background", formData, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      if (data.success) {
        setGeneratedImage(data.content);
      } else {
        toast.error(data.message || "Failed to generate image");
      }
    } catch (error) {
      toast.error("Failed to generate image. Please try again.");
      console.error("Error generating image:", error);
    } finally {
      setLoading(false);
      setSelectedFile(null);
      setPreview(null);
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
          <Sparkles className="w-6 text-amber-500" />
          <h1 className="text-xl font-semibold text-gray-800">
            Remove Background
          </h1>
        </div>

        <p className="mt-4 text-sm font-medium text-gray-700">
          Upload an image to remove its background
        </p>

        <div className="mt-2 border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center relative">
          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="w-full h-auto max-h-48 object-contain rounded"
            />
          ) : (
            <>
              <Upload className="w-10 h-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 mb-2">
                Drag and drop an image here, or click to browse
              </p>
              <p className="text-xs text-gray-400">
                Supports JPG, PNG, WEBP (Max 5MB)
              </p>
            </>
          )}
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        {/* Generate Image Button */}
        <button
          type="submit"
          disabled={loading || !selectedFile}
          className={`cursor-pointer mt-4 w-full py-2.5 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 hover:from-yellow-600 hover:via-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${
            !selectedFile ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Eraser className="w-5 h-5 mr-1" />
          )}
          Remove Background
        </button>
      </form>

      {/* Right side: Processed Image */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px] overflow-y-auto shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <Eraser className="w-6 text-amber-600 h-5" />
          <h1 className="text-xl font-semibold text-gray-800">
            Processed Image
          </h1>
        </div>

        {!generatedImage ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400 text-center p-4">
              <Eraser className="w-9 h-9" />
              <p>Your processed image will appear here.</p>
              <p>Upload an image and click "Remove Background" to see result.</p>
            </div>
          </div>
        ) : (
          <div>
            <img
              src={generatedImage}
              alt="processed"
              className="mt-3 w-full h-full object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RemoveBackground;
