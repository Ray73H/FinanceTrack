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
import { useNavigate } from "react-router-dom";

const Login = ({ setLogin }) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorDialog, setErrorDialog] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${apiUrl}/login`, { email, password })
      .then((result) => {
        console.log(result);
        if (result.data.message === "Success") {
          localStorage.setItem("userId", result.data.userId);
          setLogin(true);
          navigate("/dashboard");
        } else {
          setErrorDialog(true);
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <form onSubmit={handleSubmit}>
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

const Register = ({ onRegister }) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${apiUrl}/register`, { name, email, password })
      .then((result) => {
        console.log(result);
        navigate("/dashboard");
      })
      .catch((error) => console.log(error));
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
            />
          )}
          {tab === 1 && <Register />}
        </Box>
      </Box>
    </Container>
  );
};

export default Auth;
