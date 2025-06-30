
export default function AuthLayout({children}: {children: React.ReactNode}) {
  return (
    <main className="min-h-screen">
      <div className="flex w-full min-h-screen justify-center items-center">
        {children}
      </div>
    </main>
  );
}