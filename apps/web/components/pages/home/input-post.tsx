import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Textarea } from "@/components/atoms/textarea";
import { Card, CardContent } from "@/components/molecules/card";
import { Camera, Film, LocationEdit, Vote } from "lucide-react";

export function InputPost() {
  return (
    <Card className="hidden md:block shadow-md shadow-violet-500/5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm py-0">
      <CardContent className="p-6">
        <div className="flex-1">
          <Textarea
            placeholder="What's on your mind?"
            className="resize-none bg-white/80 dark:bg-gray-800/80"
            rows={3}
          />
          <div className="flex justify-between items-center mt-4">
            <div className="flex space-x-2">
              <Badge
                variant="secondary"
                className="bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 hover:bg-violet-200 dark:hover:bg-violet-900 cursor-pointer transition-colors"
              >
                <Camera className="mr-0.5" />
                Photo
              </Badge>
              <Badge
                variant="secondary"
                className="bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 hover:bg-violet-200 dark:hover:bg-violet-900 cursor-pointer transition-colors"
              >
                <Film className="mr-0.5" />
                Video
              </Badge>
              <Badge
                variant="secondary"
                className="bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 hover:bg-violet-200 dark:hover:bg-violet-900 cursor-pointer transition-colors"
              >
                <LocationEdit className="mr-0.5" />
                Location
              </Badge>
              <Badge
                variant="secondary"
                className="bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 hover:bg-violet-200 dark:hover:bg-violet-900 cursor-pointer transition-colors"
              >
                <Vote className="mr-0.5" />
                Poll
              </Badge>
            </div>
            <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed">
              Post
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
