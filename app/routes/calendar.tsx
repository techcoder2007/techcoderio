import { useEffect, useState } from "react";
import { CalendarBody } from "~/features/calendar/calendar-body";
import { CalendarProvider } from "~/features/calendar/contexts/calendar-context";
import { DndProvider } from "~/features/calendar/contexts/dnd-context";
import { CalendarHeader } from "~/features/calendar/header/calendar-header";
import type { IEvent, IUser } from "~/features/calendar/interfaces";
import { getEvents, getUsers } from "~/features/calendar/requests";


export default  function Calendar() {
	const [events, setEvents] = useState<IEvent[]>([]);
	const [users, setUsers] = useState<IUser[]>([]);
	useEffect(() => {
		getEvents().then(setEvents);
		getUsers().then(setUsers);
	}, []);
	return (
		<CalendarProvider events={events} users={users} view="month">
			<DndProvider>
				<div className="w-full rounded-xl border">
					<CalendarHeader />
					<CalendarBody />
				</div>
			</DndProvider>
		</CalendarProvider>
	);
}
