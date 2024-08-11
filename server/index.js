require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userModel = require("./models/UserModel");
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(require("./firebase.config.json")),
});

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

app.post("/login", async (req, res) => {
  const { idToken } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const email = decodedToken.email;

    userModel.findOne({ email: email }).then((user) => {
      if (user) {
        res.json({ message: "Success", userId: user._id });
      } else {
        res.status(401).json({ message: "User not found" });
      }
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid token", error: error.message });
  }
});

app.post("/register", async (req, res) => {
  const { idToken, name, email } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userEmail = decodedToken.email;

    // Check if the user already exists
    const existingUser = await userModel.findOne({ email: userEmail });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = await userModel.create({ name, email: userEmail });
    res.json({ message: "User registered", user: newUser });
  } catch (error) {
    res.status(401).json({ message: "Invalid token", error: error.message });
  }
});

app.listen(3001, () => {
  console.log("Server is running");
});
