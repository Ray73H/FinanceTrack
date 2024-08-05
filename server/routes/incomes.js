const router = require("express").Router();
const incomeModel = require("../models/IncomeModel");
const accountModel = require("../models/AccountModel");

router.route("/add").post(async (req, res) => {
  const { userId, accountId, amount, source, date } = req.body;

  const parseAmount = parseFloat(parseFloat(amount).toFixed(2));
  const newIncome = new incomeModel({
    userId,
    accountId,
    source,
    amount: parseAmount,
    date,
  });

  try {
    await newIncome.save();
    const account = await accountModel.findById(accountId);
    account.balance = parseFloat(account.balance + parseAmount).toFixed(2);
    await account.save();
    res.json("Income added and account updated");
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

// Get income sorted by date
router.route("/:userId").get((req, res) => {
  incomeModel
    .find({ userId: req.params.userId })
    .sort({ date: -1 })
    .then((incomes) => res.json(incomes))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/update/:id").post(async (req, res) => {
  const { accountId, source, amount, date, oldAmount, updateAccount } =
    req.body;
  const parseAmount = parseFloat(parseFloat(amount).toFixed(2));
  try {
    await incomeModel.findByIdAndUpdate(req.params.id, {
      accountId,
      source,
      amount: parseAmount,
      date,
    });
    if (updateAccount) {
      const account = await accountModel.findById(accountId);
      account.balance = parseFloat(
        account.balance - oldAmount + parseAmount
      ).toFixed(2);
      await account.save();
      res.json("Income and account updated");
    } else {
      res.json("Income updated");
    }
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

router.route("/:id").delete(async (req, res) => {
  const { accountId, amount } = req.query;
  try {
    await incomeModel.findByIdAndDelete(req.params.id);
    const account = await accountModel.findById(accountId);
    account.balance = parseFloat(account.balance - amount).toFixed(2);
    await account.save();
    res.json("Income deleted and account updated");
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

module.exports = router;
