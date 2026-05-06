import axios from "axios";

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const res = await axios.post("http://localhost:5001/api/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.data.url;
};