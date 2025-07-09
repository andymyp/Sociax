import { TrendingUp, UserPlus, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "../molecules/card";
import { Button } from "../atoms/button";
import { Avatar, AvatarFallback, AvatarImage } from "../molecules/avatar";

export function SidebarRight() {
  const trends = [
    { tag: "#DesignSystem", posts: "12.5K posts" },
    { tag: "#WebDevelopment", posts: "8.2K posts" },
    { tag: "#UXDesign", posts: "6.1K posts" },
    { tag: "#React", posts: "15.3K posts" },
  ];

  return (
    <div className="space-y-4 sticky top-18">
      {/* Trends */}
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

      {/* Promoted content */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-md shadow-violet-500/5 py-0 backdrop-blur-sm">
        <CardContent className="p-4">
          <h4 className="font-semibold text-sm text-card-foreground mb-2">
            Discover new trends
          </h4>
          <p className="text-sm text-muted-foreground mb-3">
            Stay updated with the latest trending topics and join the
            conversation.
          </p>
          <Button
            size="sm"
            variant="outline"
            className="border-primary/30 text-primary hover:bg-primary/10 bg-card/50"
          >
            Explore Now
          </Button>
        </CardContent>
      </Card>

      {/* Suggest User */}
      <Card className="shadow-md shadow-violet-500/5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm gap-4">
        <CardHeader>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <Users className="w-5 h-5 mr-2 text-violet-600 dark:text-violet-400" />
            Who to follow
          </h3>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {[
              {
                name: "Emma Wilson",
                username: "@emmaw",
                avatar: "/placeholder.svg?height=40&width=40",
              },
              {
                name: "David Kim",
                username: "@davidk",
                avatar: "/placeholder.svg?height=40&width=40",
              },
              {
                name: "Lisa Zhang",
                username: "@lisaz",
                avatar: "/placeholder.svg?height=40&width=40",
              },
            ].map((user) => (
              <div
                key={user.username}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="size-10 ring-2 ring-violet-100 dark:ring-violet-900">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-r from-violet-500 to-purple-500 text-white">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                      {user.name}
                    </p>
                    <p className="text-violet-600 dark:text-violet-400 text-xs">
                      {user.username}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-violet-200 dark:border-violet-800 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/50 hover:border-violet-300 dark:hover:border-violet-700 transition-all duration-200 bg-transparent"
                >
                  <UserPlus />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
