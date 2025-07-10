import { DesktopNavbar } from "../organisms/navbar/desktop-navbar";

export default function LeftbarTemplate({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="hidden md:block md:col-span-4 lg:col-span-3 p-4">
      <div className="space-y-4 sticky top-18">
        <DesktopNavbar />
        {children}
      </div>
    </div>
  );
}
