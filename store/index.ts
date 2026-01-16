import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import reducer, { RootState } from "./reducers";

const makeStore = () => {
  return configureStore({
    reducer,
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type { RootState };
export type AppDispatch = AppStore["dispatch"];
export type NextThunkDispatch = ThunkDispatch<RootState, void, AnyAction>;

export const wrapper = createWrapper<AppStore>(makeStore, { debug: true });
