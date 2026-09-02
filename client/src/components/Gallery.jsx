import { useState, useEffect } from "react";

export default function Gallery({ images, onDelete }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const selectedImage = selectedIndex !== null ? images[selectedIndex] : null;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return;
      if (e.key === "ArrowRight") handleNext();
      else if (e.key === "ArrowLeft") handlePrev();
      else if (e.key === "Escape") setSelectedIndex(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, images]);

  const handleNext = () => {
    setSelectedIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  if (!images || images.length === 0) {
    return (
      <div className="gallery-section">
        <h2>Gallery</h2>
        <p className="no-images-text">No images yet — upload your first one above.</p>
      </div>
    );
  }

  return (
    <div className="gallery-section">
      <div className="gallery-header">
        <h2>Gallery</h2>
        <span className="image-count">{images.length} images in gallery</span>
      </div>

      <div className="gallery-grid">
        {images.map((img, index) => {
          const imageSrc = img.imageUrl || img.url || img;
          const imgId = img._id || img.id;

          return (
            <div key={imgId || index} className="gallery-card">
              <div className="img-badge">IMG_{String(index + 1).padStart(3, "0")}</div>
              
              {/* Direct Delete Button */}
              <button
                className="delete-card-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(imgId);
                }}
                title="Delete Image"
              >
                ✕
              </button>

              <img
                src={imageSrc}
                alt=""
                onClick={() => setSelectedIndex(index)}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />

              <div className="card-footer">
                <p>uploaded {img.createdAt ? new Date(img.createdAt).toLocaleDateString() : "recently"}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox / Slider Modal */}
      {selectedImage && (
        <div className="modal-overlay" onClick={() => setSelectedIndex(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedIndex(null)}>
              ✕
            </button>

            <button className="slider-btn prev-btn" onClick={handlePrev}>
              ‹
            </button>

            <div className="modal-img-container">
              <img src={selectedImage.imageUrl || selectedImage.url} alt="" />
              <div className="modal-caption">
                <span>
                  {selectedIndex + 1} of {images.length}
                </span>
              </div>
            </div>

            <button className="slider-btn next-btn" onClick={handleNext}>
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}