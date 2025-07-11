export default function ContentTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex flex-col gap-4 top-18">{children}</div>;
}
