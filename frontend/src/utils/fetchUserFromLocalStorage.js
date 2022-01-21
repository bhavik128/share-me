export const fetchUserFromLocalStorage = () => {
  return localStorage.getItem("user") !== "undefined"
    ? JSON.parse(localStorage.getItem("user"))
    : null;
};
