import axios from "axios";

export const savePin = async (pinId) => {
  const token = localStorage.getItem("token");
  const response = await axios.patch(
    `${import.meta.env.VITE_BASE_URL}/user/savePin`,
    { pinId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const unSavePin = async (pinId) => {
  const token = localStorage.getItem("token");
  const response = await axios.patch(
    `${import.meta.env.VITE_BASE_URL}/user/unSavePin`,
    { pinId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};
