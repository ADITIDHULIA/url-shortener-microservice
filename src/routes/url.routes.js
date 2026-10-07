// Only Routing.. No logic

const express = require("express");
const router = express.Router();
const controller = require('../controllers/url.controller');

router.post("/shorten", controller.shortenUrl);

router.get("/analytics/:code", controller.getAnalytics);

router.get("/:code", controller.redirectUrl);

module.exports = router;