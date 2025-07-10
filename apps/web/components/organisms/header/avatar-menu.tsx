"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/molecules/avatar";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/components/molecules/dropdown-menu";
import { useSignOut } from "@/hooks/auth/use-sign-out";
import { fallbackAvatarColor, fallbackAvatarName } from "@/lib/avatar";
import { AppState } from "@/lib/store";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";
import { useSelector } from "react-redux";

export function AvatarMenu() {
  const user = useSelector((state: AppState) => state.auth.user);

  const { mutateAsync: signOut } = useSignOut();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="w-10 h-10 ml-1">
          <AvatarImage src={user.avatar_url || undefined} alt={user.name} />
          <AvatarFallback className={fallbackAvatarColor(user.name)}>
            {fallbackAvatarName(user.name)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44" align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>
              <User />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>
              <Settings />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={async () => await signOut({ body: {} })}>
          Sign out
          <DropdownMenuShortcut>
            <LogOut />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
