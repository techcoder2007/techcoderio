import { Bell, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Calendar } from "../core/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../core/popover";
import { Switch } from "../core/switch";

export function Clock() {
	const [time, setTime] = useState(new Date());
	const [date, setDate] = useState(new Date());
	const [distrubution, setDistrubution] = useState<boolean>(false);

	const [notifications, setNotifications] = useState([
		{
			id: "1",
			title: "System Update",
			message: "Your system is up to date.",
			timestamp: new Date(),
			read: false,
		},
	]);

	useEffect(() => {
		const id = setInterval(() => setTime(new Date()), 10000);
		return () => clearInterval(id);
	}, []);

	const dismiss = (id: string) => {
		setNotifications((prev) => prev.filter((n) => n.id !== id));
	};

	const markAsRead = (id: string) => {
		setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
	};

	const formatTime = (date: Date) => {
		const diff = Date.now() - date.getTime();
		const mins = Math.floor(diff / 60000);
		if (mins < 1) return "just now";
		if (mins < 60) return `${mins}m ago`;
		return `${Math.floor(mins / 60)}h ago`;
	};

	const timeAMPM = time.toLocaleString("en-US", {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});

	const fullDate = time.toLocaleDateString("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
	});

	return (
		<Popover>
			<PopoverTrigger asChild>
				<div className="text-sm font-medium cursor-pointer select-none">
					{timeAMPM}
				</div>
			</PopoverTrigger>

			<PopoverContent align="center" side="bottom" className="w-3xl p-0 mt-2 border border-border rounded-lg shadow-xl overflow-hidden bg-background">
				<div className="px-4 py-2 border-b border-border text-sm font-semibold bg-muted/40">
					Notifications
				</div>

				<div className="flex w-full">
					<div className="divide-y divide-border w-full flex flex-col justify-between">
						{notifications.length === 0 ? (
							<div className="p-6 w-full text-center text-muted-foreground text-sm flex items-center justify-center flex-col h-full">
								<Bell className="w-6 h-6 mx-auto mb-2 opacity-60" />
								No notifications
							</div>
						) : (
							<div className="max-h-72 overflow-y-auto">
								{notifications.map((n) => (
									<div
										key={n.id}
										className={`p-3 flex items-start gap-3 cursor-pointer transition-colors ${n.read ? "hover:bg-muted/40" : "bg-accent/10 hover:bg-accent/20"
											}`}
										onClick={() => markAsRead(n.id)}
									>
										<div className="flex-1 min-w-0">
											<p className="font-medium text-sm truncate flex items-center gap-2">
												{n.title}
												{!n.read && <span className="w-2 h-2 rounded-full bg-primary" />}
											</p>
											<p className="text-sm text-muted-foreground line-clamp-2">{n.message}</p>
											<p className="text-xs text-muted-foreground mt-1">{formatTime(n.timestamp)}</p>
										</div>

										<button
											onClick={(e) => {
												e.stopPropagation();
												dismiss(n.id);
											}}
											type="button"
											className="text-muted-foreground hover:text-foreground"
										>
											<X className="w-4 h-4" />
										</button>
									</div>
								))}
							</div>
						)}


						<div className="border-t border-border p-4 flex items-center gap-3 bg-muted/30">
							<button
								onClick={() => setDistrubution(!distrubution)}
								type="button"
								className="flex items-center gap-2 text-sm font-medium hover:opacity-80 transition"
							>
								<Switch className="data-[state=checked]:bg-green-500" checked={distrubution} onCheckedChange={setDistrubution} />
								{distrubution ? "🔕 Do Not Disturb On" : "🔔 Do Not Disturb Off"}
							</button>
						</div>
					</div>

					<div className="border-l border-border p-4 space-y-3 bg-muted/20 w-4/5">
						<div>
							<p className="text-sm font-medium">{fullDate}</p>
						</div>
						<div className="border border-border rounded-md p-2 bg-background">
							<Calendar mode="single" selected={date} onSelect={(selected) => setDate(selected as Date)} className="w-full" />
						</div>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}