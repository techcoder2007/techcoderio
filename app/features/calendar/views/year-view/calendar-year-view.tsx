import { getYear, isSameDay, isSameMonth } from "date-fns";
import { motion } from "framer-motion";
import { staggerContainer, transition } from "~/features/calendar/animations";
import { useCalendar } from "~/features/calendar/contexts/calendar-context";
import { EventListDialog } from "~/features/calendar/dialogs/events-list-dialog";
import { getCalendarCells } from "~/features/calendar/helpers";
import type { IEvent } from "~/features/calendar/interfaces";
import { EventBullet } from "~/features/calendar/views/month-view/event-bullet";
import { cn } from "~/utils/core";

interface IProps {
	singleDayEvents: IEvent[];
	multiDayEvents: IEvent[];
}

const MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function CalendarYearView({ singleDayEvents, multiDayEvents }: IProps) {
	const { selectedDate, setSelectedDate } = useCalendar();
	const currentYear = getYear(selectedDate);
	const allEvents = [...multiDayEvents, ...singleDayEvents];

	return (
		<div className="flex overflow-y-auto flex-col p-4 h-full sm:p-6">
			{/* Year grid */}
			<motion.div
				initial="initial"
				animate="animate"
				variants={staggerContainer}
				className="grid grid-cols-1 auto-rows-fr gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
			>
				{MONTHS.map((month, monthIndex) => {
					const monthDate = new Date(currentYear, monthIndex, 1);
					const cells = getCalendarCells(monthDate);

					return (
						<motion.div
							key={month}
							className="flex overflow-hidden flex-col rounded-lg border shadow-sm border-border"
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: monthIndex * 0.05, ...transition }}
							aria-label={`${month} ${currentYear} calendar`}
						>
							{/* Month header */}
							<button
								type="button"
								className="px-3 py-2 w-full text-sm font-semibold text-center bg-transparent border-none transition-colors appearance-none cursor-pointer sm:text-base hover:bg-primary/20"
								onClick={() => setSelectedDate(new Date(currentYear, monthIndex, 1))}
								aria-label={`Select ${month}`}
							>
								{month}
							</button>

							<div className="grid grid-cols-7 py-2 text-xs font-medium text-center text-muted-foreground">
								{WEEKDAYS.map((day) => (
									<div key={day} className="p-1">
										{day}
									</div>
								))}
							</div>

							<div className="grid grid-cols-7 gap-0.5 p-1.5 flex-grow text-xs">
								{cells.map((cell) => {
									const isCurrentMonth = isSameMonth(cell.date, monthDate);
									const isToday = isSameDay(cell.date, new Date());
									const dayEvents = allEvents.filter((event) =>
										isSameDay(new Date(event.startDate), cell.date),
									);
									const hasEvents = dayEvents.length > 0;

									return (
										<div
											key={cell.date.toISOString()}
											className={cn(
												"flex flex-col items-center justify-start p-1 min-h-[2rem] relative",
												!isCurrentMonth && "text-muted-foreground/40",
												hasEvents && isCurrentMonth
													? "cursor-pointer hover:bg-accent/20 hover:rounded-md"
													: "cursor-default",
											)}
										>
											{isCurrentMonth && hasEvents ? (
												<EventListDialog date={cell.date} events={dayEvents}>
													<div className="w-full h-full flex flex-col items-center justify-start gap-0.5">
														<span
															className={cn(
																"size-5 flex items-center justify-center font-medium",
																isToday && "rounded-full bg-primary text-primary-foreground",
															)}
														>
															{cell.day}
														</span>
														<div className="flex justify-center items-center gap-0.5">
															{dayEvents.length <= 2 ? (
																dayEvents
																	.slice(0, 2)
																	.map((event) => (
																		<EventBullet
																			key={event.id}
																			color={event.color}
																			className="size-1.5"
																		/>
																	))
															) : (
																<div className="flex flex-col justify-center items-center">
																	<EventBullet color={dayEvents[0].color} className="size-1.5" />
																	<span className="text-[0.6rem]">+{dayEvents.length - 1}</span>
																</div>
															)}
														</div>
													</div>
												</EventListDialog>
											) : (
												<div className="flex flex-col justify-start items-center w-full h-full">
													<span
														className={cn(
															"flex justify-center items-center font-medium size-5",
														)}
													>
														{cell.day}
													</span>
												</div>
											)}
										</div>
									);
								})}
							</div>
						</motion.div>
					);
				})}
			</motion.div>
		</div>
	);
}
