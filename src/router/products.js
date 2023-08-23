const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
    res.status(200).send({
        message: "GET: all good"
    });
});

router.post("/", (req, res, next) => {
    res.status(200).send({
        message: "POST: all good"
    });
});

module.exports = router;