import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type SettingsSection =
	| "appearance"
	| "sound"
	| "displays"
	| "network"
	| "about";
export type ThemeMode = "light" | "dark";
export type AccentColor =
	| "ubuntu"
	| "blue"
	| "green"
	| "purple"
	| "red"
	| "teal";
export type FontFamily =
	| "noto-mono"
	| "system"
	| "ubuntu"
	| "cantarell"
	| "dejavu"
	| "liberation";

interface SettingsState {
	section: SettingsSection;
	theme: ThemeMode;
	accentColor: AccentColor;
	fontFamily: FontFamily;
}

const initialState: SettingsState = {
	section: "appearance",
	theme: "dark",
	accentColor: "ubuntu",
	fontFamily: "noto-mono",
};

export const settingsSlice = createSlice({
	name: "settings",
	initialState,
	reducers: {
		setSettingsSection: (state, action: PayloadAction<SettingsSection>) => {
			state.section = action.payload;
		},
		setTheme: (state, action: PayloadAction<ThemeMode>) => {
			state.theme = action.payload;
		},
		setAccentColor: (state, action: PayloadAction<AccentColor>) => {
			state.accentColor = action.payload;
		},
		setFontFamily: (state, action: PayloadAction<FontFamily>) => {
			state.fontFamily = action.payload;
		},
	},
});

export const { setSettingsSection, setTheme, setAccentColor, setFontFamily } =
	settingsSlice.actions;
export default settingsSlice.reducer;
