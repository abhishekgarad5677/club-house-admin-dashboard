import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const CustomRangeSelect = ({
  value,
  onChange,
  label,
  size = "small",
  minWidth = 200,
  options,
}) => {
  return (
    <FormControl sx={{ minWidth }} size={size}>
      <InputLabel id="date-range-select-label">{label}</InputLabel>
      <Select
        labelId="date-range-select-label"
        value={value}
        label={label}
        onChange={onChange}
      >
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomRangeSelect;
