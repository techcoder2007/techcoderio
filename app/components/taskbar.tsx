import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppIcon } from "~/components/app-icon";
import { AudioVolume, Battery, Wifi } from "~/icons";
import { dockRegistry } from "~/lib/dock-registry";
import type { AllAppsState } from "~/redux/features/all-apps-slice";
import {
	closeApp,
	maximizeApp,
	minimizeApp,
	openApp,
	spawnApp,
	toggleFavorite,
} from "~/redux/features/all-apps-slice";
import type { RootState } from "~/redux/reducers";

// ─── Context menu state type ──────────────────────────────────────────────────
interface CtxMenuState {
	app: AllAppsState;
	x: number;
	y: number;
}

const Taskbar = () => {
	const dispatch = useDispatch();
	const apps = useSelector((state: RootState) => state.allApps);
	const [now, setNow] = useState(new Date());
	const [volume, setVolume] = useState(65);
	const [wifiOn, setWifiOn] = useState(true);
	const [openTray, setOpenTray] = useState<"volume" | "wifi" | null>(null);
	const [ctxMenu, setCtxMenu] = useState<CtxMenuState | null>(null);

	useEffect(() => {
		const t = setInterval(() => setNow(new Date()), 1000);
		return () => clearInterval(t);
	}, []);

	// Close tray popups on outside click
	const trayRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const onDown = (e: MouseEvent) => {
			if (!trayRef.current?.contains(e.target as Node)) setOpenTray(null);
		};
		document.addEventListener("mousedown", onDown);
		return () => document.removeEventListener("mousedown", onDown);
	}, []);

	// Close context menu on outside click / scroll
	useEffect(() => {
		if (!ctxMenu) return;
		const close = () => setCtxMenu(null);
		document.addEventListener("mousedown", close);
		document.addEventListener("scroll", close, true);
		return () => {
			document.removeEventListener("mousedown", close);
			document.removeEventListener("scroll", close, true);
		};
	}, [ctxMenu]);

	const handleAppClick = (id: string) => {
		dispatch(openApp(id));
	};

	const handleContextMenu = (app: AllAppsState, clientX: number, clientY: number) => {
		setCtxMenu({ app, x: clientX, y: clientY });
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
		<>
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
								onContextMenu={handleContextMenu}
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

			{/* Dock context menu portal */}
			{ctxMenu && (
				<DockContextMenu
					app={ctxMenu.app}
					x={ctxMenu.x}
					y={ctxMenu.y}
					onClose={() => setCtxMenu(null)}
				/>
			)}
		</>
	);
};

// ─── Dock icon button — registers itself for the genie effect ─────────────────
const DockIconButton = ({
	app,
	onClick,
	onContextMenu,
}: {
	app: AllAppsState;
	onClick: () => void;
	onContextMenu: (app: AllAppsState, x: number, y: number) => void;
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
			onContextMenu={(e) => {
				e.preventDefault();
				onContextMenu(app, e.clientX, e.clientY);
			}}
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

			{/* Running indicator dot */}
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

// ─── Dock context menu ─────────────────────────────────────────────────────────
const DockContextMenu = ({
	app,
	x,
	y,
	onClose,
}: {
	app: AllAppsState;
	x: number;
	y: number;
	onClose: () => void;
}) => {
	const dispatch = useDispatch();

	const MENU_HEIGHT = 300;
	const MENU_WIDTH = 200;
	const top = Math.max(8, y - MENU_HEIGHT - 8);
	const left = Math.min(x, window.innerWidth - MENU_WIDTH - 8);

	const isOpen = app.isOpen;
	const isMinimized = app.isOpen && app.isMinimized;
	const isMaximized = app.maximized;

	const act = (fn: () => void) => {
		fn();
		onClose();
	};

	return createPortal(
		<div
			style={{ top, left, width: MENU_WIDTH }}
			className="fixed z-[9999] overflow-hidden rounded-xl border border-white/12 bg-black/85 shadow-2xl shadow-black/60 backdrop-blur-2xl"
			onMouseDown={(e) => e.stopPropagation()}
		>
			{/* App header */}
			<div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-white/8">
				<AppIcon name={app.iconName} className="size-6 shrink-0" />
				<span className="text-xs font-semibold text-white/90 truncate">{app.title}</span>
			</div>

			<div className="py-1">
				{/* Open */}
				{!isOpen && (
					<MenuItem
						label="Open"
						onClick={() => act(() => dispatch(openApp(app.id)))}
					/>
				)}

				{/* Restore from minimized */}
				{isMinimized && (
					<MenuItem
						label="Restore"
						onClick={() => act(() => dispatch(openApp(app.id)))}
					/>
				)}

				{/* Window controls — only when visible */}
				{isOpen && !isMinimized && (
					<>
						<MenuItem
							label="Minimize"
							onClick={() => act(() => dispatch(minimizeApp(app.id)))}
						/>
						<MenuItem
							label={isMaximized ? "Restore" : "Maximize"}
							onClick={() => act(() => dispatch(maximizeApp(app.id)))}
						/>
					</>
				)}

				{/* App-specific: Chrome New Window */}
				{app.canSpawn && isOpen && (
					<>
						<MenuSeparator />
						<MenuItem
							label="New Window"
							onClick={() => act(() => dispatch(spawnApp(app.id)))}
						/>
					</>
				)}

				{/* Close / Force Quit */}
				{isOpen && (
					<>
						<MenuSeparator />
						<MenuItem
							label="Close"
							onClick={() => act(() => dispatch(closeApp(app.id)))}
						/>
						<MenuItem
							label="Force Quit"
							danger
							onClick={() => act(() => dispatch(closeApp(app.id)))}
						/>
					</>
				)}

				<MenuSeparator />

				{/* Pin / Unpin from dock */}
				<MenuItem
					label={app.isFavorite ? "Unpin from Dock" : "Pin to Dock"}
					onClick={() => act(() => dispatch(toggleFavorite(app.id)))}
				/>
			</div>
		</div>,
		document.body,
	);
};

// ─── Menu primitives ──────────────────────────────────────────────────────────
const MenuItem = ({
	label,
	onClick,
	danger = false,
}: {
	label: string;
	onClick: () => void;
	danger?: boolean;
}) => (
	<button
		type="button"
		onClick={onClick}
		className={`w-full px-3 py-1.5 text-left text-sm transition-colors ${
			danger
				? "text-red-400 hover:bg-red-500/15 hover:text-red-300"
				: "text-white/85 hover:bg-white/10 hover:text-white"
		}`}
	>
		{label}
	</button>
);

const MenuSeparator = () => <div className="my-1 h-px bg-white/8" />;

// ─── Tray button ──────────────────────────────────────────────────────────────
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
