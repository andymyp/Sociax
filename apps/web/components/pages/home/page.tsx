import { Header } from "../../organisms/header";
import { MainContent } from "../../organisms/main-content";
import { MobileNavbar } from "../../organisms/mobile-navbar";
import { SidebarLeft } from "../../organisms/sidebar-left";
import { SidebarRight } from "../../organisms/sidebar-right";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto mb-16 md:mb-0">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-2">
          {/* Left Sidebar - Hidden on mobile, shown on md+ */}
          <div className="hidden md:block md:col-span-4 lg:col-span-3 p-4">
            <SidebarLeft />
          </div>

          {/* Main Content */}
          <div className="col-span-1 md:col-span-8 lg:col-span-6 min-h-screen p-4 md:p-0 md:py-4 md:pr-4 lg:pr-0">
            <MainContent />
          </div>

          {/* Right Sidebar - Hidden on mobile, shown on lg+ */}
          <div className="hidden lg:block lg:col-span-3 p-4">
            <SidebarRight />
          </div>
        </div>
      </div>
      <MobileNavbar />
    </div>
  );
}
