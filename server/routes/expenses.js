const router = require("express").Router();
const expenseModel = require("../models/ExpenseModel");
const accountModel = require("../models/AccountModel");

router.route("/add").post(async (req, res) => {
  const { userId, accountId, amount, expense, categoryId, date } = req.body;

  const parseAmount = parseFloat(parseFloat(amount).toFixed(2));
  const newExpense = new expenseModel({
    userId,
    accountId,
    amount: parseAmount,
    expense,
    categoryId,
    date,
  });

  try {
    await newExpense.save();
    const account = await accountModel.findById(accountId);
    account.balance = parseFloat(account.balance - parseAmount).toFixed(2);
    await account.save();
    res.json("Expense added and account updated");
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

// Get expenses sorted by date
router.route("/:userId").get((req, res) => {
  expenseModel
    .find({ userId: req.params.userId })
    .sort({ date: -1 })
    .then((expenses) => res.json(expenses))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/update/:id").post(async (req, res) => {
  const {
    accountId,
    amount,
    date,
    expense,
    categoryId,
    oldAmount,
    updateAccount,
  } = req.body;
  const parseAmount = parseFloat(parseFloat(amount).toFixed(2));
  try {
    await expenseModel.findByIdAndUpdate(req.params.id, {
      accountId,
      amount: parseAmount,
      date,
      expense,
      categoryId,
    });
    if (updateAccount) {
      const account = await accountModel.findById(accountId);
      account.balance = parseFloat(
        account.balance + oldAmount - parseAmount
      ).toFixed(2);
      await account.save();
      res.json("Expense and account updated");
    } else {
      res.json("Expense updated");
    }
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

router.route("/:id").delete(async (req, res) => {
  const { accountId, amount } = req.query;
  try {
    await expenseModel.findByIdAndDelete(req.params.id);
    const account = await accountModel.findById(accountId);
    account.balance = parseFloat(account.balance + amount).toFixed(2);
    await account.save();
    res.json("Expense deleted and account updated");
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

module.exports = router;
