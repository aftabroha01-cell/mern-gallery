import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export async function fetchImages({ search = "", favorite = false, sort = "recent" } = {}) {
  const params = {};
  if (search.trim()) params.search = search.trim();
  if (favorite) params.favorite = "true";
  if (sort) params.sort = sort;
  const res = await axios.get(`${API_URL}/images`, { params });
  return res.data;
}
export async function uploadImage({ file, title, description, tags }, onProgress) {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("title", title);
  formData.append("description", description || "");
  formData.append("tags", tags || "");
  const res = await axios.post(`${API_URL}/images`, formData, {
    onUploadProgress: (evt) => {
      if (onProgress && evt.total) {
        onProgress(Math.round((evt.loaded * 100) / evt.total));
      }
    },
  });
  return res.data;
}
export async function updateImageMetadata(id, { title, description, tags }) {
  const res = await axios.patch(`${API_URL}/images/${id}`, { title, description, tags });
  return res.data;
}
export async function toggleFavorite(id, isFavorite) {
  const res = await axios.patch(`${API_URL}/images/${id}/favorite`, { isFavorite });
  return res.data;
}
export async function deleteImage(id) {
  const res = await axios.delete(`${API_URL}/images/${id}`);
  return res.data;
}