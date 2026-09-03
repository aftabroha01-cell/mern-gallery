import { useRef, useState } from "react";
export default function UploadForm({ onUpload, imageCount }) {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  function handleFileChange(e) {
    const file = e.target.files[0];
    setSelectedFile(file || null);
    setError("");
  }
  async function handleUploadClick() {
    if (!selectedFile) {
      setError("Please choose an image first.");
      return;
    }
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    setIsUploading(true);
    setProgress(0);
    setError("");
    try {
      await onUpload({ file: selectedFile, title, description, tags }, setProgress);
      setSelectedFile(null);
      setTitle("");
      setDescription("");
      setTags("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(err?.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  }
  return (
    <div className="upload-bar">
      <div className="upload-row">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="file-input"
          disabled={isUploading}
        />
        <span className="image-count">{imageCount} images in gallery</span>
      </div>
      <div className="upload-row">
        <input
          type="text"
          placeholder="Title (required)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-input"
          maxLength={80}
          disabled={isUploading}
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="text-input"
          maxLength={240}
          disabled={isUploading}
        />
        <input
          type="text"
          placeholder="Tags, comma separated (max 5)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="text-input"
          disabled={isUploading}
        />
        <button className="upload-btn" onClick={handleUploadClick} disabled={isUploading}>
          {isUploading ? `Uploading... ${progress}%` : "Upload"}
        </button>
      </div>
      {isUploading && (
        <div
          className="progress-track"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      )}
      {error && <span className="upload-error">{error}</span>}
    </div>
  );
}
