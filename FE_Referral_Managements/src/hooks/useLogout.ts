// // src/hooks/useLogout.ts
// import { useNavigate } from "react-router-dom";
// import { useAppDispatch } from "./useAppDispatch";
// import { logoutUserThunk } from "../features/auth/logoutUserThunk";

// export const useLogout = () => {
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();

//   const logoutUser = async (redirectTo: string = "/login") => {
//     await dispatch(logoutUserThunk());
//     navigate(redirectTo);
//   };

//   return logoutUser;
// };
