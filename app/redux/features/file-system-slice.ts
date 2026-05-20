import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type FileRootId = "pictures" | "documents" | "downloads" | "music";
export type FileLocationId = FileRootId | string;

export interface ImageFile {
	id: string;
	name: string;
	src: string;
	size: string;
	locationId: FileLocationId;
}

export interface FileFolder {
	id: string;
	name: string;
	parentId: FileLocationId;
	createdAt: number;
	updatedAt: number;
}

interface FileSystemState {
	folders: Record<string, FileFolder>;
	images: Record<string, ImageFile>;
	lastError: string | null;
}

const normalizeName = (name: string) => name.trim().replace(/\s+/g, " ");
const sameName = (a: string, b: string) =>
	a.trim().toLowerCase() === b.trim().toLowerCase();

const hasChildNamed = (
	folders: Record<string, FileFolder>,
	parentId: FileLocationId,
	name: string,
	excludeId?: string,
) =>
	Object.values(folders).some(
		(folder) =>
			folder.parentId === parentId &&
			folder.id !== excludeId &&
			sameName(folder.name, name),
	);

const isDescendant = (
	folders: Record<string, FileFolder>,
	folderId: string,
	targetId: FileLocationId,
) => {
	let current = folders[targetId];
	while (current) {
		if (current.id === folderId) return true;
		current = folders[current.parentId];
	}
	return false;
};

const initialState: FileSystemState = {
	folders: {},
	images: {},
	lastError: null,
};

export const fileSystem = createSlice({
	name: "fileSystem",
	initialState,
	reducers: {
		seedImages: (
			state,
			action: PayloadAction<Omit<ImageFile, "locationId">[]>,
		) => {
			for (const image of action.payload) {
				if (!state.images[image.id]) {
					state.images[image.id] = { ...image, locationId: "pictures" };
				} else {
					state.images[image.id] = { ...state.images[image.id], ...image };
				}
			}
		},
		clearFileSystemError: (state) => {
			state.lastError = null;
		},
		createFolder: (
			state,
			action: PayloadAction<{ name: string; parentId: FileLocationId }>,
		) => {
			const name = normalizeName(action.payload.name);
			const parentId = action.payload.parentId;

			if (!name) {
				state.lastError = "Folder name cannot be empty.";
				return;
			}

			if (hasChildNamed(state.folders, parentId, name)) {
				state.lastError = "A folder with that name already exists here.";
				return;
			}

			const id = `folder-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
			const now = Date.now();
			state.folders[id] = { id, name, parentId, createdAt: now, updatedAt: now };
			state.lastError = null;
		},
		renameFolder: (
			state,
			action: PayloadAction<{ folderId: string; name: string }>,
		) => {
			const folder = state.folders[action.payload.folderId];
			const name = normalizeName(action.payload.name);

			if (!folder) {
				state.lastError = "That folder no longer exists.";
				return;
			}

			if (!name) {
				state.lastError = "Folder name cannot be empty.";
				return;
			}

			if (hasChildNamed(state.folders, folder.parentId, name, folder.id)) {
				state.lastError = "A folder with that name already exists here.";
				return;
			}

			folder.name = name;
			folder.updatedAt = Date.now();
			state.lastError = null;
		},
		deleteFolder: (state, action: PayloadAction<{ folderId: string }>) => {
			const folder = state.folders[action.payload.folderId];

			if (!folder) {
				state.lastError = "That folder no longer exists.";
				return;
			}

			const hasFolders = Object.values(state.folders).some(
				(child) => child.parentId === folder.id,
			);
			const hasImages = Object.values(state.images).some(
				(image) => image.locationId === folder.id,
			);

			if (hasFolders || hasImages) {
				state.lastError = "Delete or move this folder's contents first.";
				return;
			}

			delete state.folders[folder.id];
			state.lastError = null;
		},
		moveImage: (
			state,
			action: PayloadAction<{ imageId: string; targetId: FileLocationId }>,
		) => {
			const image = state.images[action.payload.imageId];
			const targetId = action.payload.targetId;

			if (!image) {
				state.lastError = "That image no longer exists.";
				return;
			}

			if (
				!state.folders[targetId] &&
				!["pictures", "documents", "downloads", "music"].includes(targetId)
			) {
				state.lastError = "That destination no longer exists.";
				return;
			}

			if (image.locationId === targetId) {
				state.lastError = "The image is already in that location.";
				return;
			}

			image.locationId = targetId;
			state.lastError = null;
		},
		moveFolder: (
			state,
			action: PayloadAction<{ folderId: string; targetId: FileLocationId }>,
		) => {
			const folder = state.folders[action.payload.folderId];
			const targetId = action.payload.targetId;

			if (!folder) {
				state.lastError = "That folder no longer exists.";
				return;
			}

			if (
				folder.id === targetId ||
				isDescendant(state.folders, folder.id, targetId)
			) {
				state.lastError = "A folder cannot be moved inside itself.";
				return;
			}

			if (
				!state.folders[targetId] &&
				!["pictures", "documents", "downloads", "music"].includes(targetId)
			) {
				state.lastError = "That destination no longer exists.";
				return;
			}

			if (folder.parentId === targetId) {
				state.lastError = "The folder is already in that location.";
				return;
			}

			if (hasChildNamed(state.folders, targetId, folder.name, folder.id)) {
				state.lastError = "That destination already has a folder with this name.";
				return;
			}

			folder.parentId = targetId;
			folder.updatedAt = Date.now();
			state.lastError = null;
		},
	},
});

export const {
	clearFileSystemError,
	createFolder,
	deleteFolder,
	moveFolder,
	moveImage,
	renameFolder,
	seedImages,
} = fileSystem.actions;
export default fileSystem.reducer;
