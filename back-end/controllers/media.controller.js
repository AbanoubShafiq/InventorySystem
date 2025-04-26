const { uploadImage } = require("../utils/media.utils");
const express = require("express");
const router = express.Router();

router.post("/upload", async (req, res,next) => {
  try {
    if (!req.files || !req.files.imageUrls) {
      return res.status(400).json({ error: "No files were uploaded" });
    }

    const uploadedFiles = Array.isArray(req.files.imageUrls) ? req.files.imageUrls : [req.files.imageUrls];

    const uploadedImages = await Promise.all(uploadedFiles.map(file => uploadImage(file)));

    res.status(200).json({ success: true, imageUrls: uploadedImages });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
