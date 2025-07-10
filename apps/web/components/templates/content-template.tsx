export default function ContentTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="col-span-1 md:col-span-8 lg:col-span-6 min-h-screen p-4 md:p-0 md:py-4 md:pr-4 lg:pr-0">
      <div className="flex flex-col gap-4 top-18">{children}</div>
    </div>
  );
}
