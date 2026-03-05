import { combineReducers } from "@reduxjs/toolkit";
import allApps from "./features/all-apps-slice";
import backgroundImage from "./features/background-image-slice";
import statusSlice from "./features/status-slice";

const rootReducer = combineReducers({
	status: statusSlice,
	backgroundImage: backgroundImage,
	allApps: allApps,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
