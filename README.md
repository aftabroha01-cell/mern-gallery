# MERN Gallery Application
University of Gujrat • Hayyatian Computing Society

A full-stack MERN application that allows users to upload, view, slide through, and delete images with permanent storage in MongoDB.

## Screenshots

### 1. Gallery Grid
![Gallery Grid](./screenshots/grid.png)

### 2. Upload Step
![Upload Step](./screenshots/upload.png)

### 3. Image Viewer (Modal)
![Image Viewer](./screenshots/viewer.png)

### 4. Slider / Navigation
![Slider](./screenshots/slider.png)

### 5. Delete Action
![Delete Action](./screenshots/delete.png)

---

## Technologies Used
- **Frontend:** React, Vite, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **File Handling:** Multer (Local disk storage)

## API Endpoints
- `GET /api/images` - Fetch all images (newest first)
- `POST /api/images` - Upload a new image (multipart/form-data)
- `DELETE /api/images/:id` - Delete an image by ID and remove file from disk

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB running locally on `mongodb://127.0.0.1:27017`

### Backend Setup
1. Navigate to server folder: `cd server`
2. Install dependencies: `npm install`
3. Start the server: `node server.js`
(Runs on `http://localhost:5000`)

### Frontend Setup
1. Open a new terminal and navigate to client folder: `cd client`
2. Install dependencies: `npm install`
3. Start Vite dev server: `npm run dev`
(Runs on `http://localhost:5173`)