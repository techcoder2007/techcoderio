import { Calendar as CalendarApp } from "~/apps/calendar";

export function meta() {
	return [
		{ title: "Calendar | TechCoder.io" },
		{ name: "description", content: "Calendar application" },
	];
}

export default function CalendarRoute() {
	return (
		<main className="h-dvh w-dvw overflow-hidden bg-background">
			<CalendarApp />
		</main>
	);
}
