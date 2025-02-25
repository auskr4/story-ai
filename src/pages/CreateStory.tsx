import { useState } from "react";
import PromptWheel from "@/components/PromptWheel";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader } from "lucide-react";
import { genrePrompts } from "@/components/PromptWheel";
import createStoryBackground from "@/images/create-story-bg.jpg";
import { StoryService } from "@/lib/api";
import { SciFiPromptAnswers } from "@/lib/templates";

const genres = ["Adventure", "Sci-Fi", "Mystery", "Fairy Tale"] as const;
type Genre = keyof typeof genrePrompts;

export default function CreateStory() {
  const [selectedGenre, setSelectedGenre] = useState<Genre>("Sci-Fi");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<{ title: string; content: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnswersUpdate = (updatedAnswers: Record<string, string>) => {
    setAnswers(updatedAnswers);
  };

  const promptsForGenre = genrePrompts[selectedGenre] || [];
  const isAllPromptsAnswered = promptsForGenre.every(prompt => 
    answers[prompt.id] && answers[prompt.id].trim().length > 0
  );

  const handleGenerateStory = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      
      // Only handle Sci-Fi for now, as per the requirements
      if (selectedGenre === "Sci-Fi") {
        const sciFiAnswers: SciFiPromptAnswers = {
          setting: answers.setting || "",
          ability: answers.ability || "",
          discovery: answers.discovery || "",
          fear: answers.fear || "",
          characterName: answers.characterName || "",
          characterDetails: answers.characterDetails || "",
        };
        
        const result = await StoryService.generateSciFiStory(sciFiAnswers);
        
        setGeneratedStory({
          title: result.title || "Untitled SciFi Story",
          content: result.story,
        });
      } else {
        // For future implementation of other genres
        setError("Only Sci-Fi genre is currently supported.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate story.");
      console.error("Story generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReturnToPrompts = () => {
    setGeneratedStory(null);
  };

  // Display the generated story if available
  if (generatedStory) {
    return (
      <div className="min-h-screen pt-16 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6 md:p-8">
              <Button 
                variant="outline" 
                onClick={handleReturnToPrompts}
                className="mb-4"
              >
                ← Back to Prompts
              </Button>
              
              <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-indigo-900">
                {generatedStory.title}
              </h1>
              
              <div className="prose prose-indigo max-w-none">
                {generatedStory.content.split('\n').map((paragraph, idx) => {
                  // Skip the title which is already displayed above
                  if (idx === 0 && paragraph.trim() === generatedStory.title) {
                    return null;
                  }
                  return paragraph.trim() ? (
                    <p key={idx} className="mb-4">{paragraph}</p>
                  ) : (
                    <br key={idx} />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <Button 
            className="rounded-full"
            onClick={handleGenerateStory}
            disabled={!isAllPromptsAnswered || isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" /> Generating...
              </>
            ) : (
              <>
                <ArrowRight className="mr-2 h-4 w-4" /> Generate Story
              </>
            )}
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
        
        {error && (
          <div className="max-w-4xl mx-auto px-4 py-2 mt-4">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>{error}</p>
            </div>
          </div>
        )}
        
        <PromptWheel 
          genre={selectedGenre} 
          onAnswersUpdate={handleAnswersUpdate}
        />
      </div>
    </div>
  );
}
