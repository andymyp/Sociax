export default function RightbarTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="hidden lg:block lg:col-span-3 p-4">
      <div className="space-y-4 sticky top-18">{children}</div>
    </div>
  );
}
