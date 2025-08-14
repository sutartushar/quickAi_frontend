import React, { useEffect, useState } from "react";
import { Gem, Sparkles } from "lucide-react";
import { Protect, useAuth } from "@clerk/clerk-react";
import CreationItems from "../components/CreationItems";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const DashBoard = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);

  const { getToken } = useAuth();

  const getDashboardData = async () => {
    try {
      const { data } = await axios.get(
        "/api/user/creations",
        {
          // : The headers object is passed as the second argument
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

 
      if (data.success) {
        setCreations(data.creations); 
      } else {
        toast.error(data.message || "Failed to fetch creations");
      }
    } catch (error) {
      toast.error("Failed to fetch generated data. Please try again.");
      console.error("Error failed to fetch generated data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <div className="h-full overflow-y-scroll p-6">
      <div className="flex justify-start gap-4 flex-wrap">
        {/* Total creation card */}
        <div className="flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200">
          <div className="text-slate-600">
            <p className="text-sm">Total Creation</p>
            <h2 className="text-xl font-semibold">{creations.length}</h2>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588f2] to-[#0bb0d7] text-white flex justify-center items-center">
            <Sparkles className="w-5 text-white" />
          </div>
        </div>
        {/* active plan */}
        <div className="flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200">
          <div className="text-slate-600">
            <p className="text-sm">Total Creation</p>
            <h2 className="text-xl font-semibold">
              <Protect plan="premium" fallback="free">
                Premium
              </Protect>
            </h2>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ff61c5] to-[#9e53ee] text-white flex justify-center items-center">
            <Gem className="w-5 text-white" />
          </div>
        </div>
      </div>

      {loading ? (
        <p className="mt-6">Loading creations...</p>
      ) : (
        <div className="space-y-3">
          <p className="mt-6 mb-4">Recent creations</p>
          {creations.length > 0 ? (
            creations.map((item) => (
              <CreationItems key={item.id} items={item} />
            ))
          ) : (
            <p className="text-gray-500">You don't have any recent creations.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DashBoard;