import { DesktopNavbar } from "../organisms/navbar/desktop-navbar";

export default function LeftbarTemplate({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="space-y-4 sticky top-18">
      <DesktopNavbar />
      {children}
    </div>
  );
}
