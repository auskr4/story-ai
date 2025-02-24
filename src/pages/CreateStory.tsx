import { useState } from "react";
import PromptWheel from "@/components/PromptWheel";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { genrePrompts } from "@/components/PromptWheel";
import createStoryBackground from "@/images/create-story-bg.jpg";

const genres = ["Adventure", "Sci-Fi", "Mystery", "Fairy Tale"] as const;
type Genre = keyof typeof genrePrompts;

export default function CreateStory() {
  const [selectedGenre, setSelectedGenre] = useState<Genre>("Sci-Fi");

  return (
    <div className="min-h-screen">
      {/* Fixed top toolbar */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
          <div className="flex space-x-2">
            {genres.map((genre) => (
              <Button
                key={genre}
                onClick={() => setSelectedGenre(genre as Genre)}
                variant={selectedGenre === genre ? "default" : "outline"}
                className="rounded-full"
              >
                {genre}
              </Button>
            ))}
          </div>
          <Button className="rounded-full">
            <ArrowRight className="mr-2 h-4 w-4" /> Generate Story
          </Button>
        </div>
      </div>

      {/* Main content with padding to account for fixed header */}
      <div className="pt-16">
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-screen">
            <img
              src={createStoryBackground}
              alt="Hero background"
              className="object-cover w-full h-full object-center"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
            {/* still playing with the gradients here */}
            {/* <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-transparent" /> */}
            {/* <div className="absolute inset-0 bg-gradient-to-l from-white via-transparent to-transparent" /> */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent" />
          </div>
        </div>
        <PromptWheel genre={selectedGenre} />
      </div>
    </div>
  );
}
