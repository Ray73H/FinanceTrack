import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import axios from "axios";

function Accounts({ open, drawerWidth, userId }) {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [addDialog, setAddDialog] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [balance, setBalance] = useState("");
  const [editedAccountName, setEditedAccountName] = useState("");
  const [editedBalance, setEditedBalance] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [trigger, setTrigger] = useState(false);
  const [includeInTotal, setIncludeInTotal] = useState(true);

  useEffect(() => {
    if (userId) {
      axios.get(`${apiUrl}/accounts/${userId}`, { userId }).then((result) => {
        setAccounts(result.data);
      });
    }
  }, [userId, trigger]);

  const handleAdd = (e) => {
    e.preventDefault();
    axios
      .post(`${apiUrl}/accounts/add`, {
        userId,
        accountName,
        balance,
        includeInTotal,
      })
      .then((result) => {
        console.log(result);
        setAccountName("");
        setBalance("");
        setIncludeInTotal(true);
        setAddDialog(false);
        setTrigger(!trigger);
      });
  };

  const handleEdit = (account) => {
    setEditing(account._id);
    setEditedAccountName(account.accountName);
    setEditedBalance(account.balance);
    setIncludeInTotal(account.includeInTotal);
  };

  const handleSave = (accountId) => {
    axios
      .post(`${apiUrl}/accounts/update/${accountId}`, {
        accountName: editedAccountName,
        balance: editedBalance,
        includeInTotal,
      })
      .then((result) => {
        console.log(result);
        setEditing(null);
        setTrigger(!trigger);
      });
  };

  const handleDelete = (accountId) => {
    axios
      .delete(`${apiUrl}/accounts/${accountId}`, { id: accountId })
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
          Add Account
        </Button>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          {accounts.map((account) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={account._id}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  {editing === account._id ? (
                    <>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Account Name"
                        value={editedAccountName}
                        onChange={(e) => setEditedAccountName(e.target.value)}
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Balance"
                        type="number"
                        value={editedBalance}
                        onChange={(e) => setEditedBalance(e.target.value)}
                        sx={{ mb: 2 }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={includeInTotal}
                            onChange={(e) =>
                              setIncludeInTotal(e.target.checked)
                            }
                          />
                        }
                        label="Include in Total Balance"
                        sx={{ mb: 2 }}
                      />
                      <Box display="flex" justifyContent="flex-end">
                        <IconButton
                          color="primary"
                          onClick={() => handleSave(account._id)}
                        >
                          <CheckIcon />
                        </IconButton>
                      </Box>
                    </>
                  ) : (
                    <>
                      <Typography variant="h6">
                        {account.accountName}
                      </Typography>
                      <Typography variant="subtitle1">
                        Balance: ${account.balance}
                      </Typography>
                      <Box display="flex" justifyContent="flex-end" mt={2}>
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(account)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={() => handleDelete(account._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Add Account Dialog */}
      <Dialog open={addDialog} maxWidth="md" fullWidth>
        <DialogTitle>Create New Account</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleAdd}
            noValidate
            id="create-account-form"
          >
            <TextField
              autoFocus
              margin="dense"
              label="Account Name"
              type="text"
              fullWidth
              variant="outlined"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              required
            />
            <TextField
              margin="dense"
              label="Balance"
              type="number"
              fullWidth
              variant="outlined"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              required
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={includeInTotal}
                  onChange={(e) => setIncludeInTotal(e.target.checked)}
                />
              }
              label="Include in Total Balance"
            />
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
          <Button type="submit" form="create-account-form" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Accounts;
