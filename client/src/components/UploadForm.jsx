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
      setError("Please select an image first!");
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
    <div className="upload-glass-card">
      {/* Upper Input Area */}
      <div className="file-drop-zone">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          id="file-upload"
          className="hidden-input"
        />
        <label htmlFor="file-upload" className="file-label-btn">
          Choose File
        </label>
        <span className="file-name-text">
          {selectedFile ? selectedFile.name : "No file chosen"}
        </span>
      </div>

      <button
        className="neon-upload-btn"
        onClick={handleUploadClick}
        disabled={isUploading}
      >
        {isUploading ? "Uploading..." : "Upload Image"}
      </button>

      {/* Selected Preview Box */}
      {selectedFile && previewUrl && (
        <div className="selected-preview-card">
          <div className="preview-img-wrapper">
            <img src={previewUrl} alt="Selected preview" />
          </div>
          <div className="preview-details">
            <h4>Selected preview</h4>
            <p className="file-info-line">
              {selectedFile.name} • {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type}
            </p>
            <div className="progress-bar-bg">
              <div className={`progress-bar-fill ${isUploading ? "animating" : ""}`}></div>
            </div>
            <p className="status-msg">
              {isUploading ? "Uploading to storage service..." : "Ready to upload"}
            </p>
          </div>
        </div>
      )}

      {error && <p className="error-text">{error}</p>}
    </div>
  );
}