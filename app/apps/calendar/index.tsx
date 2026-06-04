import { useEffect, useState } from "react";
import { CalendarBody } from "~/features/calendar/calendar-body";
import { CalendarProvider } from "~/features/calendar/contexts/calendar-context";
import { DndProvider } from "~/features/calendar/contexts/dnd-context";
import { CalendarHeader } from "~/features/calendar/header/calendar-header";
import type { IEvent, IUser } from "~/features/calendar/interfaces";
import { getEvents, getUsers } from "~/features/calendar/requests";

const Calendar = () => {
	const [events, setEvents] = useState<IEvent[]>([]);
	const [users, setUsers] = useState<IUser[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let isMounted = true;

		Promise.all([getEvents(), getUsers()])
			.then(([loadedEvents, loadedUsers]) => {
				if (!isMounted) return;
				setEvents(loadedEvents);
				setUsers(loadedUsers);
			})
			.finally(() => {
				if (isMounted) setIsLoading(false);
			});

		return () => {
			isMounted = false;
		};
	}, []);

	if (isLoading) {
		return (
			<div className="grid h-full min-h-0 place-items-center bg-background text-sm text-muted-foreground">
				Loading calendar...
			</div>
		);
	}

	return (
		<CalendarProvider events={events} users={users} view="month">
			<DndProvider>
				<div className="flex h-full min-h-0 w-full flex-col bg-background text-foreground">
					<div className="flex min-h-0 flex-1 flex-col overflow-hidden border-border bg-background">
						<CalendarHeader />
						<div className="min-h-0 flex-1">
							<CalendarBody />
						</div>
					</div>
				</div>
			</DndProvider>
		</CalendarProvider>
	);
};

export { Calendar };
