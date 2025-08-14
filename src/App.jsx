import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import DashBoard from "./pages/DashBoard";
import GenerateImage from "./pages/GenerateImage";
import BlogTitles from "./pages/BlogTitles";
import WriteArticles from "./pages/WriteArticles";
import RemoveBackground from "./pages/RemoveBackground";
import RemoveObject from "./pages/RemoveObject";
import ReviewResume from "./pages/ReviewResume";
import Community from "./pages/Community";
import {Toaster} from "react-hot-toast";
// import { useAuth } from "@clerk/clerk-react";
// import { useEffect } from "react";
const App = () => {
  // const { getToken } = useAuth();

  // useEffect(() => {
  //   getToken().then((token) => console.log("Token:", token) );
  // }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ai" element={<Layout />}>
          <Route index element={<DashBoard />} />
          <Route path="write-article" element={<WriteArticles />} />
          <Route path="blog-titles" element={<BlogTitles />} />
          <Route path="generate-images" element={<GenerateImage />} />
          <Route path="remove-background" element={<RemoveBackground />} />
          <Route path="remove-object" element={<RemoveObject />} />
          <Route path="review-resume" element={<ReviewResume />} />
          <Route path="community" element={<Community />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
