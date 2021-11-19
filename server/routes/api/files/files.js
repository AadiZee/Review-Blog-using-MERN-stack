const express = require("express");
const multer = require("multer");
const formidableMiddleware = require("express-formidable");
const path = require("path");

let router = express.Router();
require("dotenv").config();

///Cloudinary Config
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "reacttestupload",
  api_key: "154299696683169",
  api_secret: `${process.env.CN_API_SECRET}`,
});

//Multer Config

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    console.log(file);
    // cb(null, file.originalname);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });
//////

router.route("/multerupload").post(upload.single("file"), async (req, res) => {
  try {
    res.status(200).json({ message: "Upload Complete" });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.route("/testupload").post(formidableMiddleware(), async (req, res) => {
  try {
    /// req.files.file.path
    const upload = await cloudinary.uploader.upload(req.files.file.path, {
      public_id: `${Date.now()}`,
      folder: "test_upload",
    });

    console.log(upload);

    res.status(200).json({ public_id: upload.public_id, url: upload.url });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
