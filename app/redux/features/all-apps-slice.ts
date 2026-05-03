import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { max, uniqueId } from "lodash-es";
import { Calculator, Chrome, Files, Settings, Spotify, Terminal, VSCode } from "~/apps";
import type { AppComponent } from "~/types/app";

export type AppIconName =
	| "chrome"
	| "calculator"
	| "code"
	| "terminal"
	| "spotify"
	| "settings"
	| "files"
	| "ubuntu-logo";

export interface AllAppsState {
	id: string;
	title: string;
	iconName: AppIconName;
	isFavorite: boolean;
	isOpen: boolean;
	app: AppComponent;
	isMinimized: boolean;
	position: {
		x: number;
		y: number;
	};
	size: {
		width: number;
		height: number;
	};
	maximized: boolean;
	slug: string;
	zIndex: number;
	canSpawn?: boolean;
}

const DEFAULT_SIZE = { width: 800, height: 600 };
const DEFAULT_POSITION = { x: 100, y: 80 };

const initialState: AllAppsState[] = [
	{
		id: uniqueId(),
		title: "Chrome",
		slug: "chrome",
		iconName: "chrome",
		isFavorite: true,
		isOpen: false,
		app: Chrome,
		isMinimized: false,
		position: { ...DEFAULT_POSITION },
		size: { ...DEFAULT_SIZE },
		maximized: false,
		zIndex: 0,
		canSpawn: true,
	},
	{
		id: uniqueId(),
		title: "Calculator",
		slug: "calculator",
		iconName: "calculator",
		isFavorite: true,
		isOpen: false,
		app: Calculator,
		isMinimized: false,
		position: { ...DEFAULT_POSITION },
		size: { ...DEFAULT_SIZE },
		maximized: false,
		zIndex: 0,
	},
	{
		id: uniqueId(),
		title: "VS Code",
		slug: "code",
		iconName: "code",
		isFavorite: true,
		isOpen: false,
		app: VSCode,
		isMinimized: false,
		position: { ...DEFAULT_POSITION },
		size: { ...DEFAULT_SIZE },
		maximized: false,
		zIndex: 0,
	},
	{
		id: uniqueId(),
		title: "Terminal",
		slug: "terminal",
		iconName: "terminal",
		isFavorite: true,
		isOpen: false,
		app: Terminal,
		isMinimized: false,
		position: { ...DEFAULT_POSITION },
		size: { ...DEFAULT_SIZE },
		maximized: false,
		zIndex: 0,
	},
	{
		id: uniqueId(),
		title: "Spotify",
		slug: "spotify",
		iconName: "spotify",
		isFavorite: true,
		isOpen: false,
		app: Spotify,
		isMinimized: false,
		position: { ...DEFAULT_POSITION },
		size: { ...DEFAULT_SIZE },
		maximized: false,
		zIndex: 0,
	},
	{
		id: uniqueId(),
		title: "Files",
		slug: "files",
		iconName: "files",
		isFavorite: true,
		isOpen: false,
		app: Files,
		isMinimized: false,
		position: { ...DEFAULT_POSITION },
		size: { width: 860, height: 560 },
		maximized: false,
		zIndex: 0,
	},
	{
		id: uniqueId(),
		title: "Settings",
		slug: "settings",
		iconName: "settings",
		isFavorite: true,
		isOpen: false,
		app: Settings,
		isMinimized: false,
		position: { ...DEFAULT_POSITION },
		size: { width: 860, height: 580 },
		maximized: false,
		zIndex: 0,
	},
];

export const appApps = createSlice({
	name: "allApps",
	initialState,
	reducers: {
		openApp: (state, action: PayloadAction<string>) => {
			const findApp = state.find((app) => app.id === action.payload);
			if (findApp) {
				const wasOpen = findApp.isOpen;
				findApp.isOpen = true;
				findApp.isMinimized = false;
				const zIndexes = state
					.filter((app) => app.isOpen && !app.isMinimized)
					.map((app) => app.zIndex);
				findApp.zIndex = (max(zIndexes) || 0) + 1;

				// Only cascade on FRESH open, not when restoring a minimized window
				if (!wasOpen) {
					const openCount = state.filter((app) => app.isOpen).length;
					const offset = (openCount - 1) * 30;
					findApp.position = {
						x: DEFAULT_POSITION.x + offset,
						y: DEFAULT_POSITION.y + offset,
					};
				}
			}
		},
		openAppByTitle: (state, action: PayloadAction<string>) => {
			const findApp = state.find((app) => app.slug === action.payload);
			if (findApp) {
				findApp.isOpen = true;
				findApp.isMinimized = false;
			}
		},
		closeApp: (state, action: PayloadAction<string>) => {
			const appToClose = state.find((app) => app.id === action.payload);
			if (appToClose) {
				if (appToClose.canSpawn && !appToClose.isFavorite) {
					// Remove spawned instances from state entirely
					const idx = state.findIndex((a) => a.id === action.payload);
					if (idx !== -1) state.splice(idx, 1);
					return;
				}
				appToClose.isOpen = false;
				appToClose.maximized = false;
				appToClose.position = { ...DEFAULT_POSITION };
				appToClose.size = { ...DEFAULT_SIZE };
				appToClose.zIndex = 0;
			}
		},
		minimizeApp: (state, action: PayloadAction<string>) => {
			const appToMinimize = state.find((app) => app.id === action.payload);
			if (appToMinimize) {
				appToMinimize.isMinimized = true;
			}
		},
		changePosition: (
			state,
			action: PayloadAction<{ id: string; position: { x: number; y: number } }>,
		) => {
			const appToChange = state.find((app) => app.id === action.payload.id);
			if (appToChange) {
				appToChange.position = action.payload.position;
			}
		},
		changeSize: (
			state,
			action: PayloadAction<{
				id: string;
				size: { width: number; height: number };
				position: { x: number; y: number };
			}>,
		) => {
			const appToChange = state.find((app) => app.id === action.payload.id);
			if (appToChange) {
				appToChange.size = action.payload.size;
				appToChange.position = action.payload.position;
			}
		},
		maximizeApp: (state, action: PayloadAction<string>) => {
			const appToMaximize = state.find((app) => app.id === action.payload);
			if (appToMaximize) {
				appToMaximize.maximized = !appToMaximize.maximized;
			}
		},
		zIndexApp: (state, action: PayloadAction<string>) => {
			const appToChange = state.find((app) => app.id === action.payload);
			if (appToChange) {
				const zIndexes = state
					.filter((app) => app.isOpen && !app.isMinimized)
					.map((app) => app.zIndex);
				const maxZIndex = max(zIndexes) || 0;
				appToChange.zIndex = maxZIndex + 1;
			}
		},
		spawnApp: (state, action: PayloadAction<string>) => {
			const source = state.find((app) => app.id === action.payload);
			if (!source) return;
			const existingCount = state.filter((a) => a.slug === source.slug).length;
			const zIndexes = state
				.filter((app) => app.isOpen && !app.isMinimized)
				.map((app) => app.zIndex);
			const newApp: AllAppsState = {
				...source,
				id: uniqueId(),
				title: `${source.title} (${existingCount + 1})`,
				isFavorite: false,
				isOpen: true,
				isMinimized: false,
				maximized: false,
				position: {
					x: source.position.x + 40,
					y: source.position.y + 40,
				},
				size: { ...source.size },
				zIndex: (max(zIndexes) || 0) + 1,
			};
			state.push(newApp);
		},
		toggleFavorite: (state, action: PayloadAction<string>) => {
			const app = state.find((a) => a.id === action.payload);
			if (app) {
				app.isFavorite = !app.isFavorite;
			}
		},
	},
});

export const {
	closeApp,
	openApp,
	minimizeApp,
	changePosition,
	changeSize,
	maximizeApp,
	openAppByTitle,
	zIndexApp,
	spawnApp,
	toggleFavorite,
} = appApps.actions;
export default appApps.reducer;
