import { Skeleton } from "~/components/core/skeleton";

export function MonthViewSkeleton() {
  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-7 py-2 border-b">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex justify-center">
            <Skeleton className="w-12 h-6" />
          </div>
        ))}
      </div>

      <div className="grid flex-1 grid-cols-7 grid-rows-6">
        {Array.from({ length: 42 }).map((_, i) => (
          <div key={i} className="p-1 border-r border-b">
            <Skeleton className="mb-1 w-6 h-6 rounded-full" />
            <div className="mt-1 space-y-1">
              {Array.from({ length: Math.floor(Math.random() * 3) }).map(
                (_, j) => (
                  <Skeleton key={j} className="w-full h-5" />
                ),
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
