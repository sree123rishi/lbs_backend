// Import required modules
const express = require("express");
app.use(express.cookieParser('your secret option here'));
app.use(express.session());
const router = express.Router();

// Import functions from controller
const {
    getBorrowal,
    getAllBorrowals,
    addBorrowal,
    updateBorrowal,
    deleteBorrowal
} = require('../controllers/borrowalController')

router.get("/getAll", (req, res) => getAllBorrowals(req,res))

router.get("/get/:id", (req, res) => getBorrowal(req, res))

router.post("/add", (req, res) => addBorrowal(req, res))

router.put("/update/:id", (req, res) => updateBorrowal(req, res))

router.delete("/delete/:id", (req, res) => deleteBorrowal(req, res))

module.exports = router;
