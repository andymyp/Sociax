import { Header } from "../organisms/header/header";
import { MobileNavbar } from "../organisms/navbar/mobile-navbar";

export default function MainTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto mb-16 md:mb-0">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-2">
          {children}
        </div>
      </div>
      <MobileNavbar />
    </div>
  );
}
