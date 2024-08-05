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

const data = [
  { id: 0, value: 10, label: "series A" },
  { id: 1, value: 15, label: "series B" },
  { id: 2, value: 20, label: "series C" },
];

function Dashboard({ open, drawerWidth, userId }) {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [accounts, setAccounts] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    // Total Balance
    if (userId) {
      axios.get(`${apiUrl}/accounts/${userId}`).then((result) => {
        setAccounts(result.data);
        let total = 0;
        result.data.forEach((account) => {
          if (account.includeInTotal) {
            total += account.balance;
          }
        });
        setTotalBalance(total);
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
          console.log(income);
          console.log(
            accounts.find((account) => account._id === income.accountId)
          );
          if (
            accounts.find((account) => account._id === income.accountId)
              ?.includeInTotal
          ) {
            total += income.amount;
          }
        });
        setTotalIncome(total);
      });
    }
  }, [userId, accounts]);

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
              $3,000
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
