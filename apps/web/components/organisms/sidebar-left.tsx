import { Bell, Bookmark, Home, Mail, User, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../molecules/avatar";
import { Card, CardContent } from "../molecules/card";
import Link from "next/link";

export function SidebarLeft() {
  const menuList = [
    { icon: Home, label: "Home", active: true },
    { icon: User, label: "Profile" },
    { icon: Users, label: "Communities" },
    { icon: Bell, label: "Notifications" },
    { icon: Mail, label: "Messages" },
    { icon: Bookmark, label: "Bookmarks" },
  ];

  return (
    <div className="space-y-4 sticky top-18">
      {/* Profile Card */}
      <Card className="shadow-md shadow-violet-500/5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm overflow-hidden py-0">
        <div className="relative h-20">
          <div className="w-full h-full bg-gradient-to-r from-primary/80 via-primary to-primary/60" />
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
            <Avatar className="w-20 h-20 border-3 border-card shadow-md">
              <AvatarImage
                src="/placeholder.svg?height=48&width=48"
                alt="Zendaya MJ"
              />
              <AvatarFallback className="bg-primary text-primary-foreground">
                ZM
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <CardContent className="pt-6 pb-4 px-4 text-center">
          <h3 className="font-bold text-base text-card-foreground">
            Zendaya MJ
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            Senior UI/UX Designer
          </p>

          <nav className="mt-8 flex-1 px-2 space-y-1">
            {menuList.map((item) => (
              <Link
                key={item.label}
                href="#"
                className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  item.active
                    ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-950/50 hover:text-violet-600 dark:hover:text-violet-400"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 transition-transform duration-200 ${
                    item.active ? "" : "group-hover:scale-110"
                  }`}
                />
                {item.label}
              </Link>
            ))}
          </nav>
        </CardContent>
      </Card>
    </div>
  );
}
