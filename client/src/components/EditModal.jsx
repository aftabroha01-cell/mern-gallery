import { useState } from "react";

export default function EditModal({ image, onSave, onCancel }) {
  const [title, setTitle] = useState(image.title || "");
  const [description, setDescription] = useState(image.description || "");
  const [tags, setTags] = useState(
    Array.isArray(image.tags) ? image.tags.join(", ") : image.tags || ""
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      const tagArray = tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      await onSave(image._id, { title, description, tags: tagArray });
    } catch (err) {
      setError(err.message || "Failed to update image details.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="confirm-backdrop" onClick={onCancel}>
      <div
        className="confirm-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "450px", width: "90%" }}
      >
        <h3>Edit Image Details</h3>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "12px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "12px", color: "#a0aec0" }}>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={80}
              placeholder="Enter title"
              style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #4a5568", background: "#2d3748", color: "#fff" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "12px", color: "#a0aec0" }}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={240}
              rows={3}
              placeholder="Enter description"
              style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #4a5568", background: "#2d3748", color: "#fff", resize: "none" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "12px", color: "#a0aec0" }}>Tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="nature, travel, sunset"
              style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #4a5568", background: "#2d3748", color: "#fff" }}
            />
            <small style={{ fontSize: "11px", color: "#a0aec0" }}>Use up to five short tags.</small>
          </div>

          <div className="confirm-actions" style={{ marginTop: "8px" }}>
            <button type="button" className="btn-cancel" onClick={onCancel} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="upload-btn" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}