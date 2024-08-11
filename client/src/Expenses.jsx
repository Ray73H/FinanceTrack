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
  Grid,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { LocalizationProvider, DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import AccountNameEdit from "./AccountNameEdit";
import CategoryEdit from "./CategoryEdit";

function Expenses({ open, drawerWidth, userId }) {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [addDialog, setAddDialog] = useState(false);
  const [addCategoryDialog, setAddCategoryDialog] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [accountId, setAccountId] = useState("");
  const [expense, setExpense] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [createCategoryName, setCreateCategoryName] = useState("");
  const [date, setDate] = useState(null);
  const [trigger, setTrigger] = useState(false);
  const [formError, setFormError] = useState(false);

  const columns = [
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      minWidth: 100,
      editable: true,
    },
    {
      field: "expense",
      headerName: "Expense",
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
      field: "category",
      headerName: "Category",
      flex: 2,
      minWidth: 200,
      editable: true,
      renderEditCell: (params) => (
        <CategoryEdit {...params} categories={categories} />
      ),
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
            .delete(`${apiUrl}/expenses/${params.id}`, {
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
  const rows = expenses.map((expense, index) => ({
    accountName:
      accounts.find((account) => account._id === expense.accountId)
        ?.accountName || "Unknown Account",
    amount: expense.amount,
    expense: expense.expense,
    category:
      categories.find((cat) => cat._id === expense.categoryId)?.name ||
      "Unknown Category",
    date: new Date(expense.date).toLocaleDateString(),
    id: expense._id,
  }));

  // Get Accounts
  useEffect(() => {
    if (userId) {
      axios.get(`${apiUrl}/accounts/${userId}`).then((result) => {
        setAccounts(result.data);
      });
    }
  }, [userId]);

  useEffect(() => {
    // Get Expenses
    if (userId) {
      axios.get(`${apiUrl}/expenses/${userId}`).then((result) => {
        setExpenses(result.data);
      });
    }

    // Get Categories
    if (userId) {
      axios.get(`${apiUrl}/categories/${userId}`).then((result) => {
        setCategories(result.data);
      });
    }
  }, [userId, trigger]);

  const handleAddExpense = (e) => {
    e.preventDefault();

    if (!amount || !expense || !categoryId || !date || !accountId) {
      setFormError(true);
      return;
    }

    axios
      .post(`${apiUrl}/expenses/add`, {
        userId,
        accountId,
        amount,
        expense,
        categoryId,
        date,
      })
      .then((result) => {
        console.log(result);
        setExpense("");
        setAmount("");
        setAccountId("");
        setDate(null);
        setCategoryId("");
        setAddDialog(false);
        setTrigger(!trigger);
        setFormError(false);
      });
  };

  const handleAddCategory = (e) => {
    e.preventDefault();

    if (!createCategoryName) {
      setFormError(true);
      return;
    }

    axios
      .post(`${apiUrl}/categories/add`, {
        userId,
        name: createCategoryName,
      })
      .then((result) => {
        console.log(result);
        setCreateCategoryName("");
        setAddCategoryDialog(false);
        setTrigger(!trigger);
        setFormError(false);
      });
  };

  const handleEdit = (updatedRow, originalRow) => {
    const updatedAccountId = accounts.find(
      (account) => account.accountName === updatedRow.accountName
    )._id;
    const updatedCategoryId = categories.find(
      (cat) => cat.name === updatedRow.category
    )._id;

    let updateAccount = false;
    if (updatedRow.amount !== originalRow.amount) {
      updateAccount = true;
    }

    axios
      .post(`${apiUrl}/expenses/update/${updatedRow.id}`, {
        accountId: updatedAccountId,
        amount: updatedRow.amount,
        date: updatedRow.date,
        expense: updatedRow.expense,
        categoryId: updatedCategoryId,
        oldAmount: originalRow.amount,
        updateAccount,
      })
      .then((result) => {
        console.log(result);
        setTrigger(!trigger);
      });
  };

  const handleDeleteCategory = (catId) => {
    axios.delete(`${apiUrl}/categories/${catId}`).then((result) => {
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
          sx={{ mr: 2 }}
          onClick={() => {
            setAddDialog(true);
          }}
        >
          Add Expense
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setAddCategoryDialog(true);
          }}
        >
          Add Expense Category
        </Button>

        {/* Categories */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {categories.map((cat) => {
            const total = expenses
              .filter((exp) => exp.categoryId === cat._id)
              .reduce((acc, exp) => acc + exp.amount, 0);

            return (
              <Grid item xs={12} sm={6} md={3} lg={2} key={cat._id}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6">{cat.name}</Typography>
                    <Typography variant="subtitle1">Total: ${total}</Typography>
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                      <IconButton
                        color="secondary"
                        onClick={() => handleDeleteCategory(cat._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Expenses List */}
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

      {/* Add Expense Dialog */}
      <Dialog open={addDialog} maxWidth="md" fullWidth>
        <DialogTitle>Add New Expense</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleAddExpense}
            noValidate
            id="create-expense-form"
          >
            <TextField
              autoFocus
              margin="dense"
              label="Expense"
              type="text"
              fullWidth
              variant="outlined"
              value={expense}
              onChange={(e) => setExpense(e.target.value)}
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
            <FormControl fullWidth margin="dense">
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                label="Category"
                required
              >
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
            {formError && (
              <Typography color="error" variant="body2">
                Please fill all sections
              </Typography>
            )}
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
          <Button type="submit" form="create-expense-form" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Category Dialog */}
      <Dialog open={addCategoryDialog} maxWidth="md" fullWidth>
        <DialogTitle>Add New Expense Category</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleAddCategory}
            noValidate
            id="create-category-form"
          >
            <TextField
              autoFocus
              margin="dense"
              label="Category Name"
              type="text"
              fullWidth
              variant="outlined"
              value={createCategoryName}
              onChange={(e) => setCreateCategoryName(e.target.value)}
              required
            />
            {formError && (
              <Typography color="error" variant="body2">
                Please fill all sections
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setAddCategoryDialog(false);
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button type="submit" form="create-category-form" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Expenses;
