import { Card, CardContent, CardHeader } from "@/components/molecules/card";
import { TrendingUp } from "lucide-react";

export function Trending() {
  const trends = [
    { tag: "#DesignSystem", posts: "12.5K posts" },
    { tag: "#WebDevelopment", posts: "8.2K posts" },
    { tag: "#UXDesign", posts: "6.1K posts" },
    { tag: "#React", posts: "15.3K posts" },
  ];

  return (
    <Card className="shadow-md shadow-violet-500/5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm gap-4">
      <CardHeader>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-violet-600 dark:text-violet-400" />
          Trending
        </h3>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1">
          {trends.map((trend, index) => (
            <div
              key={index}
              className="hover:bg-violet-50 dark:hover:bg-violet-950/50 p-2 rounded-lg cursor-pointer transition-colors"
            >
              <p className="font-medium text-violet-600 dark:text-violet-400">
                {trend.tag}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {trend.posts}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
