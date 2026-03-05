import { useEffect, useState } from "react";
import { useCalendar } from "~/features/calendar/contexts/calendar-context";
import { formatTime } from "~/features/calendar/helpers";

export function CalendarTimeline() {
  const { use24HourFormat } = useCalendar();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  const getCurrentTimePosition = () => {
    const minutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    return (minutes / 1440) * 100;
  };

  const formatCurrentTime = () => {
    return formatTime(currentTime, use24HourFormat);
  };

  return (
    <div
      className="absolute inset-x-0 z-50 border-t pointer-events-none border-primary"
      style={{ top: `${getCurrentTimePosition()}%` }}
    >
      <div className="absolute -left-1.5 -top-1.5 size-3 rounded-full bg-primary"></div>

      <div className="flex absolute justify-end pr-1 w-16 text-xs font-medium -translate-y-1/2 -left-18 bg-background text-primary">
        {formatCurrentTime()}
      </div>
    </div>
  );
}
