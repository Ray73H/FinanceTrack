require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userModel = require("./models/UserModel");

const app = express();
app.use(express.json());
app.use(cors());

const uri = process.env.DATABASE_URI;

mongoose
  .connect(uri)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const usersRouter = require("./routes/users");
const accountsRouter = require("./routes/accounts");
const incomesRouter = require("./routes/incomes");
const expensesRouter = require("./routes/expenses");
const categoriesRouter = require("./routes/categories");
app.use("/users", usersRouter);
app.use("/accounts", accountsRouter);
app.use("/incomes", incomesRouter);
app.use("/expenses", expensesRouter);
app.use("/categories", categoriesRouter);

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  userModel.findOne({ email: email }).then((user) => {
    if (user) {
      if (user.password === password) {
        res.json({ message: "Success", userId: user._id });
      } else {
        res.json("Password incorrect");
      }
    } else {
      res.json("User not found");
    }
  });
});

app.post("/register", (req, res) => {
  userModel
    .create(req.body)
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
});

app.listen(3001, () => {
  console.log("Server is running");
});
