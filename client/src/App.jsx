import { useEffect, useState, useCallback } from "react";
import UploadForm from "./components/UploadForm.jsx";
import Gallery from "./components/Gallery.jsx";
import Viewer from "./components/Viewer.jsx";
import EditModal from "./components/EditModal.jsx";
import GalleryControls from "./components/GalleryControls.jsx";
import {
  fetchImages, uploadImage, deleteImage, toggleFavorite, updateImageMetadata,
} from "./api.js";

export default function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [sort, setSort] = useState("recent");
  const [viewerIndex, setViewerIndex] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [editingImage, setEditingImage] = useState(null);

  const loadImages = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError("");
      const data = await fetchImages({ search, favorite: favoriteOnly, sort });
      setImages(data);
    } catch (err) {
      setLoadError("Could not load the gallery. Check the server connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [search, favoriteOnly, sort]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadImages();
    }, 300);
    return () => clearTimeout(timer);
  }, [loadImages]);

  async function handleUpload(fields, onProgress) {
    await uploadImage(fields, onProgress);
    await loadImages();
  }

  function requestDelete(id) {
    setPendingDeleteId(id);
  }

  async function confirmDelete() {
    const id = pendingDeleteId;
    setPendingDeleteId(null);
    await deleteImage(id);
    setImages((prev) => prev.filter((img) => img._id !== id));

    setViewerIndex((prevIndex) => {
      if (prevIndex === null) return null;
      const remaining = images.filter((img) => img._id !== id);
      if (remaining.length === 0) return null;
      return Math.min(prevIndex, remaining.length - 1);
    });
  }

  async function handleToggleFavorite(id, next) {
    const updated = await toggleFavorite(id, next);
    setImages((prev) => prev.map((img) => (img._id === id ? updated : img)));
  }

  async function handleSaveEdit(id, fields) {
    const updated = await updateImageMetadata(id, fields);
    setImages((prev) => prev.map((img) => (img._id === id ? updated : img)));
    setEditingImage(null);
  }

  const isFiltering = search.trim().length > 0 || favoriteOnly;

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo-dot" />
        <div>
          <div className="app-title">MERN Gallery</div>
          <div className="app-subtitle">University of Gujrat &middot; Hayyatian Computing Society</div>
        </div>
      </header>

      <UploadForm onUpload={handleUpload} imageCount={images.length} />

      <GalleryControls
        search={search}
        onSearchChange={setSearch}
        favoriteOnly={favoriteOnly}
        onToggleFavoriteOnly={setFavoriteOnly}
        sort={sort}
        onSortChange={setSort}
      />

      <main>
        <h2 className="section-title">Gallery</h2>

        {loading && (
          <div className="skeleton-grid">
            {[1, 2, 3, 4].map((n) => (
              <div className="skeleton-tile" key={n} />
            ))}
          </div>
        )}

        {!loading && loadError && (
          <div className="state-box error-box">
            <p>{loadError}</p>
            <button className="upload-btn" onClick={loadImages}>Retry</button>
          </div>
        )}

        {!loading && !loadError && images.length === 0 && !isFiltering && (
          <div className="state-box">
            <p>No images yet &mdash; upload your first one above.</p>
          </div>
        )}

        {!loading && !loadError && images.length === 0 && isFiltering && (
          <div className="state-box">
            <p>No photos match your search or filter.</p>
            <button
              className="upload-btn"
              onClick={() => {
                setSearch("");
                setFavoriteOnly(false);
              }}
            >
              Clear search &amp; filters
            </button>
          </div>
        )}

        {!loading && !loadError && images.length > 0 && (
          <Gallery
            images={images}
            onOpen={setViewerIndex}
            onDelete={requestDelete}
            onToggleFavorite={handleToggleFavorite}
            onEdit={setEditingImage}
          />
        )}
      </main>

      {viewerIndex !== null && images[viewerIndex] && (
        <Viewer
          images={images}
          currentIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
          onNavigate={setViewerIndex}
          onDelete={requestDelete}
          onToggleFavorite={handleToggleFavorite}
          onEdit={setEditingImage}
        />
      )}

      {editingImage && (
        <EditModal
          image={editingImage}
          onSave={handleSaveEdit}
          onCancel={() => setEditingImage(null)}
        />
      )}

      {pendingDeleteId && (
        <div className="confirm-backdrop" onClick={() => setPendingDeleteId(null)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Delete this image?</h3>
            <p>The record will be removed from MongoDB and the gallery will refresh immediately.</p>
            <code>DELETE /api/images/:id</code>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setPendingDeleteId(null)}>
                Cancel
              </button>
              <button className="btn-delete" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}