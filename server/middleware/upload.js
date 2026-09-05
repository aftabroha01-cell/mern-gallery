import { useRef, useState } from "react";

export default function UploadForm({ onUploaded }) {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError("");
    }
  }

  async function handleUploadClick() {
    if (!selectedFile) {
      setError("Please choose an image first.");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      await onUploaded(selectedFile);
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(err?.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="upload-container">
      {/* Upload Top Bar */}
      <div className="upload-top-bar">
        <div className="file-input-wrapper">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            id="file-upload"
            className="hidden-file-input"
          />
          <label htmlFor="file-upload" className="custom-file-label">
            {selectedFile ? selectedFile.name : "Choose an image..."}
          </label>
        </div>
        <button
          className="btn-upload"
          onClick={handleUploadClick}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {/* Selected Preview Box */}
      {selectedFile && previewUrl && (
        <div className="preview-card">
          <div className="preview-image-box">
            <img src={previewUrl} alt="Selected preview" />
          </div>
          <div className="preview-info">
            <h4>Selected preview</h4>
            <p className="file-meta">
              {selectedFile.name} • {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type}
            </p>
            <div className="progress-bar-container">
              <div className={`progress-bar ${isUploading ? "animating" : ""}`}></div>
            </div>
            <p className="status-text">
              {isUploading ? "Uploading to express storage service..." : "Ready to upload"}
            </p>
          </div>
        </div>
      )}

      {error && <div className="banner-error">{error}</div>}
    </div>
  );
}