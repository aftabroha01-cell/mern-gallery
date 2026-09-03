import { useEffect, useCallback } from "react";
export default function Viewer({
  images, currentIndex, onClose, onNavigate, onDelete, onToggleFavorite, onEdit,
}) {
  const total = images.length;
  const current = images[currentIndex];
  const goNext = useCallback(() => {
    onNavigate((currentIndex + 1) % total);
  }, [currentIndex, total, onNavigate]);
  const goPrev = useCallback(() => {
    onNavigate((currentIndex - 1 + total) % total);
  }, [currentIndex, total, onNavigate]);
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, goNext, goPrev]);
  if (!current) return null;
  return (
    <div className="viewer-backdrop" onClick={onClose}>
      <div className="viewer-modal" onClick={(e) => e.stopPropagation()}>
        <button className="viewer-close" onClick={onClose} aria-label="Close viewer">
          &times;
        </button>
        <button className="viewer-nav viewer-prev" onClick={goPrev} aria-label="Previous image">
          &lsaquo;
        </button>
        <img src={current.imageUrl} alt={current.title || "Gallery image"} className="viewer-image" />
        <button className="viewer-nav viewer-next" onClick={goNext} aria-label="Next image">
          &rsaquo;
        </button>
        <div className="viewer-footer">
          <div>
            <div className="viewer-filename">
              {current.title || "Untitled image"}
              <button
                className={`favorite-btn inline ${current.isFavorite ? "active" : ""}`}
                onClick={() => onToggleFavorite(current._id, !current.isFavorite)}
                aria-label={current.isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                {current.isFavorite ? "\u2605" : "\u2606"}
              </button>
            </div>
            {current.description && (
              <div className="viewer-description">{current.description}</div>
            )}
            {current.tags && current.tags.length > 0 && (
              <div className="tile-tags">
                {current.tags.map((tag) => (
                  <span className="tag-chip" key={tag}>{tag}</span>
                ))}
              </div>
            )}
            <div className="viewer-meta">
              Image {currentIndex + 1} of {total} &middot; use &lsaquo; Previous / Next &rsaquo; or arrow keys
            </div>
          </div>
          <div className="viewer-actions">
            <button className="viewer-edit" onClick={() => onEdit(current)}>
              Edit
            </button>
            <button className="viewer-delete" onClick={() => onDelete(current._id)}>
              Delete
            </button>
          </div>
        </div>
        <div className="viewer-dots">
          {images.map((_, i) => (
            <span
              key={i}
              className={`dot ${i === currentIndex ? "active" : ""}`}
              onClick={() => onNavigate(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
