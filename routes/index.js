import express from "express";
const router = express.Router();

// import model from "../model/index.js";

/* GET home page. */
router.get("/", async function (req, res) {
  res.send("Server running 🚀");
});

export default router;
