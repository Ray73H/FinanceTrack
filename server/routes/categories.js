const router = require("express").Router();
const categoryModel = require("../models/CategoryModel");

router.route("/add").post((req, res) => {
  const { userId, name } = req.body;

  const newCategory = new categoryModel({
    userId,
    name,
  });
  newCategory
    .save()
    .then(() => res.json("Category added"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").delete((req, res) => {
  categoryModel
    .findByIdAndDelete(req.params.id)
    .then(() => res.json("Category deleted"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:userId").get((req, res) => {
  categoryModel
    .find({ userId: req.params.userId })
    .then((categories) => res.json(categories))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
