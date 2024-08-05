import React from "react";
import { Select, MenuItem } from "@mui/material";

const AccountNameEdit = (props) => {
  const { id, value, field, api, accounts } = props;

  const handleChange = (event) => {
    api.setEditCellValue({ id, field, value: event.target.value });
    api.stopCellEditMode({ id, field });
  };

  return (
    <Select value={value} onChange={handleChange} fullWidth>
      {accounts.map((account) => (
        <MenuItem key={account._id} value={account.accountName}>
          {account.accountName}
        </MenuItem>
      ))}
    </Select>
  );
};

export default AccountNameEdit;
