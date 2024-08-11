import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  CssBaseline,
  Stack,
  Divider,
} from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import axios from "axios";

function Dashboard({ open, drawerWidth, userId }) {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [accounts, setAccounts] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    // Total Balance
    if (userId) {
      axios.get(`${apiUrl}/accounts/${userId}`).then((result) => {
        setAccounts(result.data);
        let total = 0;
        result.data.forEach((account) => {
          if (account.includeInTotal) {
            total = parseFloat(parseFloat(total + account.balance).toFixed(2));
          }
        });
        setTotalBalance(total);
      });
    }

    // Get Categories
    if (userId) {
      axios.get(`${apiUrl}/categories/${userId}`).then((result) => {
        setCategories(result.data);
      });
    }
  }, [userId]);

  useEffect(() => {
    // Total Income
    if (userId) {
      axios.get(`${apiUrl}/incomes/${userId}`).then((result) => {
        setIncomes(result.data);
        let total = 0;
        result.data.forEach((income) => {
          if (
            accounts.find((account) => account._id === income.accountId)
              ?.includeInTotal
          ) {
            total = parseFloat(parseFloat(total + income.amount).toFixed(2));
          }
        });
        setTotalIncome(total);
      });
    }

    // Total Expense
    if (userId) {
      axios.get(`${apiUrl}/expenses/${userId}`).then((result) => {
        setExpenses(result.data);
        let total = 0;
        result.data.forEach((expense) => {
          if (
            accounts.find((account) => account._id === expense.accountId)
              ?.includeInTotal
          ) {
            total = parseFloat(parseFloat(total + expense.amount).toFixed(2));
          }
        });
        setTotalExpense(total);
      });
    }
  }, [userId, accounts]);

  const getExpenseValue = (categoryId) => {
    let total = 0;
    expenses.forEach((expense) => {
      if (
        accounts.find((account) => account._id === expense.accountId)
          ?.includeInTotal &&
        expense.categoryId === categoryId
      ) {
        total = parseFloat(total + expense.amount).toFixed(2);
      }
    });
    return total;
  };

  const data = categories.map((category, index) => ({
    label: category.name,
    value: getExpenseValue(category._id),
  }));

  return (
    <>
      <CssBaseline />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          marginLeft: open ? `${drawerWidth}px` : 0,
          p: 3,
          mt: 8,
          transition: "margin-left 0.2s",
        }}
      >
        {/* Total Balance */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Paper
            elevation={3}
            sx={{ p: 2, textAlign: "center", width: "100%" }}
          >
            <Typography variant="h5" gutterBottom>
              Total Balance
            </Typography>
            <Typography variant="h3" color="primary">
              ${totalBalance}
            </Typography>
          </Paper>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Paper
            elevation={3}
            sx={{ p: 2, textAlign: "center", flex: 1, mr: 1 }}
          >
            <Typography variant="h6" gutterBottom>
              Total Income
            </Typography>
            <Typography variant="h4" color="green">
              ${totalIncome}
            </Typography>
          </Paper>
          <Paper
            elevation={3}
            sx={{ p: 2, textAlign: "center", flex: 1, ml: 1 }}
          >
            <Typography variant="h6" gutterBottom>
              Total Expenses
            </Typography>
            <Typography variant="h4" color="red">
              ${totalExpense}
            </Typography>
          </Paper>
        </Box>

        <Divider sx={{ m: 5, borderBottomWidth: 3, borderColor: "primary" }} />

        {/* Pie Chart */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6" textAlign={"center"} pb={2}>
            Expenses Breakdown
          </Typography>
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
            sx={{ width: "100%" }}
          >
            <PieChart
              series={[
                {
                  data,
                  highlightScope: { faded: "global", highlighted: "item" },
                  faded: {
                    innerRadius: 30,
                    additionalRadius: -30,
                    color: "gray",
                  },
                },
              ]}
              width={400}
              height={200}
            ></PieChart>
          </Stack>
        </Box>
        <Divider sx={{ m: 5, borderBottomWidth: 3, borderColor: "primary" }} />

        {/* Goals and Subscriptions */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Paper
            elevation={3}
            sx={{ p: 2, textAlign: "center", flex: 1, mr: 1 }}
          >
            <Typography variant="h6" gutterBottom>
              Goals
            </Typography>
          </Paper>
          <Paper
            elevation={3}
            sx={{ p: 2, textAlign: "center", flex: 1, ml: 1 }}
          >
            <Typography variant="h6" gutterBottom>
              Subscriptions
            </Typography>
          </Paper>
        </Box>
      </Box>
    </>
  );
}

export default Dashboard;
