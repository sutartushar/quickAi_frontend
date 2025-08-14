import React from "react";
import { PricingTable } from "@clerk/clerk-react";

const Subscription = () => {
  return (
    <div className="px-4 sm:px-20 xl:px-32 my-24">
    <div className="text-center">
      <h2 className="text-slate-700 text-[42px] font-semibold">
      Choose Your Plan
      </h2>
      <p className="text-gray-500 max-w-lg mx-auto">
      Start for free and scale up as you grow. Find the perfect plan for your content creation needs.
      </p>
    </div>
    <div className="mt-14 max-sm:mx-8 max-w-4/6 mx-auto">
        <PricingTable/>
    </div>
  </div>
  );
};

export default Subscription;
