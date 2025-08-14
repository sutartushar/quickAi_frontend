import React, { useState } from "react";
import { Sparkles, Upload, NotebookText } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const ReviewResume = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const { getToken } = useAuth();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file)); // Preview for image/pdf display
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("resume", selectedFile);

      const { data } = await axios.post("/api/ai/review-resume", formData, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message || "Failed to generate review");
      }
    } catch (error) {
      toast.error("Failed to generate review. Please try again.");
      console.error("Error generating review:", error);
    } finally {
      setLoading(false);
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
          <Sparkles className="w-6 text-pink-500" />
          <h1 className="text-xl font-semibold text-gray-800">Review Resume</h1>
        </div>

        <p className="mt-4 text-sm font-medium text-gray-700">
          Upload resume to review and enhance its content
        </p>

        <div className="mt-2 border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center relative">
          <Upload className="w-10 h-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 mb-2">
            Drag and drop a file here, or click to browse
          </p>
          <p className="text-xs text-gray-400">
            Supports PDF, DOCX, JPG, PNG (Max 5MB)
          </p>
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept=".pdf,.doc,.docx,image/*"
            onChange={handleFileChange}
          />
        </div>

        {/* Show file name if uploaded */}
        {selectedFile && (
          <p className="mt-2 text-sm text-green-600 font-medium">
            ✅ {selectedFile.name} selected
          </p>
        )}

        {/* Show preview if image */}
        {preview && selectedFile?.type.startsWith("image/") && (
          <div className="mt-3">
            <img
              src={preview}
              alt="Preview"
              className="max-h-40 rounded-md border border-gray-200"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={!selectedFile || loading}
          className={`mt-4 cursor-pointer w-full py-2.5 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${
            !selectedFile || loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <NotebookText className="w-5 h-5 mr-1" />
          {loading ? "Processing..." : "Review Resume"}
        </button>
      </form>

      {/* Right side: Processed Output */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px] overflow-y-auto shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <NotebookText className="w-6 text-pink-600 h-5" />
          <h1 className="text-xl font-semibold text-gray-800">
            Processed Result
          </h1>
        </div>

        {/* Show content after processing */}
        {content ? (
          <div className="text-gray-700 whitespace-pre-wrap">
            <Markdown>{content}</Markdown>
          </div>
        ) : (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400 text-center p-4">
              <NotebookText className="w-9 h-9" />
              <p>Your review result will appear here.</p>
              <p>
                Upload a resume and click "Review Resume" to see the feedback.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewResume;
