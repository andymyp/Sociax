"use client";

import { Search, Bell, MessageSquare } from "lucide-react";
import Image from "next/image";
import { Input } from "../atoms/input";
import { Button } from "../atoms/button";
import { Avatar, AvatarFallback, AvatarImage } from "../molecules/avatar";
import { ModeToggle } from "../molecules/mode-toggle";
import { useSelector } from "react-redux";
import { AppState } from "@/lib/store";
import { fallbackAvatarColor, fallbackAvatarName } from "@/lib/avatar";

export const Header = () => {
  const user = useSelector((state: AppState) => state.auth.user);

  if (!user) return null;

  return (
    <header className="border-b border-border sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center justify-center gap-5">
            <Image
              src="/logo.svg"
              alt="Sociax"
              width={40}
              height={40}
              priority
            />
            <div className="relative hidden md:block w-full">
              <Input
                placeholder="#Explore"
                className="pl-10 bg-muted border-none rounded-full h-10 w-full"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="w-10 h-10 text-muted-foreground rounded-full hover:text-primary hover:bg-primary/10"
            >
              <MessageSquare className="!w-5 !h-5" />
            </Button>
            <Button
              variant="ghost"
              className="w-10 h-10 text-muted-foreground rounded-full hover:text-primary hover:bg-primary/10"
            >
              <Bell className="!w-5 !h-5" />
            </Button>
            <ModeToggle variant="ghost" className="w-10 h-10 rounded-full" />
            <Avatar className="w-10 h-10 ml-1">
              <AvatarImage src={user.avatar_url || ""} alt={user.name} />
              <AvatarFallback className={fallbackAvatarColor(user.name)}>
                {fallbackAvatarName(user.name)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
};
