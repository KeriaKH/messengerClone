const express = require("express");
const router = express.Router();
const upload = require("../cloudinary/index").upload;

router.post("/upload", upload.single("image"), (req, res) => {
  try {
    return res
      .status(200)
      .json({ message: "Upload thành công", imageUrl: req.file.path });
  } catch (error) {
    return res.status(500).json({ message: "Upload thất bại" });
  }
});

router.post("/uploadMultiple", upload.array("images", 10), (req, res) => {
  try {
    const imageUrls = req.files.map((file) => file.path);
    return res.status(200).json({ message: "Upload thành công", imageUrls });
  } catch (error) {
    return res.status(500).json({ message: "Upload thất bại" });
  }
});
module.exports = router;
