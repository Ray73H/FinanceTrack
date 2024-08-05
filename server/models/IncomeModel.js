const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "accounts",
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    source: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const incomeModel = mongoose.model("incomes", incomeSchema);
module.exports = incomeModel;
