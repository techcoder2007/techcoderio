import { format, parseISO } from "date-fns";
import type { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/core/avatar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/core/command";
import { cn } from "~/utils/core";
import { useCalendar } from "~/features/calendar/contexts/calendar-context";
import { EventDetailsDialog } from "~/features/calendar/dialogs/event-details-dialog";
import {
  formatTime,
  getBgColor,
  getColorClass,
  getEventsForMonth,
  getFirstLetters,
  toCapitalize,
} from "~/features/calendar/helpers";
import { EventBullet } from "~/features/calendar/views/month-view/event-bullet";

export const AgendaEvents: FC = () => {
  const {
    events,
    use24HourFormat,
    badgeVariant,
    agendaModeGroupBy,
    selectedDate,
  } = useCalendar();

  const monthEvents = getEventsForMonth(events, selectedDate);

  // @ts-ignore - groupBy is not available in all TS versions
  const agendaEvents = Object.groupBy(monthEvents, (event) => {
    return agendaModeGroupBy === "date"
      ? format(parseISO(event.startDate), "yyyy-MM-dd")
      : event.color;
  });

  const groupedAndSortedEvents = Object.entries(agendaEvents).sort(
    (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime(),
  );

  return (
    <Command className="py-4 h-[80vh] bg-transparent">
      <div className="mx-4 mb-4">
        <CommandInput placeholder="Type a command or search..." />
      </div>
      <CommandList className="px-3 border-t max-h-max">
        {groupedAndSortedEvents.map(([date, groupedEvents]) => (
          <CommandGroup
            key={date}
            heading={
              agendaModeGroupBy === "date"
                ? format(parseISO(date), "EEEE, MMMM d, yyyy")
                : // @ts-ignore - groupedEvents is not null
                  toCapitalize(groupedEvents![0].color)
            }
          >
            {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion */}
            {/* @ts-ignore - groupedEvents is not null */}
            {groupedEvents!.map((event) => (
              <CommandItem
                key={event.id}
                className={cn(
                  "mb-2 p-4 border rounded-md data-[selected=true]:bg-bg transition-all data-[selected=true]:text-none hover:cursor-pointer",
                  {
                    [getColorClass(event.color)]: badgeVariant === "colored",
                    "hover:bg-zinc-200 dark:hover:bg-gray-900":
                      badgeVariant === "dot",
                    "hover:opacity-60": badgeVariant === "colored",
                  },
                )}
              >
                <EventDetailsDialog event={event}>
                  <div className="flex gap-4 justify-between items-center w-full">
                    <div className="flex gap-2 items-center">
                      {badgeVariant === "dot" ? (
                        <EventBullet color={event.color} />
                      ) : (
                        <Avatar>
                          <AvatarImage src="" alt="@shadcn" />
                          <AvatarFallback className={getBgColor(event.color)}>
                            {getFirstLetters(event.title)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex flex-col">
                        <p
                          className={cn({
                            "font-medium": badgeVariant === "dot",
                            "text-foreground": badgeVariant === "dot",
                          })}
                        >
                          {event.title}
                        </p>
                        <p className="w-1/3 text-sm text-muted-foreground line-clamp-1 text-ellipsis md:text-clip">
                          {event.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1 justify-center items-center w-40">
                      {agendaModeGroupBy === "date" ? (
                        <>
                          <p className="text-sm">
                            {formatTime(event.startDate, use24HourFormat)}
                          </p>
                          <span className="text-muted-foreground">-</span>
                          <p className="text-sm">
                            {formatTime(event.endDate, use24HourFormat)}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm">
                            {format(event.startDate, "MM/dd/yyyy")}
                          </p>
                          <span className="text-sm">at</span>
                          <p className="text-sm">
                            {formatTime(event.startDate, use24HourFormat)}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </EventDetailsDialog>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
        <CommandEmpty>No results found.</CommandEmpty>
      </CommandList>
    </Command>
  );
};
