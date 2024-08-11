import React, { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import axios from "axios";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebase";

const Login = ({ setLogin, loginMessage }) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorDialog, setErrorDialog] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        user.getIdToken().then((idToken) => {
          axios
            .post(`${apiUrl}/login`, { idToken })
            .then((result) => {
              if (result.data.message === "Success") {
                localStorage.setItem("userId", result.data.userId);
                setLogin(true);
              } else {
                setErrorDialog(true);
              }
            })
            .catch((error) => console.log(error));
        });
      })
      .catch((error) => {
        console.log(error);
        setErrorDialog(true);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      {loginMessage ? (
        <Typography mb={2}>Successfully Registered. Please Login.</Typography>
      ) : null}
      <Box mb={2}>
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Box>
      <Box mb={2}>
        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Box>
      {errorDialog ? (
        <Typography mb={2} style={{ color: "red" }}>
          Invalid email or password
        </Typography>
      ) : null}
      <Box>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </Box>
    </form>
  );
};

const Register = ({ setTab }) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const idToken = await user.getIdToken();
        axios
          .post(`${apiUrl}/register`, { idToken, name, email })
          .then(() => {
            setTab();
          })
          .catch((error) => console.error("Error storing user data:", error));
      })
      .catch((error) => {
        console.error("Error during registration:", error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box mb={2}>
        <TextField
          fullWidth
          label="Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Box>
      <Box mb={2}>
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Box>
      <Box mb={2}>
        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Box>
      <Box>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Register
        </Button>
      </Box>
    </form>
  );
};

const Auth = ({ setLogin }) => {
  const [tab, setTab] = useState(0);
  const [loginMessage, setLoginMessage] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Tabs value={tab} onChange={handleTabChange}>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>
        <Box mt={3} width="100%">
          {tab === 0 && (
            <Login
              setLogin={(login) => {
                setLogin(login);
              }}
              loginMessage={loginMessage}
            />
          )}
          {tab === 1 && (
            <Register
              setTab={() => {
                setLoginMessage(true);
                setTab(0);
              }}
            />
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Auth;
