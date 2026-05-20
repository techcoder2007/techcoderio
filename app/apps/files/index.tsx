import type React from "react";
import { useEffect, useMemo, useState } from "react";
import imgDeserr from "~/assets/images/deserr-wallpaper.webp";
import imgStation from "~/assets/images/station-wallpaper.webp";
import imgWindowsDark from "~/assets/images/windows-dark.jpg";
import imgWindowsLight from "~/assets/images/windows-light.jpg";
import imgManga from "~/assets/images/wp15750068-1920x1080-manga-wallpapers.jpg";
import imgBlueLock from "~/assets/images/wp15944176-blue-lock-8k-pc-wallpapers.jpg";
import b416c7763442d1d0957a457af39fa49b from "~/assets/pictures/b416c7763442d1d0957a457af39fa49b.png";
import c762ac0f37ec329b73d73db1b5857efc from "~/assets/pictures/c762ac0f37ec329b73d73db1b5857efc.png";
import funnyDrawings from "~/assets/pictures/Funny Drawings Ideas to Brighten Your Day - Fascinate Names.jpeg";
import iHopeItExplodes from "~/assets/pictures/I hope it explodes_.jpeg";
import type {
	FileFolder,
	FileLocationId,
	FileRootId,
	ImageFile,
} from "~/redux/features/file-system-slice";
import {
	clearFileSystemError,
	createFolder,
	deleteFolder,
	moveFolder,
	moveImage,
	renameFolder,
	seedImages,
} from "~/redux/features/file-system-slice";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";
import {
	IconClose,
	IconDocuments,
	IconDownloads,
	IconGrid,
	IconHome,
	IconList,
	IconMusic,
	IconPictures,
	IconSearch,
	IconTrash,
} from "./system-icons";

type SidebarSection =
	| "home"
	| "pictures"
	| "documents"
	| "downloads"
	| "music"
	| "trash";
type ViewMode = "grid" | "list";

const ROOTS: {
	id: FileRootId;
	label: string;
	Icon: React.ComponentType<{ className?: string }>;
}[] = [
	{ id: "pictures", label: "Pictures", Icon: IconPictures },
	{ id: "documents", label: "Documents", Icon: IconDocuments },
	{ id: "downloads", label: "Downloads", Icon: IconDownloads },
	{ id: "music", label: "Music", Icon: IconMusic },
];

const INITIAL_IMAGES: Omit<ImageFile, "locationId">[] = [
	{
		id: "image-windows-dark",
		name: "windows-dark.jpg",
		src: imgWindowsDark,
		size: "1.2 MB",
	},
	{
		id: "image-windows-light",
		name: "windows-light.jpg",
		src: imgWindowsLight,
		size: "1.1 MB",
	},
	{
		id: "image-blue-lock",
		name: "blue-lock-8k.jpg",
		src: imgBlueLock,
		size: "4.8 MB",
	},
	{
		id: "image-manga",
		name: "manga-wallpaper.jpg",
		src: imgManga,
		size: "2.3 MB",
	},
	{
		id: "image-deserr",
		name: "deserr-wallpaper.webp",
		src: imgDeserr,
		size: "980 KB",
	},
	{
		id: "image-station",
		name: "station-wallpaper.webp",
		src: imgStation,
		size: "1.5 MB",
	},
	{
		id: "image-funny-drawings",
		name: "Funny Drawings Ideas to Brighten Your Day - Fascinate Names.jpeg",
		src: funnyDrawings,
		size: "1.1 MB",
	},
	{
		id: "image-explodes",
		name: "I hope it explodes_.jpeg",
		src: iHopeItExplodes,
		size: "4.8 MB",
	},
	{
		id: "image-b416",
		name: "b416c7763442d1d0957a457af39fa49b.png",
		src: b416c7763442d1d0957a457af39fa49b,
		size: "2.3 MB",
	},
	{
		id: "image-c762",
		name: "c762ac0f37ec329b73d73db1b5857efc.png",
		src: c762ac0f37ec329b73d73db1b5857efc,
		size: "980 KB",
	},
];

const rootLabel = (id: FileRootId) =>
	ROOTS.find((root) => root.id === id)?.label ?? id;
const isRoot = (id: FileLocationId): id is FileRootId =>
	["pictures", "documents", "downloads", "music"].includes(id);

const getLocationTitle = (
	locationId: FileLocationId,
	folders: Record<string, FileFolder>,
) =>
	isRoot(locationId)
		? rootLabel(locationId)
		: (folders[locationId]?.name ?? "Missing Folder");

const getRootForLocation = (
	locationId: FileLocationId,
	folders: Record<string, FileFolder>,
): FileRootId => {
	let currentId: FileLocationId | undefined = locationId;

	while (currentId) {
		if (isRoot(currentId)) return currentId;
		currentId = folders[currentId]?.parentId;
	}

	return "documents";
};

const Files = () => {
	const dispatch = useAppDispatch();
	const { folders, images, lastError } = useAppSelector(
		(state) => state.fileSystem,
	);
	const [section, setSection] = useState<SidebarSection>("home");
	const [currentLocation, setCurrentLocation] =
		useState<FileLocationId>("pictures");
	const [viewMode, setViewMode] = useState<ViewMode>("grid");
	const [search, setSearch] = useState("");
	const [lightbox, setLightbox] = useState<{ src: string; name: string } | null>(
		null,
	);

	useEffect(() => {
		dispatch(seedImages(INITIAL_IMAGES));
	}, [dispatch]);

	const folderList = useMemo(() => Object.values(folders), [folders]);
	const imageList = useMemo(() => Object.values(images), [images]);
	const destinations = useMemo(
		() => [
			...ROOTS.map((root) => ({ id: root.id, label: root.label })),
			...folderList.map((folder) => ({ id: folder.id, label: folder.name })),
		],
		[folderList],
	);
	const children = useMemo(
		() => ({
			folders: folderList.filter((folder) => folder.parentId === currentLocation),
			images: imageList.filter((image) => image.locationId === currentLocation),
		}),
		[currentLocation, folderList, imageList],
	);

	const filteredFolders = children.folders.filter((folder) =>
		folder.name.toLowerCase().includes(search.toLowerCase()),
	);
	const filteredImages = children.images.filter((image) =>
		image.name.toLowerCase().includes(search.toLowerCase()),
	);

	const navigateTo = (locationId: FileLocationId) => {
		setCurrentLocation(locationId);
		setSection(getRootForLocation(locationId, folders));
		setSearch("");
		dispatch(clearFileSystemError());
	};

	const navigateSection = (id: SidebarSection) => {
		setSection(id);
		if (isRoot(id)) setCurrentLocation(id);
		setSearch("");
		dispatch(clearFileSystemError());
	};

	const handleCreateFolder = () => {
		const name = window.prompt("New folder name");
		if (name === null) return;
		dispatch(createFolder({ name, parentId: currentLocation }));
	};

	const handleRenameFolder = (folder: FileFolder) => {
		const name = window.prompt("Rename folder", folder.name);
		if (name === null) return;
		dispatch(renameFolder({ folderId: folder.id, name }));
	};

	const handleDeleteFolder = (folder: FileFolder) => {
		if (
			!window.confirm(
				`Delete "${folder.name}"? Empty folders only can be deleted.`,
			)
		)
			return;
		dispatch(deleteFolder({ folderId: folder.id }));
		if (currentLocation === folder.id) navigateTo(folder.parentId);
	};

	const handleMoveImage = (imageId: string, targetId: FileLocationId) => {
		dispatch(moveImage({ imageId, targetId }));
	};

	const handleDrop = (targetId: FileLocationId, event: React.DragEvent) => {
		event.preventDefault();
		const imageId = event.dataTransfer.getData("application/x-image-id");
		const folderId = event.dataTransfer.getData("application/x-folder-id");

		if (imageId) dispatch(moveImage({ imageId, targetId }));
		if (folderId) dispatch(moveFolder({ folderId, targetId }));
	};

	return (
		<div className="flex h-full overflow-hidden bg-[#1c1c1e] text-white select-none">
			<aside className="flex flex-col w-44 shrink-0 border-r border-white/8 bg-[#141416]">
				<div className="px-3 pt-4 pb-2">
					<p className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
						Files
					</p>
				</div>
				<nav className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5">
					<SidebarButton
						active={section === "home"}
						label="Home"
						Icon={IconHome}
						onClick={() => navigateSection("home")}
					/>
					{ROOTS.map(({ id, label, Icon }) => (
						<SidebarButton
							key={id}
							active={section === id && currentLocation === id}
							label={label}
							Icon={Icon}
							count={imageList.filter((image) => image.locationId === id).length}
							onClick={() => navigateSection(id)}
							onDragOver={(event) => event.preventDefault()}
							onDrop={(event) => handleDrop(id, event)}
						/>
					))}
					<SidebarButton
						active={section === "trash"}
						label="Trash"
						Icon={IconTrash}
						onClick={() => navigateSection("trash")}
					/>
				</nav>
			</aside>

			<div className="flex flex-col flex-1 min-w-0">
				<div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/8 shrink-0">
					<div className="mr-auto min-w-0">
						<h2 className="text-sm font-semibold text-white/90 truncate">
							{section === "home"
								? "Home"
								: section === "trash"
									? "Trash"
									: getLocationTitle(currentLocation, folders)}
						</h2>
						{section !== "home" && section !== "trash" && (
							<Breadcrumb
								locationId={currentLocation}
								folders={folders}
								onNavigate={navigateTo}
							/>
						)}
					</div>

					{section !== "home" && section !== "trash" && (
						<button
							type="button"
							onClick={handleCreateFolder}
							className="px-3 py-1.5 text-xs rounded-lg bg-[#3a8fd4]/85 hover:bg-[#3a8fd4] transition-colors"
						>
							New Folder
						</button>
					)}

					<div className="relative">
						<IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-white/30" />
						<input
							type="text"
							placeholder="Search..."
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							className="pl-8 pr-3 py-1.5 text-xs rounded-lg bg-white/6 border border-white/8 text-white placeholder-white/30 focus:outline-none focus:border-white/20 w-40"
						/>
					</div>

					<div className="flex rounded-lg overflow-hidden border border-white/8">
						{(["grid", "list"] as const).map((mode) => (
							<button
								key={mode}
								type="button"
								onClick={() => setViewMode(mode)}
								className={`px-2.5 py-1.5 transition-colors ${
									viewMode === mode
										? "bg-white/12 text-white"
										: "text-white/40 hover:text-white/70"
								}`}
							>
								{mode === "grid" ? (
									<IconGrid className="size-3.5" />
								) : (
									<IconList className="size-3.5" />
								)}
							</button>
						))}
					</div>
				</div>

				{lastError && (
					<div className="mx-4 mt-3 flex items-center justify-between rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs text-red-100">
						<span>{lastError}</span>
						<button
							type="button"
							onClick={() => dispatch(clearFileSystemError())}
							className="text-red-100/60 hover:text-red-100"
						>
							Dismiss
						</button>
					</div>
				)}

				<div
					className="flex-1 overflow-y-auto p-4"
					onDragOver={(event) => event.preventDefault()}
					onDrop={(event) =>
						section !== "home" &&
						section !== "trash" &&
						handleDrop(currentLocation, event)
					}
				>
					{section === "home" ? (
						<HomeView
							onNavigate={navigateSection}
							counts={{ folders: folderList.length, images: imageList.length }}
						/>
					) : section === "trash" ? (
						<EmptyView title="Trash" subtitle="Deleted files are not kept yet" />
					) : (
						<LocationView
							viewMode={viewMode}
							folders={filteredFolders}
							images={filteredImages}
							destinations={destinations}
							currentLocation={currentLocation}
							onOpenFolder={navigateTo}
							onOpenImage={(image) => setLightbox(image)}
							onRenameFolder={handleRenameFolder}
							onDeleteFolder={handleDeleteFolder}
							onMoveImage={handleMoveImage}
							onDrop={handleDrop}
						/>
					)}
				</div>
			</div>

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
						onClick={(event) => event.stopPropagation()}
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

const SidebarButton = ({
	active,
	label,
	Icon,
	count,
	onClick,
	onDragOver,
	onDrop,
}: {
	active: boolean;
	label: string;
	Icon: React.ComponentType<{ className?: string }>;
	count?: number;
	onClick: () => void;
	onDragOver?: (event: React.DragEvent<HTMLButtonElement>) => void;
	onDrop?: (event: React.DragEvent<HTMLButtonElement>) => void;
}) => (
	<button
		type="button"
		onClick={onClick}
		onDragOver={onDragOver}
		onDrop={onDrop}
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

const Breadcrumb = ({
	locationId,
	folders,
	onNavigate,
}: {
	locationId: FileLocationId;
	folders: Record<string, FileFolder>;
	onNavigate: (locationId: FileLocationId) => void;
}) => {
	const parts: { id: FileLocationId; label: string }[] = [];
	let currentId: FileLocationId | undefined = locationId;

	while (currentId) {
		if (isRoot(currentId)) {
			parts.unshift({ id: currentId, label: rootLabel(currentId) });
			break;
		}
		const folder: FileFolder | undefined = folders[currentId];
		if (!folder) break;
		parts.unshift({ id: folder.id, label: folder.name });
		currentId = folder.parentId;
	}

	return (
		<div className="flex items-center gap-1 text-[10px] text-white/35">
			{parts.map((part, index) => (
				<span key={part.id} className="flex items-center gap-1">
					{index > 0 && <span>/</span>}
					<button
						type="button"
						onClick={() => onNavigate(part.id)}
						className="max-w-28 truncate hover:text-white/70"
					>
						{part.label}
					</button>
				</span>
			))}
		</div>
	);
};

const HomeView = ({
	onNavigate,
	counts,
}: {
	onNavigate: (section: SidebarSection) => void;
	counts: { folders: number; images: number };
}) => (
	<div className="space-y-5">
		<div>
			<p className="text-xs text-white/30 uppercase tracking-wider mb-3">
				Folders
			</p>
			<div className="grid grid-cols-4 gap-3">
				{ROOTS.map(({ id, label, Icon }) => (
					<button
						key={id}
						type="button"
						onClick={() => onNavigate(id)}
						className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/6 transition-colors group"
					>
						<div className="w-12 h-12 flex items-center justify-center">
							<Icon className="size-10 text-[#ffd04b] group-hover:text-[#ffe080] transition-colors" />
						</div>
						<span className="text-xs text-white/80 font-medium">{label}</span>
						<span className="text-[10px] text-white/30">Open</span>
					</button>
				))}
			</div>
		</div>
		<div className="grid grid-cols-2 gap-3 text-xs text-white/45">
			<div className="rounded-lg border border-white/8 bg-white/5 p-3">
				{counts.folders} custom folders
			</div>
			<div className="rounded-lg border border-white/8 bg-white/5 p-3">
				{counts.images} images tracked
			</div>
		</div>
	</div>
);

const LocationView = ({
	viewMode,
	folders,
	images,
	destinations,
	currentLocation,
	onOpenFolder,
	onOpenImage,
	onRenameFolder,
	onDeleteFolder,
	onMoveImage,
	onDrop,
}: {
	viewMode: ViewMode;
	folders: FileFolder[];
	images: ImageFile[];
	destinations: { id: FileLocationId; label: string }[];
	currentLocation: FileLocationId;
	onOpenFolder: (id: FileLocationId) => void;
	onOpenImage: (image: ImageFile) => void;
	onRenameFolder: (folder: FileFolder) => void;
	onDeleteFolder: (folder: FileFolder) => void;
	onMoveImage: (imageId: string, targetId: FileLocationId) => void;
	onDrop: (targetId: FileLocationId, event: React.DragEvent) => void;
}) => {
	if (folders.length === 0 && images.length === 0) {
		return (
			<EmptyView
				title="This folder is empty"
				subtitle="Create a folder or move images here"
			/>
		);
	}

	if (viewMode === "list") {
		return (
			<div className="rounded-xl border border-white/8 overflow-hidden divide-y divide-white/8">
				{folders.map((folder) => (
					<FolderRow
						key={folder.id}
						folder={folder}
						onOpenFolder={onOpenFolder}
						onRenameFolder={onRenameFolder}
						onDeleteFolder={onDeleteFolder}
						onDrop={onDrop}
					/>
				))}
				{images.map((image) => (
					<ImageRow
						key={image.id}
						image={image}
						destinations={destinations}
						currentLocation={currentLocation}
						onOpenImage={onOpenImage}
						onMoveImage={onMoveImage}
					/>
				))}
			</div>
		);
	}

	return (
		<div className="grid grid-cols-3 gap-3">
			{folders.map((folder) => (
				<FolderTile
					key={folder.id}
					folder={folder}
					onOpenFolder={onOpenFolder}
					onRenameFolder={onRenameFolder}
					onDeleteFolder={onDeleteFolder}
					onDrop={onDrop}
				/>
			))}
			{images.map((image) => (
				<ImageTile
					key={image.id}
					image={image}
					destinations={destinations}
					currentLocation={currentLocation}
					onOpenImage={onOpenImage}
					onMoveImage={onMoveImage}
				/>
			))}
		</div>
	);
};

const FolderTile = ({
	folder,
	onOpenFolder,
	onRenameFolder,
	onDeleteFolder,
	onDrop,
}: {
	folder: FileFolder;
	onOpenFolder: (id: FileLocationId) => void;
	onRenameFolder: (folder: FileFolder) => void;
	onDeleteFolder: (folder: FileFolder) => void;
	onDrop: (targetId: FileLocationId, event: React.DragEvent) => void;
}) => (
	<div
		draggable
		onDragStart={(event) =>
			event.dataTransfer.setData("application/x-folder-id", folder.id)
		}
		onDragOver={(event) => event.preventDefault()}
		onDrop={(event) => onDrop(folder.id, event)}
		className="group rounded-xl border border-white/8 bg-white/5 p-3 hover:bg-white/8 transition-colors"
	>
		<button
			type="button"
			onDoubleClick={() => onOpenFolder(folder.id)}
			onClick={() => onOpenFolder(folder.id)}
			className="flex w-full flex-col items-center gap-2 text-left"
		>
			<IconDocuments className="size-12 text-[#ffd04b]" />
			<span className="w-full truncate text-center text-xs font-medium text-white/85">
				{folder.name}
			</span>
		</button>
		<div className="mt-2 flex justify-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
			<button
				type="button"
				onClick={() => onRenameFolder(folder)}
				className="rounded-md px-2 py-1 text-[10px] text-white/60 hover:bg-white/10 hover:text-white"
			>
				Rename
			</button>
			<button
				type="button"
				onClick={() => onDeleteFolder(folder)}
				className="rounded-md px-2 py-1 text-[10px] text-white/60 hover:bg-red-500/20 hover:text-red-100"
			>
				Delete
			</button>
		</div>
	</div>
);

const FolderRow = ({
	folder,
	onOpenFolder,
	onRenameFolder,
	onDeleteFolder,
	onDrop,
}: {
	folder: FileFolder;
	onOpenFolder: (id: FileLocationId) => void;
	onRenameFolder: (folder: FileFolder) => void;
	onDeleteFolder: (folder: FileFolder) => void;
	onDrop: (targetId: FileLocationId, event: React.DragEvent) => void;
}) => (
	<div
		draggable
		onDragStart={(event) =>
			event.dataTransfer.setData("application/x-folder-id", folder.id)
		}
		onDragOver={(event) => event.preventDefault()}
		onDrop={(event) => onDrop(folder.id, event)}
		className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/6 transition-colors"
	>
		<button
			type="button"
			onClick={() => onOpenFolder(folder.id)}
			className="flex flex-1 items-center gap-3 min-w-0 text-left"
		>
			<IconDocuments className="size-7 text-[#ffd04b] shrink-0" />
			<div className="min-w-0">
				<p className="text-sm text-white/90 truncate">{folder.name}</p>
				<p className="text-xs text-white/30">Folder</p>
			</div>
		</button>
		<button
			type="button"
			onClick={() => onRenameFolder(folder)}
			className="text-xs text-white/40 hover:text-white"
		>
			Rename
		</button>
		<button
			type="button"
			onClick={() => onDeleteFolder(folder)}
			className="text-xs text-white/40 hover:text-red-100"
		>
			Delete
		</button>
	</div>
);

const ImageTile = ({
	image,
	destinations,
	currentLocation,
	onOpenImage,
	onMoveImage,
}: {
	image: ImageFile;
	destinations: { id: FileLocationId; label: string }[];
	currentLocation: FileLocationId;
	onOpenImage: (image: ImageFile) => void;
	onMoveImage: (imageId: string, targetId: FileLocationId) => void;
}) => (
	<div
		draggable
		onDragStart={(event) =>
			event.dataTransfer.setData("application/x-image-id", image.id)
		}
		className="group relative rounded-xl overflow-hidden aspect-video bg-white/5 hover:ring-2 hover:ring-[#3a8fd4]/60 transition-all"
	>
		<button
			type="button"
			onClick={() => onOpenImage(image)}
			className="absolute inset-0"
		>
			<img
				src={image.src}
				alt={image.name}
				className="w-full h-full object-cover transition-transform group-hover:scale-105"
			/>
		</button>
		<div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
		<div className="absolute bottom-0 inset-x-0 px-2 py-1.5 bg-linear-to-t from-black/75 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
			<p className="text-xs text-white font-medium truncate">{image.name}</p>
			<MoveSelect
				image={image}
				destinations={destinations}
				currentLocation={currentLocation}
				onMoveImage={onMoveImage}
			/>
		</div>
	</div>
);

const ImageRow = ({
	image,
	destinations,
	currentLocation,
	onOpenImage,
	onMoveImage,
}: {
	image: ImageFile;
	destinations: { id: FileLocationId; label: string }[];
	currentLocation: FileLocationId;
	onOpenImage: (image: ImageFile) => void;
	onMoveImage: (imageId: string, targetId: FileLocationId) => void;
}) => (
	<div
		draggable
		onDragStart={(event) =>
			event.dataTransfer.setData("application/x-image-id", image.id)
		}
		className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/6 transition-colors"
	>
		<button
			type="button"
			onClick={() => onOpenImage(image)}
			className="flex flex-1 items-center gap-3 min-w-0 text-left"
		>
			<img
				src={image.src}
				alt={image.name}
				className="w-10 h-8 object-cover rounded-md shrink-0"
			/>
			<div className="flex-1 min-w-0">
				<p className="text-sm text-white/90 truncate">{image.name}</p>
				<p className="text-xs text-white/30">{image.size}</p>
			</div>
		</button>
		<MoveSelect
			image={image}
			destinations={destinations}
			currentLocation={currentLocation}
			onMoveImage={onMoveImage}
		/>
	</div>
);

const MoveSelect = ({
	image,
	destinations,
	currentLocation,
	onMoveImage,
}: {
	image: ImageFile;
	destinations: { id: FileLocationId; label: string }[];
	currentLocation: FileLocationId;
	onMoveImage: (imageId: string, targetId: FileLocationId) => void;
}) => (
	<select
		value={currentLocation}
		onClick={(event) => event.stopPropagation()}
		onChange={(event) => onMoveImage(image.id, event.target.value)}
		className="mt-1 max-w-full rounded-md border border-white/10 bg-black/60 px-1.5 py-1 text-[10px] text-white/70 focus:outline-none"
	>
		{destinations.map((destination) => (
			<option key={destination.id} value={destination.id}>
				Move to {destination.label}
			</option>
		))}
	</select>
);

const EmptyView = ({
	title,
	subtitle,
}: {
	title: string;
	subtitle: string;
}) => (
	<div className="flex flex-col items-center justify-center h-48 text-white/20">
		<IconDocuments className="size-12 mb-3" />
		<p className="text-sm font-medium">{title}</p>
		<p className="text-xs mt-1">{subtitle}</p>
	</div>
);

export { Files };
