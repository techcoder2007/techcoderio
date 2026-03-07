import { configureStore, type Reducer } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  type PersistConfig,
} from "redux-persist";
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

interface IPersistConfig extends PersistConfig<typeof rootReducer> {}

const persistConfig: IPersistConfig = {
  key: "root",
  storage,
  whitelist: ["status", "backgroundImage"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer as Reducer);

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
