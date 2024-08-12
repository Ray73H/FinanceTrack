require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userModel = require("./models/UserModel");
const admin = require("firebase-admin");

const serviceAccount = {
  type: "service_account",
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY
    ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
    : null,
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  auth_uri: process.env.GOOGLE_AUTH_URI,
  token_uri: process.env.GOOGLE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
  universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
