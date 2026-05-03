import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppIcon } from "~/components/app-icon";
import { AudioVolume, Battery, Wifi } from "~/icons";
import { dockRegistry } from "~/lib/dock-registry";
import type { AllAppsState } from "~/redux/features/all-apps-slice";
import { openApp } from "~/redux/features/all-apps-slice";
import type { RootState } from "~/redux/reducers";

const Taskbar = () => {
	const dispatch = useDispatch();
	const apps = useSelector((state: RootState) => state.allApps);
	const [now, setNow] = useState(new Date());
	const [volume, setVolume] = useState(65);
	const [wifiOn, setWifiOn] = useState(true);
	const [openTray, setOpenTray] = useState<"volume" | "wifi" | null>(null);

	useEffect(() => {
		const t = setInterval(() => setNow(new Date()), 1000);
		return () => clearInterval(t);
	}, []);

	// Close popups on outside click
	const trayRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const onDown = (e: MouseEvent) => {
			if (!trayRef.current?.contains(e.target as Node)) setOpenTray(null);
		};
		document.addEventListener("mousedown", onDown);
		return () => document.removeEventListener("mousedown", onDown);
	}, []);

	const handleAppClick = (id: string) => {
		// openApp also handles restore (un-minimize + bring to front)
		dispatch(openApp(id));
	};

	const favoriteApps = apps.filter((app) => app.isFavorite);
	const runningApps = apps.filter((app) => app.isOpen && !app.isFavorite);
	const taskbarApps = [...favoriteApps, ...runningApps];

	const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	const date = now.toLocaleDateString([], {
		weekday: "long",
		month: "long",
		day: "numeric",
	});

	return (
		<div className="fixed right-0 bottom-0 left-0 z-50 px-3 pb-3 pointer-events-none">
			<div className="flex gap-3 justify-between items-center px-3 py-2 mx-auto w-full max-w-5xl text-white rounded-2xl border shadow-2xl backdrop-blur-2xl pointer-events-auto bg-black/55 border-white/10 shadow-black/40 ring-1 ring-white/5">
				{/* Activities button */}
				<div className="flex gap-2 items-center min-w-0">
					<button
						type="button"
						className="grid relative place-items-center rounded-xl shadow-lg transition-all size-11 bg-[#e95420] shadow-[#e95420]/30 hover:-translate-y-0.5 hover:bg-[#ff6a35] active:translate-y-0"
						title="Activities"
					>
						<AppIcon name="ubuntu-logo" className="size-7" />
					</button>
					<div className="hidden w-px h-8 sm:block bg-white/10" />
				</div>

				{/* App icons */}
				<div className="flex overflow-x-auto flex-1 gap-1 justify-center items-end px-1 no-scrollbar">
					{taskbarApps.map((app) => (
						<DockIconButton
							key={app.id}
							app={app}
							onClick={() => handleAppClick(app.id)}
						/>
					))}
				</div>

				{/* System tray */}
				<div ref={trayRef} className="flex relative gap-2 items-center shrink-0">
					<div className="hidden gap-1 items-center p-1 rounded-full border sm:flex border-white/10 bg-white/5">
						<TrayButton
							active={openTray === "wifi"}
							onClick={() => {
								setWifiOn((v) => !v);
								setOpenTray(null);
							}}
							title={wifiOn ? "Wi-Fi connected" : "Wi-Fi off"}
						>
							<Wifi
								className={`size-4 ${wifiOn ? "text-white" : "text-white/30"}`}
							/>
						</TrayButton>
						<TrayButton
							active={openTray === "volume"}
							onClick={() => setOpenTray(openTray === "volume" ? null : "volume")}
							title={`Volume ${volume}%`}
						>
							<AudioVolume className="size-4" />
						</TrayButton>
						<TrayButton title="Battery 87%">
							<Battery className="size-4" />
						</TrayButton>
					</div>

					{openTray === "volume" && (
						<div className="absolute right-0 bottom-full p-3 mb-2 w-56 rounded-xl border shadow-2xl backdrop-blur-2xl bg-black/80 border-white/10">
							<div className="flex justify-between mb-2 text-xs text-white/60">
								<span>Volume</span>
								<span className="font-mono">{volume}%</span>
							</div>
							<input
								type="range"
								min={0}
								max={100}
								value={volume}
								onChange={(e) => setVolume(Number(e.target.value))}
								className="w-full accent-[#e95420]"
							/>
						</div>
					)}

					<div className="hidden w-px h-8 sm:block bg-white/10" />

					<button
						type="button"
						className="px-3 py-2 font-mono text-sm text-right rounded-lg transition-colors text-white/90 tabular-nums hover:bg-white/5"
						title={date}
					>
						<div className="leading-tight">{time}</div>
						<div className="text-[10px] text-white/50 leading-tight">
							{now.toLocaleDateString([], { month: "short", day: "numeric" })}
						</div>
					</button>
				</div>
			</div>
		</div>
	);
};

// ─── Dock icon button — registers itself for the genie effect ───
const DockIconButton = ({
	app,
	onClick,
}: {
	app: AllAppsState;
	onClick: () => void;
}) => {
	const ref = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (!ref.current) return;
		dockRegistry.register(app.id, ref.current);
		return () => dockRegistry.unregister(app.id);
	}, [app.id]);

	const isActive = app.isOpen && !app.isMinimized;
	const isMinimized = app.isOpen && app.isMinimized;

	return (
		<button
			ref={ref}
			type="button"
			onClick={onClick}
			className={`
				group relative grid size-12 shrink-0 place-items-center rounded-xl transition-all duration-200
				hover:-translate-y-1.5 active:translate-y-0 active:scale-95
				${isActive ? "bg-white/10" : ""}
			`}
			title={app.title}
		>
			<AppIcon
				name={app.iconName}
				className="drop-shadow-md transition-transform size-9 group-hover:scale-110"
			/>

			{/* Running indicator dot, macOS-style */}
			{(isActive || isMinimized) && (
				<div
					className={`
						absolute -bottom-0.5 left-1/2 -translate-x-1/2 rounded-full transition-all
						${isActive ? "size-1 bg-white" : "size-1 bg-white/40"}
					`}
				/>
			)}

			{/* Tooltip */}
			<span className="absolute bottom-full left-1/2 px-2 py-1 mb-3 text-xs whitespace-nowrap rounded-md border opacity-0 transition-opacity -translate-x-1/2 pointer-events-none bg-black/90 border-white/10 text-white/90 group-hover:opacity-100">
				{app.title}
			</span>
		</button>
	);
};

const TrayButton = ({
	children,
	onClick,
	active,
	title,
}: {
	children: React.ReactNode;
	onClick?: () => void;
	active?: boolean;
	title?: string;
}) => (
	<button
		type="button"
		onClick={onClick}
		title={title}
		className={`grid place-items-center rounded-full size-7 transition-colors ${
			active ? "bg-white/15" : "hover:bg-white/10"
		}`}
	>
		{children}
	</button>
);

export { Taskbar };