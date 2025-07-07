import { AppDispatch, AppState } from "..";
import { AuthAction } from "../slices/auth-slice";

export const setUserAvatar = (url: string | undefined) => {
  return async (dispatch: AppDispatch, getState: () => AppState) => {
    const user = getState().auth.user;

    if (user) {
      dispatch(
        AuthAction.setUser({
          ...user,
          avatar_url: url,
        })
      );
    }
  };
};
