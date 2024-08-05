import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import Auth from "./Auth";
import Dashboard from "./Dashboard";
import Accounts from "./Accounts";
import Income from "./Income";
import Expenses from "./Expenses";
import Transfer from "./Transfer";
import Budget from "./Budget";
import Goals from "./Goals";
import Menu from "./Menu";

function App() {
  const drawerWidth = 240;
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === "/login";

  const [open, setOpen] = React.useState(true);
  const [userId, setUserId] = React.useState("");
  const [login, setLogin] = React.useState(false);

  useEffect(() => {
    const ID = localStorage.getItem("userId");
    if (ID) {
      setUserId(ID);
    } else {
      navigate("/login");
    }
  }, [login]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <div>
      {!isLoginPage && (
        <Menu
          open={open}
          drawerWidth={drawerWidth}
          handleDrawerToggle={handleDrawerToggle}
        />
      )}
      <Routes>
        <Route path="/login" element={<Auth setLogin={setLogin} />} />
        <Route
          path="/dashboard"
          element={
            <Dashboard open={open} drawerWidth={drawerWidth} userId={userId} />
          }
        />
        <Route
          path="/accounts"
          element={
            <Accounts open={open} drawerWidth={drawerWidth} userId={userId} />
          }
        />
        <Route
          path="/income"
          element={
            <Income open={open} drawerWidth={drawerWidth} userId={userId} />
          }
        />
        <Route
          path="/expenses"
          element={
            <Expenses open={open} drawerWidth={drawerWidth} userId={userId} />
          }
        />
        <Route
          path="/transfer"
          element={<Transfer open={open} drawerWidth={drawerWidth} />}
        />
        <Route
          path="/budget"
          element={<Budget open={open} drawerWidth={drawerWidth} />}
        />
        <Route
          path="/goals"
          element={<Goals open={open} drawerWidth={drawerWidth} />}
        />

        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
