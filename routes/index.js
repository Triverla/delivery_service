const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function(req, res) {
	res.status(200).send({ title: "Order Delivery API" });
});

exports.default = router;