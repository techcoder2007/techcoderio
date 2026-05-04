import { useState } from "react";
import {
	IconHome,
	IconPictures,
	IconDocuments,
	IconDownloads,
	IconMusic,
	IconTrash,
	IconSearch,
	IconGrid,
	IconList,
	IconClose,
} from "./system-icons";

// All images from ~/assets/images/
import imgDeserr from "~/assets/images/deserr-wallpaper.webp";
import imgStation from "~/assets/images/station-wallpaper.webp";
import imgWindowsDark from "~/assets/images/windows-dark.jpg";
import imgWindowsLight from "~/assets/images/windows-light.jpg";
import imgManga from "~/assets/images/wp15750068-1920x1080-manga-wallpapers.jpg";
import imgBlueLock from "~/assets/images/wp15944176-blue-lock-8k-pc-wallpapers.jpg";
import funnyDrawings from '~/assets/pictures/Funny Drawings Ideas to Brighten Your Day - Fascinate Names.jpeg';
import iHopeItExplodes from '~/assets/pictures/I hope it explodes_.jpeg';
import b416c7763442d1d0957a457af39fa49b from '~/assets/pictures/b416c7763442d1d0957a457af39fa49b.png';
import c762ac0f37ec329b73d73db1b5857efc from '~/assets/pictures/c762ac0f37ec329b73d73db1b5857efc.png';

const PICTURES = [
	{ name: "windows-dark.jpg", src: imgWindowsDark, size: "1.2 MB" },
	{ name: "windows-light.jpg", src: imgWindowsLight, size: "1.1 MB" },
	{ name: "blue-lock-8k.jpg", src: imgBlueLock, size: "4.8 MB" },
	{ name: "manga-wallpaper.jpg", src: imgManga, size: "2.3 MB" },
	{ name: "deserr-wallpaper.webp", src: imgDeserr, size: "980 KB" },
	{ name: "station-wallpaper.webp", src: imgStation, size: "1.5 MB" },
	{ name: "Funny Drawings Ideas to Brighten Your Day - Fascinate Names.jpeg", src: funnyDrawings, size: "1.1 MB" },
	{ name: "I hope it explodes_.jpeg", src: iHopeItExplodes, size: "4.8 MB" },
	{ name: "b416c7763442d1d0957a457af39fa49b.png", src: b416c7763442d1d0957a457af39fa49b, size: "2.3 MB" },
	{ name: "c762ac0f37ec329b73d73db1b5857efc.png", src: c762ac0f37ec329b73d73db1b5857efc, size: "980 KB" },
];

type SidebarSection = "home" | "pictures" | "documents" | "downloads" | "music" | "trash";

interface SidebarItem {
	id: SidebarSection;
	label: string;
	Icon: React.ComponentType<{ className?: string }>;
	count?: number;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
	{ id: "home", label: "Home", Icon: IconHome },
	{ id: "pictures", label: "Pictures", Icon: IconPictures, count: PICTURES.length },
	{ id: "documents", label: "Documents", Icon: IconDocuments },
	{ id: "downloads", label: "Downloads", Icon: IconDownloads },
	{ id: "music", label: "Music", Icon: IconMusic },
	{ id: "trash", label: "Trash", Icon: IconTrash },
];

// ─── Placeholder folder/file entries for non-Pictures sections ────────────────

const HOME_ENTRIES = [
	{ name: "Pictures", type: "folder", Icon: IconPictures, modified: "Today" },
	{ name: "Documents", type: "folder", Icon: IconDocuments, modified: "Yesterday" },
	{ name: "Downloads", type: "folder", Icon: IconDownloads, modified: "May 1" },
	{ name: "Music", type: "folder", Icon: IconMusic, modified: "Apr 28" },
];

// ─── Main component ───────────────────────────────────────────────────────────

const Files = () => {
	const [section, setSection] = useState<SidebarSection>("home");
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [search, setSearch] = useState("");
	const [lightbox, setLightbox] = useState<{ src: string; name: string } | null>(null);

	return (
		<div className="flex h-full overflow-hidden bg-[#1c1c1e] text-white select-none">
			{/* Sidebar */}
			<aside className="flex flex-col w-44 shrink-0 border-r border-white/8 bg-[#141416]">
				<div className="px-3 pt-4 pb-2">
					<p className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
						Files
					</p>
				</div>
				<nav className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5">
					{SIDEBAR_ITEMS.map(({ id, label, Icon, count }) => {
						const active = section === id;
						return (
							<button
								key={id}
								type="button"
								onClick={() => setSection(id)}
								className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition-all text-left ${
									active
										? "bg-[#3a8fd4]/80 text-white font-medium"
										: "text-white/60 hover:bg-white/6 hover:text-white/90"
								}`}
							>
								<div className="flex items-center gap-2 min-w-0">
									<Icon className="size-4 shrink-0" />
									<span className="truncate">{label}</span>
								</div>
								{count !== undefined && (
									<span className="text-[10px] text-white/40 tabular-nums">{count}</span>
								)}
							</button>
						);
					})}
				</nav>
			</aside>

			{/* Main content */}
			<div className="flex flex-col flex-1 min-w-0">
				{/* Toolbar */}
				<div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/8 shrink-0">
					<h2 className="text-sm font-semibold text-white/90 capitalize mr-auto">
						{section}
					</h2>

					{/* Search */}
					<div className="relative">
						<IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-white/30" />
						<input
							type="text"
							placeholder="Search…"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="pl-8 pr-3 py-1.5 text-xs rounded-lg bg-white/6 border border-white/8 text-white placeholder-white/30 focus:outline-none focus:border-white/20 w-40"
						/>
					</div>

					{/* View toggle */}
					<div className="flex rounded-lg overflow-hidden border border-white/8">
						{(["grid", "list"] as const).map((m) => (
							<button
								key={m}
								type="button"
								onClick={() => setViewMode(m)}
								className={`px-2.5 py-1.5 transition-colors ${
									viewMode === m ? "bg-white/12 text-white" : "text-white/40 hover:text-white/70"
								}`}
							>
								{m === "grid" ? (
									<IconGrid className="size-3.5" />
								) : (
									<IconList className="size-3.5" />
								)}
							</button>
						))}
					</div>
				</div>

				{/* Content area */}
				<div className="flex-1 overflow-y-auto p-4">
					{section === "pictures" ? (
						<PicturesView
							viewMode={viewMode}
							search={search}
							onOpen={(pic) => setLightbox(pic)}
						/>
					) : section === "home" ? (
						<HomeView onNavigate={setSection} />
					) : (
						<EmptyView section={section} />
					)}
				</div>
			</div>

			{/* Lightbox */}
			{lightbox && (
				<div
					className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-sm"
					onClick={() => setLightbox(null)}
				>
					<button
						type="button"
						onClick={() => setLightbox(null)}
						className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
					>
						<IconClose className="size-5 text-white" />
					</button>
					<div
						className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center gap-3"
						onClick={(e) => e.stopPropagation()}
					>
						<img
							src={lightbox.src}
							alt={lightbox.name}
							className="max-w-full max-h-[80vh] rounded-xl shadow-2xl object-contain"
						/>
						<p className="text-sm text-white/60 font-mono">{lightbox.name}</p>
					</div>
				</div>
			)}
		</div>
	);
};

// ─── Sub-views ────────────────────────────────────────────────────────────────

const HomeView = ({ onNavigate }: { onNavigate: (s: SidebarSection) => void }) => (
	<div>
		<p className="text-xs text-white/30 uppercase tracking-wider mb-3">Folders</p>
		<div className="grid grid-cols-4 gap-3">
			{HOME_ENTRIES.map(({ name, Icon, modified }) => (
				<button
					key={name}
					type="button"
					onClick={() => onNavigate(name.toLowerCase() as SidebarSection)}
					className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/6 transition-colors group"
				>
					<div className="w-12 h-12 flex items-center justify-center">
						<Icon className="size-10 text-[#ffd04b] group-hover:text-[#ffe080] transition-colors" />
					</div>
					<span className="text-xs text-white/80 font-medium">{name}</span>
					<span className="text-[10px] text-white/30">{modified}</span>
				</button>
			))}
		</div>
	</div>
);

const PicturesView = ({
	viewMode,
	search,
	onOpen,
}: {
	viewMode: "grid" | "list";
	search: string;
	onOpen: (pic: { src: string; name: string }) => void;
}) => {
	const filtered = PICTURES.filter((p) =>
		p.name.toLowerCase().includes(search.toLowerCase()),
	);

	if (filtered.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-40 text-white/30">
				<IconPictures className="size-10 mb-2" />
				<p className="text-sm">No pictures found</p>
			</div>
		);
	}

	if (viewMode === "grid") {
		return (
			<div className="grid grid-cols-3 gap-3">
				{filtered.map((pic) => (
					<button
						key={pic.name}
						type="button"
						onClick={() => onOpen(pic)}
						className="group relative rounded-xl overflow-hidden aspect-video bg-white/5 hover:ring-2 hover:ring-[#3a8fd4]/60 transition-all"
					>
						<img
							src={pic.src}
							alt={pic.name}
							className="w-full h-full object-cover transition-transform group-hover:scale-105"
						/>
						<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
						<div className="absolute bottom-0 inset-x-0 px-2 py-1.5 bg-linear-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
							<p className="text-xs text-white font-medium truncate">{pic.name}</p>
						</div>
					</button>
				))}
			</div>
		);
	}

	return (
		<div className="rounded-xl border border-white/8 overflow-hidden divide-y divide-white/8">
			{filtered.map((pic) => (
				<button
					key={pic.name}
					type="button"
					onClick={() => onOpen(pic)}
					className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/6 transition-colors text-left"
				>
					<img
						src={pic.src}
						alt={pic.name}
						className="w-10 h-8 object-cover rounded-md shrink-0"
					/>
					<div className="flex-1 min-w-0">
						<p className="text-sm text-white/90 truncate">{pic.name}</p>
						<p className="text-xs text-white/30">{pic.size}</p>
					</div>
					<span className="text-xs text-white/20 shrink-0">Image</span>
				</button>
			))}
		</div>
	);
};

const EmptyView = ({ section }: { section: SidebarSection }) => (
	<div className="flex flex-col items-center justify-center h-48 text-white/20">
		<IconDocuments className="size-12 mb-3" />
		<p className="text-sm font-medium capitalize">{section}</p>
		<p className="text-xs mt-1">This folder is empty</p>
	</div>
);

export { Files };
