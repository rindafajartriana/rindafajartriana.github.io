import { persistReducer, persistStore } from "redux-persist";
import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { combinedMiddleware, combinedReducer } from "./redux-collection";
import { encryptTransform } from "redux-persist-transform-encrypt";

const encryptor = encryptTransform({
  secretKey: `${import.meta.env.VITE_REACT_APP_SECRET_KEY}`,
  onError: function (error) {
    //console.log(error)
  },
})

const persistConfig = {
  key: "root",
  version: 1,
  whitelist: ["signIn"],
  storage,
  transforms: [encryptor],
}

const persistedReducer = persistReducer(persistConfig, combinedReducer); // Create a new reducer with our existing reducer

export const store = configureStore({
  reducer: persistedReducer,
  devTools: import.meta.env.VITE_REACT_APP_MODE === "DEVELOPMENT",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(combinedMiddleware),
});

export const persistor = persistStore(store)