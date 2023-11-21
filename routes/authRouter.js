// Import required modules
const express = require("express")
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)

  } else {
    cb(null, false)
  }
}

const uplaod = multer({
  storage: storage,
  limits: {
    fileSize: 100000000000
  },
  fileFilter: fileFilter,
});

// Import functions from controller
const {
  loginUser,
  registerUser,
  logoutUser,
} = require('../controllers/authController')

router.post("/login", (req, res) => loginUser(req, res))

router.post("/register", uplaod.single('photoUrl'), (req, res) => registerUser(req, res))

router.get("/logout", (req, res) => logoutUser(req, res))

module.exports = router;
