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
  getUser,
  getAllUsers,
  getAllMembers,
  addUser,
  updateUser,
  deleteUser,
  resetPassword
} = require('../controllers/userController')

router.get("/getAll", (req, res) => getAllUsers(req, res))

router.get("/getAllMembers", (req, res) => getAllMembers(req, res))

router.get("/get/:id", (req, res) => getUser(req, res))

router.post("/add", uplaod.single('photoUrl'), (req, res) => addUser(req, res))

router.patch("/update/:id", uplaod.single('photoUrl'), (req, res) => updateUser(req, res))

router.patch("/reset/:id", (req, res) => resetPassword(req, res))

router.delete("/delete/:id", (req, res) => deleteUser(req, res))

module.exports = router;
