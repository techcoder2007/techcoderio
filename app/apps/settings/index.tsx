import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setImage } from "~/redux/features/background-image-slice";
import { setBrightnessLevel, setSoundLevel } from "~/redux/features/status-slice";
import type { RootState } from "~/redux/reducers";

import wallBlueLock from "~/assets/images/wp15944176-blue-lock-8k-pc-wallpapers.jpg";
import wallWindowsDark from "~/assets/images/windows-dark.jpg";
import wallWindowsLight from "~/assets/images/windows-light.jpg";

const WALLPAPERS = [
	{ label: "Windows Dark", src: wallWindowsDark },
	{ label: "Windows Light", src: wallWindowsLight },
	{ label: "Blue Lock", src: wallBlueLock },
];

type Section = "appearance" | "sound" | "displays" | "network" | "about";

// ─── Sidebar SVG icons ────────────────────────────────────────────────────────

const IconAppearance = ({ className }: { className?: string }) => (
	<svg viewBox="0 0 20 20" fill="none" className={className}>
		<circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
		<path d="M6.5 13.5 Q10 6 13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
		<path d="M7.8 11h4.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
		<circle cx="10" cy="5.5" r="1" fill="currentColor" />
	</svg>
);

const IconSound = ({ className }: { className?: string }) => (
	<svg viewBox="0 0 20 20" fill="none" className={className}>
		<path d="M4 7.5h2.5L10 4v12l-3.5-3.5H4a.5.5 0 01-.5-.5v-4A.5.5 0 014 7.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
		<path d="M13 7a4 4 0 010 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
		<path d="M15 5a7 7 0 010 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
	</svg>
);

const IconDisplays = ({ className }: { className?: string }) => (
	<svg viewBox="0 0 20 20" fill="none" className={className}>
		<rect x="2" y="3.5" width="16" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
		<path d="M7 16.5h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
		<path d="M10 13.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
		<path d="M7 8l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

const IconNetwork = ({ className }: { className?: string }) => (
	<svg viewBox="0 0 20 20" fill="none" className={className}>
		<path d="M2 7.5C5.5 4 14.5 4 18 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
		<path d="M4.5 10C6.8 7.8 13.2 7.8 15.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
		<path d="M7 12.5c1.5-1.5 5-1.5 6 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
		<circle cx="10" cy="15.5" r="1.2" fill="currentColor" />
	</svg>
);

const IconAbout = ({ className }: { className?: string }) => (
	<svg viewBox="0 0 20 20" fill="none" className={className}>
		<circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
		<path d="M10 9v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
		<circle cx="10" cy="6.5" r="1" fill="currentColor" />
	</svg>
);

const NAV_ITEMS: {
	id: Section;
	label: string;
	Icon: React.ComponentType<{ className?: string }>;
}[] = [
	{ id: "appearance", label: "Appearance", Icon: IconAppearance },
	{ id: "sound", label: "Sound", Icon: IconSound },
	{ id: "displays", label: "Displays", Icon: IconDisplays },
	{ id: "network", label: "Network", Icon: IconNetwork },
	{ id: "about", label: "About", Icon: IconAbout },
];

// ─── Main component ───────────────────────────────────────────────────────────

const Settings = () => {
	const dispatch = useDispatch();
	const { soundLevel, brightnessLevel } = useSelector((s: RootState) => s.status);
	const { backgroundImage } = useSelector((s: RootState) => s.backgroundImage);
	const [section, setSection] = useState<Section>("appearance");
	const [wifiOn, setWifiOn] = useState(true);
	const [bluetoothOn, setBluetoothOn] = useState(false);
	const [airplaneMode, setAirplaneMode] = useState(false);

	return (
		<div className="flex h-full overflow-hidden bg-[#1c1c1e] text-white select-none">
			{/* Sidebar */}
			<aside className="flex flex-col w-52 shrink-0 border-r border-white/8 bg-[#141416]">
				<div className="px-4 pt-5 pb-3">
					<p className="text-[11px] font-semibold uppercase tracking-widest text-white/30">
						Settings
					</p>
				</div>
				<nav className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5">
					{NAV_ITEMS.map(({ id, label, Icon }) => {
						const active = section === id;
						return (
							<button
								key={id}
								type="button"
								onClick={() => setSection(id)}
								className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-left ${
									active
										? "bg-[#e95420] text-white font-medium shadow-lg shadow-[#e95420]/20"
										: "text-white/60 hover:bg-white/6 hover:text-white/90"
								}`}
							>
								<Icon className="size-4 shrink-0" />
								{label}
							</button>
						);
					})}
				</nav>
			</aside>

			{/* Content */}
			<main className="flex-1 overflow-y-auto">
				{section === "appearance" && (
					<AppearanceSection
						backgroundImage={backgroundImage}
						onSelectWallpaper={(src) => dispatch(setImage(src))}
					/>
				)}
				{section === "sound" && (
					<SoundSection
						volume={soundLevel}
						onVolumeChange={(v) => dispatch(setSoundLevel(v))}
					/>
				)}
				{section === "displays" && (
					<DisplaysSection
						brightness={brightnessLevel}
						onBrightnessChange={(v) => dispatch(setBrightnessLevel(v))}
					/>
				)}
				{section === "network" && (
					<NetworkSection
						wifiOn={wifiOn}
						bluetoothOn={bluetoothOn}
						airplaneMode={airplaneMode}
						onWifiToggle={() => setWifiOn((v) => !v)}
						onBluetoothToggle={() => setBluetoothOn((v) => !v)}
						onAirplaneModeToggle={() => setAirplaneMode((v) => !v)}
					/>
				)}
				{section === "about" && <AboutSection />}
			</main>
		</div>
	);
};

// ─── Shared primitives ────────────────────────────────────────────────────────

const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
	<div className="mb-6">
		<h2 className="text-lg font-semibold text-white">{title}</h2>
		{subtitle && <p className="text-sm text-white/40 mt-0.5">{subtitle}</p>}
	</div>
);

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
	<div
		className={`rounded-xl border border-white/8 bg-white/4 divide-y divide-white/8 ${className}`}
	>
		{children}
	</div>
);

const CardRow = ({ children }: { children: React.ReactNode }) => (
	<div className="flex items-center justify-between px-4 py-3">{children}</div>
);

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
	<button
		type="button"
		role="switch"
		aria-checked={checked}
		onClick={onChange}
		className={`relative w-10 h-6 rounded-full transition-colors duration-200 shrink-0 ${
			checked ? "bg-[#e95420]" : "bg-white/20"
		}`}
	>
		<span
			className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
				checked ? "translate-x-4" : "translate-x-0"
			}`}
		/>
	</button>
);

const Slider = ({
	value,
	onChange,
	min = 0,
	max = 100,
	label,
	unit = "%",
}: {
	value: number;
	onChange: (v: number) => void;
	min?: number;
	max?: number;
	label: string;
	unit?: string;
}) => (
	<div className="space-y-2">
		<div className="flex justify-between text-sm">
			<span className="text-white/60">{label}</span>
			<span className="font-mono text-white/80 tabular-nums">
				{value}
				{unit}
			</span>
		</div>
		<input
			type="range"
			min={min}
			max={max}
			value={value}
			onChange={(e) => onChange(Number(e.target.value))}
			className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-[#e95420]"
		/>
	</div>
);

// ─── Section: Appearance ──────────────────────────────────────────────────────

const AppearanceSection = ({
	backgroundImage,
	onSelectWallpaper,
}: {
	backgroundImage: string;
	onSelectWallpaper: (src: string) => void;
}) => (
	<div className="p-6">
		<SectionHeader title="Appearance" subtitle="Customize the look of your desktop" />

		<div className="space-y-6">
			<div>
				<p className="text-sm font-medium text-white/60 mb-3">Wallpaper</p>
				<div className="grid grid-cols-3 gap-3">
					{WALLPAPERS.map((w) => {
						const isSelected = backgroundImage === w.src;
						return (
							<button
								key={w.src}
								type="button"
								onClick={() => onSelectWallpaper(w.src)}
								className={`relative rounded-xl overflow-hidden aspect-video border-2 transition-all group ${
									isSelected
										? "border-[#e95420] shadow-lg shadow-[#e95420]/30"
										: "border-transparent hover:border-white/30"
								}`}
							>
								<img src={w.src} alt={w.label} className="w-full h-full object-cover" />
								<div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
								{isSelected && (
									<div className="absolute top-2 right-2 w-5 h-5 bg-[#e95420] rounded-full flex items-center justify-center shadow">
										<svg viewBox="0 0 12 12" className="w-3 h-3">
											<path
												d="M2 6l3 3 5-5"
												stroke="white"
												strokeWidth="1.5"
												fill="none"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
									</div>
								)}
								<div className="absolute bottom-0 inset-x-0 px-2 py-1.5 bg-linear-to-t from-black/70 to-transparent">
									<p className="text-xs text-white font-medium truncate">{w.label}</p>
								</div>
							</button>
						);
					})}
				</div>
			</div>

			<Card>
				<CardRow>
					<div>
						<p className="text-sm font-medium text-white/90">Dark Mode</p>
						<p className="text-xs text-white/40">Always active</p>
					</div>
					<Toggle checked={true} onChange={() => {}} />
				</CardRow>
				<CardRow>
					<div>
						<p className="text-sm font-medium text-white/90">Accent Color</p>
						<p className="text-xs text-white/40">Ubuntu Orange</p>
					</div>
					<div className="w-5 h-5 rounded-full bg-[#e95420] shadow-md shadow-[#e95420]/40" />
				</CardRow>
			</Card>
		</div>
	</div>
);

// ─── Section: Sound ───────────────────────────────────────────────────────────

const SoundSection = ({
	volume,
	onVolumeChange,
}: {
	volume: number;
	onVolumeChange: (v: number) => void;
}) => {
	const isMuted = volume === 0;
	return (
		<div className="p-6">
			<SectionHeader title="Sound" subtitle="Manage audio output and alerts" />
			<div className="space-y-5">
				<Card>
					<div className="px-4 py-4 space-y-4">
						<Slider label="Output Volume" value={volume} onChange={onVolumeChange} />
					</div>
					<CardRow>
						<div>
							<p className="text-sm font-medium text-white/90">Mute</p>
							<p className="text-xs text-white/40">Silence all audio output</p>
						</div>
						<Toggle
							checked={isMuted}
							onChange={() => onVolumeChange(isMuted ? 50 : 0)}
						/>
					</CardRow>
				</Card>
				<Card>
					<CardRow>
						<div>
							<p className="text-sm font-medium text-white/90">Output Device</p>
							<p className="text-xs text-white/40">Built-in Speakers</p>
						</div>
						<span className="text-xs text-white/30">Default</span>
					</CardRow>
					<CardRow>
						<div>
							<p className="text-sm font-medium text-white/90">Input Device</p>
							<p className="text-xs text-white/40">Built-in Microphone</p>
						</div>
						<span className="text-xs text-white/30">Default</span>
					</CardRow>
				</Card>
				<Card>
					<CardRow>
						<div>
							<p className="text-sm font-medium text-white/90">Alert Sounds</p>
							<p className="text-xs text-white/40">Play sound for notifications</p>
						</div>
						<Toggle checked={true} onChange={() => {}} />
					</CardRow>
				</Card>
			</div>
		</div>
	);
};

// ─── Section: Displays ────────────────────────────────────────────────────────

const DisplaysSection = ({
	brightness,
	onBrightnessChange,
}: {
	brightness: number;
	onBrightnessChange: (v: number) => void;
}) => (
	<div className="p-6">
		<SectionHeader title="Displays" subtitle="Configure your display settings" />
		<div className="space-y-5">
			<Card>
				<div className="px-4 py-4 space-y-4">
					<Slider label="Brightness" value={brightness} onChange={onBrightnessChange} />
				</div>
				<CardRow>
					<div>
						<p className="text-sm font-medium text-white/90">Auto-Brightness</p>
						<p className="text-xs text-white/40">Adjust based on ambient light</p>
					</div>
					<Toggle checked={false} onChange={() => {}} />
				</CardRow>
				<CardRow>
					<div>
						<p className="text-sm font-medium text-white/90">Night Light</p>
						<p className="text-xs text-white/40">Reduce blue light after sunset</p>
					</div>
					<Toggle checked={false} onChange={() => {}} />
				</CardRow>
			</Card>
			<Card>
				<CardRow>
					<p className="text-sm font-medium text-white/90">Resolution</p>
					<span className="text-xs text-white/50 font-mono">1920 × 1080</span>
				</CardRow>
				<CardRow>
					<p className="text-sm font-medium text-white/90">Refresh Rate</p>
					<span className="text-xs text-white/50 font-mono">60 Hz</span>
				</CardRow>
				<CardRow>
					<p className="text-sm font-medium text-white/90">Scaling</p>
					<span className="text-xs text-white/50 font-mono">100%</span>
				</CardRow>
			</Card>
		</div>
	</div>
);

// ─── Section: Network ─────────────────────────────────────────────────────────

const NetworkSection = ({
	wifiOn,
	bluetoothOn,
	airplaneMode,
	onWifiToggle,
	onBluetoothToggle,
	onAirplaneModeToggle,
}: {
	wifiOn: boolean;
	bluetoothOn: boolean;
	airplaneMode: boolean;
	onWifiToggle: () => void;
	onBluetoothToggle: () => void;
	onAirplaneModeToggle: () => void;
}) => (
	<div className="p-6">
		<SectionHeader title="Network" subtitle="Manage Wi-Fi, Bluetooth, and connections" />
		<div className="space-y-5">
			<Card>
				<CardRow>
					<div>
						<p className="text-sm font-medium text-white/90">Airplane Mode</p>
						<p className="text-xs text-white/40">Disable all wireless connections</p>
					</div>
					<Toggle checked={airplaneMode} onChange={onAirplaneModeToggle} />
				</CardRow>
			</Card>
			<Card>
				<CardRow>
					<div>
						<p className="text-sm font-medium text-white/90">Wi-Fi</p>
						<p className="text-xs text-white/40">
							{wifiOn && !airplaneMode ? "Connected to TechCoder_5G" : "Off"}
						</p>
					</div>
					<Toggle checked={wifiOn && !airplaneMode} onChange={onWifiToggle} />
				</CardRow>
				{wifiOn && !airplaneMode && (
					<div className="px-4 py-3 space-y-1.5">
						{["TechCoder_5G", "HomeNetwork_2.4G", "Office-WiFi"].map((net, i) => (
							<div
								key={net}
								className={`flex items-center justify-between py-1.5 px-2.5 rounded-lg text-sm ${
									i === 0 ? "bg-white/8 text-white/90" : "text-white/40"
								}`}
							>
								<div className="flex items-center gap-2">
									<IconNetwork className="size-3.5" />
									<span>{net}</span>
								</div>
								{i === 0 && (
									<span className="text-[10px] text-[#e95420] font-semibold">Connected</span>
								)}
							</div>
						))}
					</div>
				)}
			</Card>
			<Card>
				<CardRow>
					<div>
						<p className="text-sm font-medium text-white/90">Bluetooth</p>
						<p className="text-xs text-white/40">
							{bluetoothOn ? "On — discoverable" : "Off"}
						</p>
					</div>
					<Toggle checked={bluetoothOn} onChange={onBluetoothToggle} />
				</CardRow>
			</Card>
			<Card>
				<CardRow>
					<p className="text-sm font-medium text-white/90">IP Address</p>
					<span className="text-xs text-white/50 font-mono">192.168.1.42</span>
				</CardRow>
				<CardRow>
					<p className="text-sm font-medium text-white/90">MAC Address</p>
					<span className="text-xs text-white/50 font-mono">A4:C3:F0:85:AC:21</span>
				</CardRow>
			</Card>
		</div>
	</div>
);

// ─── Section: About ───────────────────────────────────────────────────────────

const AboutSection = () => (
	<div className="p-6">
		<SectionHeader title="About" subtitle="System information" />
		<div className="space-y-5">
			<div className="flex items-center gap-5 p-5 rounded-xl bg-gradient-to-br from-[#e95420]/15 to-white/4 border border-white/8">
				<div className="w-14 h-14 rounded-2xl bg-[#e95420] flex items-center justify-center shadow-lg shadow-[#e95420]/30 shrink-0">
					<svg viewBox="0 0 64 64" className="w-9 h-9">
						<circle cx="32" cy="32" r="30" fill="#fff" />
						<circle cx="32" cy="14" r="5" fill="#e95420" />
						<circle cx="16" cy="42" r="5" fill="#e95420" />
						<circle cx="48" cy="42" r="5" fill="#e95420" />
						<circle
							cx="32"
							cy="32"
							r="22"
							fill="none"
							stroke="rgba(233,84,32,0.4)"
							strokeWidth="2"
						/>
					</svg>
				</div>
				<div>
					<p className="text-base font-semibold text-white">TechCoder OS</p>
					<p className="text-sm text-white/50">Version 1.0.0 (Build 2026)</p>
					<p className="text-xs text-white/30 mt-0.5">Based on Ubuntu 24.04 LTS</p>
				</div>
			</div>
			<Card>
				{[
					{ label: "Kernel", value: "Linux 6.17.0-generic" },
					{ label: "Architecture", value: "x86_64" },
					{ label: "Memory", value: "16 GB RAM" },
					{ label: "Storage", value: "512 GB SSD" },
					{ label: "Processor", value: "Intel Core i7-12700H" },
					{ label: "Graphics", value: "Intel Iris Xe Graphics" },
				].map(({ label, value }) => (
					<CardRow key={label}>
						<span className="text-sm text-white/60">{label}</span>
						<span className="text-sm text-white/90 font-mono">{value}</span>
					</CardRow>
				))}
			</Card>
			<Card>
				<CardRow>
					<span className="text-sm text-white/60">Desktop Environment</span>
					<span className="text-sm text-white/90">TechCoder Shell 1.0</span>
				</CardRow>
				<CardRow>
					<span className="text-sm text-white/60">Window Manager</span>
					<span className="text-sm text-white/90">React WM</span>
				</CardRow>
				<CardRow>
					<span className="text-sm text-white/60">Last Updated</span>
					<span className="text-sm text-white/90">May 3, 2026</span>
				</CardRow>
			</Card>
			<button
				type="button"
				className="w-full py-2.5 rounded-xl text-sm font-medium bg-white/6 hover:bg-white/10 text-white/70 hover:text-white transition-colors border border-white/8"
			>
				Check for Updates
			</button>
		</div>
	</div>
);

export { Settings };
