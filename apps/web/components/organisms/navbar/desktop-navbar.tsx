"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/molecules/avatar";
import { Card, CardContent } from "@/components/molecules/card";
import { LoadingSkeleton } from "@/components/molecules/loading-skeleton";
import { fallbackAvatarColor, fallbackAvatarName } from "@/lib/avatar";
import { AppState } from "@/lib/store";
import { Bell, Bookmark, Home, Mail, User, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";

export function DesktopNavbar() {
  const pathname = usePathname();
  const user = useSelector((state: AppState) => state.auth.user);

  if (!user) return <LoadingSkeleton />;

  const menuList = [
    { icon: Home, label: "Home", link: "/" },
    { icon: User, label: "Profile", link: `/profile/${user.username}` },
    { icon: Users, label: "Communities", link: "/communities" },
    { icon: Bell, label: "Notifications", link: "/notifications" },
    { icon: Mail, label: "Messages", link: "/messages" },
    { icon: Bookmark, label: "Bookmarks", link: "/bookmarks" },
  ];

  const isActive = (link: string) => {
    const pathBase = pathname.split("/")[1];
    const linkBase = link.split("/")[1];

    return pathBase === linkBase;
  };

  return (
    <Card className="shadow-md shadow-violet-500/5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm overflow-hidden py-0">
      <div className="relative h-20">
        <div className="w-full h-full bg-gradient-to-r from-primary/80 via-primary to-primary/60" />
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
          <Avatar className="w-20 h-20 border-3 border-card shadow-md">
            <AvatarImage src={user.avatar_url || undefined} alt={user.name} />
            <AvatarFallback className={fallbackAvatarColor(user.name)}>
              {fallbackAvatarName(user.name)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <CardContent className="pt-6 pb-4 px-4 text-center">
        <h3 className="font-bold text-base text-card-foreground">
          {user.name}
        </h3>
        <p className="text-muted-foreground text-sm mb-4">@{user.username}</p>

        <nav className="mt-8 flex-1 px-2 space-y-1">
          {menuList.map((item) => (
            <Link
              key={item.label}
              href={item.link}
              className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                isActive(item.link)
                  ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-950/50 hover:text-violet-600 dark:hover:text-violet-400"
              }`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 transition-transform duration-200 ${
                  isActive(item.link) ? "" : "group-hover:scale-110"
                }`}
              />
              {item.label}
            </Link>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
}
