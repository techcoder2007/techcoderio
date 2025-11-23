import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import rootReducer from "./reducers";

const createNoopStorage = () => {
	return {
		getItem: () => Promise.resolve(null),
		setItem: (_key: string, value: any) => Promise.resolve(value),
		removeItem: () => Promise.resolve(),
	};
};

const storage =
	typeof window !== "undefined"
		? createWebStorage("local")
		: createNoopStorage();

const persistConfig = {
	key: "root",
	storage,
	whitelist: ["status", "backgroundImage"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);

export default store;
