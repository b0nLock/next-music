import { combineReducers } from "redux";
import { playerReducer } from "./playerReducer";
import { HYDRATE } from "next-redux-wrapper";
import { trackReducer } from "./trackReducer";

export const rootReducer = combineReducers({
  player: playerReducer,
  track: trackReducer
});

// Wrapper reducer to handle next-redux-wrapper HYDRATE action.
// Merge server (payload) and client (state) values in a safe way.
/* eslint-disable @typescript-eslint/no-explicit-any */
const reducer = (
  state: ReturnType<typeof rootReducer> | undefined,
  action: unknown
) => {
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

export type RootState = ReturnType<typeof rootReducer>;
export default reducer;
