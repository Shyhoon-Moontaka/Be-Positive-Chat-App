import axios from "axios";
const API = (token) =>
  axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
    headers: { Authorization: token },
  });
export const fetchAllNotifications = async () => {
  try {
    const token = localStorage.getItem("userToken");
    const { data } = await API(token).get("/api/notification");
    return data;
  } catch (error) {
    console.log("error in fetch all notifications api");
  }
};
export const removeNotification = async (Id, userId) => {
  try {
    const token = localStorage.getItem("userToken");
    const { data } = await API(token).delete(
      `/api/notification/${Id}/${userId}`
    );
    return data;
  } catch (error) {
    console.log("error in remove notification api");
  }
};
