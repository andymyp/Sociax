export default function RightbarTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="space-y-4 sticky top-18">{children}</div>;
}
