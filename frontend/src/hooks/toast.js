import { toast } from "react-toastify";

export const notice = (type, msg, time) => {
  const data = {
    position: "bottom-center",
    autoClose: time,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  };
  if (type === "success") {
    toast.success(msg, data);
  } else if (type === "warn") {
    toast.warn(msg, data);
  } else if (type === "error") {
    toast.error(msg, data);
  } else if (type === "info") {
    toast.info(msg, data);
  } else {
    toast(msg, data);
  }
};
