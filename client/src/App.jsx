import { useEffect, useState } from "react";
import UploadForm from "./components/UploadForm";
import Gallery from "./components/Gallery";

export default function App() {
  const [images, setImages] = useState([]);

  const fetchImages = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/images");
      const data = await res.json();
      setImages(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUploaded = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    await fetch("http://localhost:5000/api/images", {
      method: "POST",
      body: formData,
    });

    fetchImages();
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/images/${id}`, {
        method: "DELETE",
      });
      fetchImages();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>MERN Gallery</h1>
        <p>University of Gujrat • Hayyatian Computing Society</p>
      </header>

      <UploadForm onUploaded={handleUploaded} />

      <Gallery images={images} onDelete={handleDelete} />
    </div>
  );
}