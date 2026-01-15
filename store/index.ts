import { createWrapper } from "next-redux-wrapper";
import { AnyAction, applyMiddleware, createStore } from "redux";
import reducer, { RootState } from "./reducers";
import { thunk, ThunkDispatch } from "redux-thunk";

const makeStore = () => createStore(reducer, applyMiddleware(thunk));

// Provide the RootState generic so next-redux-wrapper typings work for getServerSideProps
export const wrapper = createWrapper(makeStore);

export type NextThunkDispatch = ThunkDispatch<RootState, void, AnyAction>;
