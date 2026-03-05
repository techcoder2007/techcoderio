import { Skeleton } from "~/components/core/skeleton";

export function WeekViewSkeleton() {
  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-8 border-b">
        <div className="w-18"></div>
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col justify-center items-center py-2"
          >
            <Skeleton className="w-10 h-6 rounded-full" />
            <Skeleton className="mt-1 w-6 h-4" />
          </div>
        ))}
      </div>

      <div className="flex overflow-y-auto flex-1">
        <div className="shrink-0 w-18">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="relative pr-2 h-12 text-right border-b">
              <Skeleton className="absolute right-2 -top-3 w-10 h-4" />
            </div>
          ))}
        </div>

        <div className="grid flex-1 grid-cols-7 divide-x">
          {Array.from({ length: 7 }).map((_, dayIndex) => (
            <div key={dayIndex} className="relative">
              {Array.from({ length: 12 }).map((_, hourIndex) => (
                <div key={hourIndex} className="h-12 border-b"></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
