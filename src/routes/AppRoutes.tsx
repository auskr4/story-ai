import { Layout } from "@/components/Layout";
import CreateStory from "@/pages/CreateStory";
import { Home } from "@/pages/Home";
import StoryPreview from "@/pages/StoryPreview";
import { Route, Routes } from "react-router";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/create-story" element={<CreateStory />} />
        <Route path="/story-preview" element={<StoryPreview />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Route>
    </Routes>
  );
};