import React, { useState } from "react";
import { Sparkles, Scissors } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const RemoveObject = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [objectDescription, setObjectDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);

  const { getToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    if (!objectDescription.trim()) {
      toast.error("Please enter an object to remove");
      return;
    }

    if (objectDescription.trim().split(" ").length > 1) {
      toast.error("Please enter only one object");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("object", objectDescription.trim());

      const { data } = await axios.post("/api/ai/remove-object", formData, {
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
      setPreviewUrl(null);
      setObjectDescription("");
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
          <h1 className="text-xl font-semibold text-gray-800">Remove Object</h1>
        </div>

        <p className="mt-4 text-sm font-bold text-gray-900">
          Upload an image to remove objects from it
        </p>

        {/* Upload Photo Section */}
        <div className="mt-5 mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload a photo
          </label>
          <input
            type="file"
            accept="image/*"
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
            onChange={(e) => {
              const file = e.target.files[0];
              setSelectedFile(file);
              setPreviewUrl(file ? URL.createObjectURL(file) : null);
            }}
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="mt-3 max-h-40 rounded-lg border"
            />
          )}
        </div>

        {/* Object Description */}
        <div className="mt-3">
          <label
            htmlFor="objectDescription"
            className="block text-sm font-bold text-gray-700 mb-1"
          >
            Describe what to remove (one word)
          </label>
          <textarea
            id="objectDescription"
            rows="2"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm"
            placeholder="E.g., 'person' or 'car'"
            value={objectDescription}
            onChange={(e) => setObjectDescription(e.target.value)}
          />
        </div>

        {/* Generate Image Button */}
        <button
          type="submit"
          disabled={!selectedFile || !objectDescription.trim() || loading}
          className={`cursor-pointer mt-3 w-full py-2 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${
            !selectedFile || !objectDescription.trim() || loading
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Scissors className="w-4 h-4" />
          )}
          Remove Object
        </button>
      </form>

      {/* Right side: Processed Image */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px] overflow-y-auto shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <Scissors className="w-6 text-amber-600 h-5" />
          <h1 className="text-xl font-semibold text-gray-800">
            Processed Image
          </h1>
        </div>

        {!generatedImage ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400 text-center p-4">
              <Scissors className="w-9 h-9" />
              <p>Your processed image will appear here.</p>
              <p>Upload an image and click "Remove Object" to see result.</p>
            </div>
          </div>
        ) : (
          <img
            src={generatedImage}
            alt="Processed"
            className="mt-3 w-full h-auto object-contain rounded"
          />
        )}
      </div>
    </div>
  );
};

export default RemoveObject;
