import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormHelperText,
  InputAdornment,
  OutlinedInput,
  Paper,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Grid from "@mui/material/Grid2";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const AddCategory = () => {
  return (
    <>
      <CustomBreadcrumbs
        items={[
          {
            label: "Category",
            href: "/dashboard/category",
            icon: <EmojiEventsIcon fontSize="small" />,
          },
          {
            label: "Add category",
            href: "/dashboard/add-category",
            icon: <AddCircleIcon fontSize="small" />,
          },
        ]}
      />
      <Paper sx={{ height: "85vh", width: "100%", padding: 3 }}>
        <Grid container spacing={3}>
          <Grid size={6}>
            <Typography variant="subtitle1" fontWeight={"500"} gutterBottom>
              Category Name
            </Typography>
            <OutlinedInput fullWidth size="small" />
          </Grid>
          <Grid size={6}>
            <Typography variant="subtitle1" fontWeight={"500"} gutterBottom>
              Category Version
            </Typography>
            <OutlinedInput fullWidth size="small" />
          </Grid>
          <Grid size={6}>
            <Typography variant="subtitle1" fontWeight={"500"} gutterBottom>
              AOS Asset Bundle
            </Typography>
            <OutlinedInput type="file" fullWidth size="small" />
          </Grid>
          <Grid size={6}>
            <Typography variant="subtitle1" fontWeight={"500"} gutterBottom>
              IOS Asset Bundle
            </Typography>
            <OutlinedInput type="file" fullWidth size="small" />
          </Grid>
          <Grid size={6}></Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default AddCategory;
