const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

// 1. MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/merngallery")
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// 2. Database Schema (Section 6)
const imageSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Image = mongoose.model("Image", imageSchema);

// 3. Section 8.1: Create uploads folder if missing
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 4. Section 8.2: Multer Storage & Filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + ext);
  },
});

// Section 8.2: File Filter (Images Only) & Limits (Max 5MB)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// 5. Section 8.3: Serve Uploads Folder Statically
app.use("/uploads", express.static(uploadsDir));

// 6. Section 5 & 8.4: GET /api/images
app.get("/api/images", async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 7. Section 5 & 8.4: POST /api/images
app.post("/api/images", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded!" });
    }

    const BASE_URL = process.env.BASE_URL || "http://localhost:5000";
    const imageUrl = `${BASE_URL}/uploads/${req.file.filename}`;

    const newImage = new Image({ imageUrl });
    await newImage.save();

    res.status(201).json(newImage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 8. Section 5 & 8.6: DELETE /api/images/:id
app.delete("/api/images/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.Types.ObjectId.isValid(id)) {
      const image = await Image.findById(id);

      if (image && image.imageUrl) {
        // Section 8.6: Remove file from uploads folder
        const filename = image.imageUrl.split("/uploads/")[1];
        if (filename) {
          const filePath = path.join(uploadsDir, filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      }

      // Delete from MongoDB
      await Image.findByIdAndDelete(id);
    }

    res.status(200).json({ message: "Image deleted successfully", id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));