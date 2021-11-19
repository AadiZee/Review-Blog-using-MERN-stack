import { toast } from "react-toastify";
import cookie from "react-cookies";

export const showToast = (type, message) => {
  switch (type) {
    case "SUCCESS":
      toast.success(message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      break;
    case "ERROR":
      toast.error(message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      break;
    default:
      return false;
  }
};

export const getTokenCookie = () => cookie.load("x-access-token");
export const removeTokenCookie = () =>
  cookie.remove("x-access-token", { path: "/" });
export const getAuthHeader = () => {
  return { headers: { "x-access-token": getTokenCookie() } };
};
