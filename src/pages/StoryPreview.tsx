import { useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONFIG, TEST_STORY } from "@/lib/config";

interface StoryPreviewLocation {
  state: {
    title: string;
    content: string;
  };
}

export default function StoryPreview() {
  const navigate = useNavigate();
  const location = useLocation() as StoryPreviewLocation;
  
  // Use test data if in test mode and no state is provided
  const useTestData = CONFIG.testMode && (!location.state || !location.state.title || !location.state.content);
  
  // If not in test mode and no state is provided, show the "Story not found" message
  if (!useTestData && (!location.state || !location.state.title || !location.state.content)) {
    return (
      <div className="min-h-screen pt-16 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Story not found</h1>
          <p className="mb-6">Please create a story first.</p>
          <Button onClick={() => navigate("/create-story")}>
            Create a Story
          </Button>
        </div>
      </div>
    );
  }

  // Use either real data from location state or test data
  const { title, content } = useTestData ? TEST_STORY : location.state;
  const contentParagraphs = content.split('\n');
  
  // Show only about 60% of the content as preview (minimum 3 paragraphs)
  const previewLength = Math.max(3, Math.floor(contentParagraphs.length * 0.3));
  const previewParagraphs = contentParagraphs.slice(0, previewLength);

  const handleBackToPrompts = () => {
    navigate("/create-story");
  };

  return (
    <div className="min-h-screen pt-16 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <Button 
              variant="outline" 
              onClick={handleBackToPrompts}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Prompts
            </Button>
            
            {/* Show test mode indicator if using test data */}
            {useTestData && (
              <div className="mb-4 px-4 py-2 bg-amber-100 text-amber-800 rounded-md text-sm font-medium inline-block">
                Test Mode Enabled
              </div>
            )}
            
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-indigo-900">
              {title}
            </h1>
            
            <div className="prose prose-indigo max-w-none">
              {/* Display the preview paragraphs */}
              {previewParagraphs.map((paragraph, idx) => {
                // Skip the title which is already displayed above
                if (idx === 0 && paragraph.trim() === title) {
                  return null;
                }
                return paragraph.trim() ? (
                  <p key={idx} className="mb-4">{paragraph}</p>
                ) : (
                  <br key={idx} />
                );
              })}
              
              {/* Show a few lines from the remaining content that will fade out */}
              <div className="relative">
                {contentParagraphs.slice(previewLength, previewLength + 4).map((paragraph, idx) => (
                  paragraph.trim() ? (
                    <p key={`fade-${idx}`} className="mb-4">{paragraph}</p>
                  ) : (
                    <br key={`fade-${idx}`} />
                  )
                ))}
                
                {/* Fade-out effect container that overlaps the text */}
                <div className="absolute inset-0 top-[-180px] bg-gradient-to-b from-transparent via-white/50 to-white pointer-events-none" />
                
                <div className="text-center py-12 relative z-10 mt-4">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="bg-indigo-100 p-3 rounded-full">
                      <Lock className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-bold text-indigo-900">Continue Reading</h3>
                    <p className="text-indigo-700 max-w-md">
                      Unlock the full story to find out what happens next
                    </p>
                    <Button 
                      className="mt-4 px-8 py-6 text-lg rounded-full bg-gradient-to-r from-indigo-700 to-indigo-400 
                        shadow-lg hover:shadow-xl transition-all text-white hover:scale-105"
                    >
                      Unlock full story for $2.99
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 