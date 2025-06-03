const express = require("express");

const catagoryController = require("../controllers/catagoryController");
const router = express.Router();

router
  .route("/")
  .get(catagoryController.getAllCatagory)
  .post(catagoryController.createCatagory);
router
  .route("/:id")
  .get(catagoryController.getCatagoryById)
  .delete(catagoryController.deleteCatagory);

module.exports = router;
