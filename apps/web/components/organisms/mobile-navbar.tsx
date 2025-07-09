import { Bookmark, Home, Plus, Search, Users } from "lucide-react";

export function MobileNavbar() {
  const menuList = [
    { icon: Home, active: true },
    { icon: Search },
    { icon: Plus },
    { icon: Bookmark },
    { icon: Users },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl transition-colors duration-300">
      <div className="flex justify-around py-2">
        {menuList.map((item, index) => (
          <button
            key={index}
            className={`p-3 rounded-xl transition-all duration-200 ${
              item.active
                ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/25"
                : "text-gray-600 dark:text-gray-400 hover:bg-violet-50 dark:hover:bg-violet-950/50 hover:text-violet-600 dark:hover:text-violet-400"
            }`}
          >
            <item.icon className="w-6 h-6" />
          </button>
        ))}
      </div>
    </div>
  );
}
