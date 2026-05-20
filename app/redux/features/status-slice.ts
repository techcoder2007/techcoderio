import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface StatusState {
	soundLevel: number;
	brightnessLevel: number;
}

const initialState = {
	soundLevel: 50,
	brightnessLevel: 100,
} as StatusState;

const clampPercent = (value: number, min = 0) =>
	Math.min(100, Math.max(min, value));

export const status = createSlice({
	name: "status",
	initialState,
	reducers: {
		setSoundLevel: (state, action: PayloadAction<number>) => {
			state.soundLevel = clampPercent(action.payload);
		},

		setBrightnessLevel: (state, action: PayloadAction<number>) => {
			state.brightnessLevel = clampPercent(action.payload, 10);
		},
	},
});

export const { setBrightnessLevel, setSoundLevel } = status.actions;
export default status.reducer;
