import { combineReducers } from "redux";
import { playerReducer } from "./playerReducer";
import { HYDRATE } from "next-redux-wrapper";
import { trackReducer } from "./trackReducer";

const rootReducer = combineReducers({
  player: playerReducer,
  track: trackReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

// Wrapper reducer to handle next-redux-wrapper HYDRATE action.
// Merge server (payload) and client (state) values in a safe way.
/* eslint-disable @typescript-eslint/no-explicit-any */
const reducer = (state: RootState | undefined, action: unknown) => {
  if ((action as any).type === HYDRATE) {
    const nextState = {
      ...(state ?? {}),
      ...(action as any).payload,
    };
    return nextState;
  }

  return rootReducer(state, action as any);
};
/* eslint-enable @typescript-eslint/no-explicit-any */

export default reducer;
