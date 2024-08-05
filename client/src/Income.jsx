import React, { useState, useEffect } from "react";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { LocalizationProvider, DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import AccountNameEdit from "./AccountNameEdit";

function Income({ open, drawerWidth, userId }) {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [addDialog, setAddDialog] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [accountId, setAccountId] = useState("");
  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(null);
  const [trigger, setTrigger] = useState(false);

  const columns = [
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      minWidth: 100,
      editable: true,
    },
    {
      field: "source",
      headerName: "Income Source",
      flex: 2,
      minWidth: 200,
      editable: true,
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      minWidth: 150,
      editable: true,
    },
    {
      field: "accountName",
      headerName: "Account Name",
      flex: 2,
      minWidth: 200,
      editable: true,
      renderEditCell: (params) => (
        <AccountNameEdit {...params} accounts={accounts} />
      ),
    },
    {
      field: "actions",
      headerName: "Delete",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        const handleDelete = () => {
          const updatedAccountId = accounts.find(
            (account) => account.accountName === params.row.accountName
          )._id;
          axios
            .delete(`${apiUrl}/incomes/${params.id}`, {
              params: {
                accountId: updatedAccountId,
                amount: params.row.amount,
              },
            })
            .then((result) => {
              console.log(result);
              setTrigger(!trigger);
            });
        };

        return (
          <Tooltip title="Delete">
            <IconButton onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        );
      },
    },
  ];
  const rows = incomes.map((income, index) => ({
    accountName:
      accounts.find((account) => account._id === income.accountId)
        ?.accountName || "Unknown Account",
    amount: income.amount,
    source: income.source,
    date: new Date(income.date).toLocaleDateString(),
    id: income._id,
  }));

  // Get Accounts
  useEffect(() => {
    if (userId) {
      axios.get(`${apiUrl}/accounts/${userId}`).then((result) => {
        setAccounts(result.data);
      });
    }
  }, [userId]);

  // Get Incomes
  useEffect(() => {
    if (userId) {
      axios.get(`${apiUrl}/incomes/${userId}`).then((result) => {
        setIncomes(result.data);
      });
    }
  }, [userId, trigger]);

  const handleAdd = (e) => {
    e.preventDefault();
    axios
      .post(`${apiUrl}/incomes/add`, {
        userId,
        accountId,
        source,
        amount,
        date,
      })
      .then((result) => {
        console.log(result);
        setSource("");
        setAmount("");
        setAccountId("");
        setDate(null);
        setAddDialog(false);
        setTrigger(!trigger);
      });
  };

  const handleEdit = (updatedRow, originalRow) => {
    const updatedAccountId = accounts.find(
      (account) => account.accountName === updatedRow.accountName
    )._id;

    let updateAccount = false;
    if (updatedRow.amount !== originalRow.amount) {
      updateAccount = true;
    }

    axios
      .post(`${apiUrl}/incomes/update/${updatedRow.id}`, {
        accountId: updatedAccountId,
        amount: updatedRow.amount,
        date: updatedRow.date,
        source: updatedRow.source,
        oldAmount: originalRow.amount,
        updateAccount,
      })
      .then((result) => {
        console.log(result);
        setTrigger(!trigger);
      });
  };

  return (
    <>
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
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setAddDialog(true);
          }}
        >
          Add Income
        </Button>

        <Box sx={{ height: "80vh", width: "100%", mt: 2 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            processRowUpdate={(updatedRow, originalRow) => {
              if (updatedRow.amount) {
                updatedRow.amount = Number(updatedRow.amount);
              }
              handleEdit(updatedRow, originalRow);
              return updatedRow;
            }}
            onProcessRowUpdateError={(error) => {
              console.log(error);
            }}
          />
        </Box>
      </Box>

      {/* Add Income Dialog */}
      <Dialog open={addDialog} maxWidth="md" fullWidth>
        <DialogTitle>Add New Income</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleAdd}
            noValidate
            id="create-income-form"
          >
            <TextField
              autoFocus
              margin="dense"
              label="Income Source"
              type="text"
              fullWidth
              variant="outlined"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              required
            />
            <TextField
              margin="dense"
              label="Amount"
              type="number"
              fullWidth
              variant="outlined"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <FormControl sx={{ pb: 1 }} fullWidth margin="dense">
              <InputLabel>Account</InputLabel>
              <Select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                label="Account"
                required
              >
                {accounts.map((account) => (
                  <MenuItem key={account._id} value={account._id}>
                    {account.accountName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label="Date"
                inputFormat="MM/dd/yyyy"
                value={date}
                onChange={(newValue) => setDate(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setAddDialog(false);
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button type="submit" form="create-income-form" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Income;
