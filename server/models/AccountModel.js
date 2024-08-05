const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    accountName: {
      type: String,
      unique: true,
      required: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    includeInTotal: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const accountModel = mongoose.model("accounts", accountSchema);
module.exports = accountModel;
