const express = require("express");
const fs = require("fs");
const path = require("path");
const Image = require("../models/Image");
const upload = require("../middleware/upload");
const router = express.Router();
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function normalizeTags(rawTags) {
  if (!rawTags) return [];
  const list = Array.isArray(rawTags) ? rawTags : String(rawTags).split(",");
  return list
    .map((t) => String(t).trim().toLowerCase())
    .filter((t) => t.length > 0)
    .slice(0, 5);
}
router.post("/", (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No image file was uploaded." });
    }
    const title = (req.body.title || "").trim();
    const description = (req.body.description || "").trim();
    const tags = normalizeTags(req.body.tags);
    if (!title) {
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({ message: "Title is required." });
    }
    if (title.length > 80) {
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({ message: "Title must be 80 characters or fewer." });
    }
    if (description.length > 240) {
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({ message: "Description must be 240 characters or fewer." });
    }
    try {
      const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
      const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
      const image = await Image.create({ imageUrl, title, description, tags });
      return res.status(201).json(image);
    } catch (dbErr) {
      fs.unlink(req.file.path, () => {});
      return res.status(500).json({
        message: "Failed to save image record.",
        error: dbErr.message,
      });
    }
  });
});
router.get("/", async (req, res) => {
  try {
    const { search, favorite, sort } = req.query;
    const query = {};
    if (favorite === "true") {
      query.isFavorite = true;
    }
    if (search && search.trim()) {
      const safe = escapeRegex(search.trim());
      const regex = new RegExp(safe, "i");
    }
      query.$or = [{ title: regex }, { description: regex }, { tags: regex }];
    const sortOrder = sort === "oldest" ? 1 : -1; // default: recent first
    const images = await Image.find(query).sort({ createdAt: sortOrder });
    return res.json(images);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch images.", error: err.message });
  }
});
router.patch("/:id", async (req, res) => {
  try {
    const updates = {};
    if (req.body.title !== undefined) {
      const title = String(req.body.title).trim();
      if (!title || title.length > 80) {
        return res.status(400).json({ message: "Title must be 1-80 characters." });
      }
      updates.title = title;
    }
    if (req.body.description !== undefined) {
      const description = String(req.body.description).trim();
      if (description.length > 240) {
        return res.status(400).json({ message: "Description must be 240 characters or fewer." });
      }
      updates.description = description;
    }
    if (req.body.tags !== undefined) {
      updates.tags = normalizeTags(req.body.tags);
    }
    const image = await Image.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!image) {
      return res.status(404).json({ message: "Image not found." });
    }
    return res.json(image);
  } catch (err) {
    return res.status(400).json({ message: "Failed to update image.", error: err.message });
  }
});
router.patch("/:id/favorite", async (req, res) => {
  try {
    if (typeof req.body.isFavorite !== "boolean") {
      return res.status(400).json({ message: "isFavorite must be true or false." });
    }
    const image = await Image.findByIdAndUpdate(
      req.params.id,
      { isFavorite: req.body.isFavorite },
      { new: true, runValidators: true }
    );
    if (!image) {
      return res.status(404).json({ message: "Image not found." });
    }
    return res.json(image);
  } catch (err) {
    return res.status(400).json({
      message: "Failed to update favorite state.",
      error: err.message,
    });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const image = await Image.findByIdAndDelete(req.params.id);
    if (!image) {
      return res.status(404).json({ message: "Image not found." });
    }
    const filename = image.imageUrl.split("/uploads/")[1];
    if (filename) {
      const filePath = path.join(upload.UPLOAD_DIR, filename);
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr && unlinkErr.code !== "ENOENT") {
          console.error("Could not delete file:", unlinkErr.message);
        }
      });
    }
    return res.json({ message: "Image deleted.", _id: image._id });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete image.", error: err.message });
  }
});
module.exports = router;
