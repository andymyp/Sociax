import { Skeleton } from "../atoms/skeleton";

export function LoadingSkeleton() {
  return (
    <Skeleton className="w-full h-screen shadow-md shadow-violet-500/5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm" />
  );
}
