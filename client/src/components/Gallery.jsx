function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
}
export default function Gallery({ images, onOpen, onDelete, onToggleFavorite, onEdit }) {
  return (
    <div className="gallery-grid">
      {images.map((image, index) => (
        <div className="gallery-tile" key={image._id}>
          <img
            src={image.imageUrl}
            alt={image.title || `Gallery item ${index + 1}`}
            onClick={() => onOpen(index)}
          />
          <button
            className={`favorite-btn ${image.isFavorite ? "active" : ""}`}
            title={image.isFavorite ? "Remove from favorites" : "Add to favorites"}
            aria-label={image.isFavorite ? "Remove from favorites" : "Add to favorites"}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(image._id, !image.isFavorite);
            }}
          >
            {image.isFavorite ? "\u2605" : "\u2606"}
          </button>
          <button
            className="delete-btn"
            title="Delete image"
            aria-label="Delete image"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(image._id);
            }}
          >
            Delete
          </button>
          <div className="tile-body">
            <div className="tile-title-row">
              <span className="tile-title">{image.title || "Untitled image"}</span>
              <button
                className="tile-edit-btn"
                aria-label="Edit image details"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(image);
                }}
              >
                Edit
              </button>
            </div>
            {image.description && <p className="tile-description">{image.description}</p>}
            {image.tags && image.tags.length > 0 && (
              <div className="tile-tags">
                {image.tags.map((tag) => (
                  <span className="tag-chip" key={tag}>{tag}</span>
                ))}
              </div>
            )}
            <span className="upload-date">uploaded {formatDate(image.createdAt)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}