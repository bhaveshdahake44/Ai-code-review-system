const express = require("express");
const { createReview } = require("../controllers/reviewController");

const router = express.Router();

router.post("/", createReview);

module.exports = router;