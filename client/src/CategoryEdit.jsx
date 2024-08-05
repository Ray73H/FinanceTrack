import React from "react";
import { Select, MenuItem } from "@mui/material";

const CategoryEdit = (props) => {
  const { id, value, field, api, categories } = props;

  const handleChange = (event) => {
    api.setEditCellValue({ id, field, value: event.target.value });
    api.stopCellEditMode({ id, field });
  };

  return (
    <Select value={value} onChange={handleChange} fullWidth>
      {categories.map((cat) => (
        <MenuItem key={cat._id} value={cat.name}>
          {cat.name}
        </MenuItem>
      ))}
    </Select>
  );
};

export default CategoryEdit;
