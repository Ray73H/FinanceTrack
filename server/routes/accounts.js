const router = require("express").Router();
const accountModel = require("../models/AccountModel");
const incomeModel = require("../models/IncomeModel");
const expenseModel = require("../models/ExpenseModel");

router.route("/add").post((req, res) => {
  const { userId, accountName, balance } = req.body;

  const parseAmount = parseFloat(parseFloat(balance).toFixed(2));
  const newAccount = new accountModel({
    userId,
    accountName,
    balance: parseAmount,
  });

  newAccount
    .save()
    .then(() => res.json("Account added"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:userId").get((req, res) => {
  accountModel
    .find({ userId: req.params.userId })
    .then((accounts) => res.json(accounts))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").delete((req, res) => {
  accountModel
    .findByIdAndDelete(req.params.id)
    .then(() => {
      return incomeModel.deleteMany({ accountId: req.params.id });
    })
    .then(() => {
      return expenseModel.deleteMany({ accountId: req.params.id });
    })
    .then(() => res.json("Account deleted. Income and expenses deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/update/:id").post((req, res) => {
  const parseAmount = parseFloat(parseFloat(req.body.balance).toFixed(2));
  accountModel
    .findByIdAndUpdate(req.params.id, {
      accountName: req.body.accountName,
      balance: parseAmount,
      includeInTotal: req.body.includeInTotal,
    })
    .then(() => res.json("Account updated"))
    .catch((err) => res.status(400).json("Error: " + err));
});

// NOT USED
router.route("/:id").get((req, res) => {
  accountModel
    .findById(req.params.id)
    .then((account) => res.json(account))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
