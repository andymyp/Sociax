import Image from "next/image";
import { Badge } from "../atoms/badge";
import { Button } from "../atoms/button";
import { Textarea } from "../atoms/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../molecules/avatar";
import { Card, CardContent, CardHeader } from "../molecules/card";
import {
  Bookmark,
  Camera,
  Film,
  Heart,
  LocationEdit,
  MessageCircle,
  Share,
  Vote,
} from "lucide-react";

export function MainContent() {
  const posts = [
    {
      id: 1,
      user: {
        name: "Sarah Chen",
        username: "@sarahc",
        avatar:
          "https://preview-nextjs-social-media-app-kzmjjfconbiq9qc43cd4.vusercontent.net/placeholder.svg?height=40&width=40",
      },
      content:
        "Just launched my new design system! 🎨 It's been months of work but so worth it. The consistency across our products is amazing now.",
      image:
        "https://preview-nextjs-social-media-app-kzmjjfconbiq9qc43cd4.vusercontent.net/placeholder.svg?height=300&width=500",
      likes: 124,
      comments: 18,
      shares: 7,
      time: "2h",
      liked: false,
      bookmarked: false,
    },
    {
      id: 2,
      user: {
        name: "Alex Rivera",
        username: "@alexr",
        avatar:
          "https://preview-nextjs-social-media-app-kzmjjfconbiq9qc43cd4.vusercontent.net/placeholder.svg?height=40&width=40",
      },
      content:
        "Beautiful sunset from my office window today. Sometimes you need to pause and appreciate the little moments ✨",
      likes: 89,
      comments: 12,
      shares: 3,
      time: "4h",
      liked: true,
      bookmarked: false,
    },
    {
      id: 3,
      user: {
        name: "Maya Patel",
        username: "@mayap",
        avatar:
          "https://preview-nextjs-social-media-app-kzmjjfconbiq9qc43cd4.vusercontent.net/placeholder.svg?height=40&width=40",
      },
      content:
        "Excited to share that our team just hit 1M users! 🚀 Thank you to everyone who believed in our vision from day one.",
      likes: 256,
      comments: 45,
      shares: 23,
      time: "6h",
      liked: false,
      bookmarked: true,
    },
  ];

  return (
    <div className="flex flex-col gap-4 top-18">
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

      {posts.map((post) => (
        <Card
          key={post.id}
          className="shadow-md shadow-violet-500/5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm gap-3 pt-6 pb-4"
        >
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Avatar className="size-12 ring-2 ring-violet-100 dark:ring-violet-900">
                <AvatarImage src={post.user.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-gradient-to-r from-violet-500 to-purple-500 text-white">
                  {post.user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {post.user.name}
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-violet-600 dark:text-violet-400 text-sm">
                    {post.user.username}
                  </span>
                  <span className="text-gray-400 dark:text-gray-500">•</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {post.time}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-gray-800 dark:text-gray-200 mb-4 leading-relaxed">
              {post.content}
            </p>
            {post.image && (
              <div className="mb-4 rounded-xl overflow-hidden">
                <Image
                  src={
                    post.image ||
                    "https://preview-nextjs-social-media-app-kzmjjfconbiq9qc43cd4.vusercontent.net/placeholder.svg?height=300&width=500"
                  }
                  alt="Post content"
                  width={256}
                  height={256}
                  className="w-full h-64 object-cover"
                />
              </div>
            )}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center space-x-6">
                <button
                  className={`flex items-center space-x-1 ${
                    post.liked
                      ? "text-red-500"
                      : "text-gray-500 dark:text-gray-400 hover:text-red-500"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${post.liked ? "fill-current" : ""}`}
                  />
                  <span className="text-sm font-medium">{post.likes}</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{post.comments}</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400">
                  <Share className="w-5 h-5" />
                  <span className="text-sm font-medium">{post.shares}</span>
                </button>
              </div>
              <button
                className={`${
                  post.bookmarked
                    ? "text-violet-600 dark:text-violet-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400"
                }`}
              >
                <Bookmark
                  className={`w-[22px] h-[22px] ${
                    post.bookmarked ? "fill-current" : ""
                  }`}
                />
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
