import { Skeleton } from "~/components/core/skeleton";

export function DayViewSkeleton() {
  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-2 border-b">
        <div className="w-18"></div>
        <div className="flex flex-col justify-center items-center py-2">
          <Skeleton className="w-24 h-6 rounded-full" />
          <Skeleton className="mt-1 w-16 h-4" />
        </div>
      </div>

      <div className="flex overflow-y-auto flex-1">
        <div className="w-18 shrink-0">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="relative pr-2 h-12 text-right border-b">
              <Skeleton className="absolute right-2 -top-3 w-10 h-4" />
            </div>
          ))}
        </div>

        <div className="flex-1">
          <div className="relative">
            {Array.from({ length: 12 }).map((_, hourIndex) => (
              <div key={hourIndex} className="h-12 border-b"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
