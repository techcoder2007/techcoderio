import { combineReducers } from "@reduxjs/toolkit";

import statusSlice from "./features/status-slice";
import backgroundImage from "./features/background-image-slice";
import allApps from "./features/all-apps-slice";

const rootReducer = combineReducers({
	status: statusSlice,
	backgroundImage: backgroundImage,
	allApps: allApps,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
