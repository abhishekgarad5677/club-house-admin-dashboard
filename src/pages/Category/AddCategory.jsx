import React, { useEffect, useState } from "react";
import { Box, Button, OutlinedInput, Paper, Typography } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Grid from "@mui/material/Grid2";
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";
import { useAddCategoryMutation } from "../../redux/slices/apiSlice";
import CategoryIcon from "@mui/icons-material/Category";
import CustomSnackbar from "../../components/snackbar/Snackbar";
import { Link } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const AddCategory = () => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");

  const [idError, setIdError] = useState("");
  const [nameError, setNameError] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Close the Snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const [createCategory, { isLoading, isSuccess, isError }] =
    useAddCategoryMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let valid = true;

    // Reset errors
    setIdError("");
    setNameError("");

    // Validate ID
    if (!id) {
      setIdError("Category ID is required");
      valid = false;
    } else if (!Number.isInteger(Number(id))) {
      setIdError("ID must be an integer");
      valid = false;
    }

    // Validate Name
    if (!name.trim()) {
      setNameError("Category Name is required");
      valid = false;
    }

    if (!valid) return;

    const formData = new FormData();
    formData.append("Id", parseInt(id, 10));
    formData.append("Name", name);

    await createCategory(formData).unwrap();
  };

  useEffect(() => {
    if (isSuccess) {
      setSnackbarMessage("Category created successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      setSnackbarMessage("Failed to create category!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }, [isError]);

  return (
    <>
      <CustomBreadcrumbs
        items={[
          {
            label: "Category",
            href: "/dashboard/category",
            icon: <CategoryIcon fontSize="small" />,
          },
          {
            label: "Add category",
            href: "/dashboard/add-category",
            icon: <AddCircleIcon fontSize="small" />,
          },
        ]}
      />

      <CustomSnackbar
        snackbarOpen={snackbarOpen}
        snackbarMessage={snackbarMessage}
        snackbarSeverity={snackbarSeverity}
        handleCloseSnackbar={handleCloseSnackbar}
      />

      <Paper sx={{ height: "85vh", width: "100%", padding: 3 }}>
        <Link
          style={{
            textDecoration: "none",
            color: "#1976d2",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            marginBottom: 10,
            width: "fit-content",
          }}
          to={"/dashboard/category"}
        >
          <ArrowBackIosIcon sx={{ fontSize: 14 }} />
          back
        </Link>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Category ID */}
            <Grid size={6}>
              <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                Category ID
              </Typography>
              <OutlinedInput
                fullWidth
                size="small"
                type="number"
                value={id}
                onChange={(e) => {
                  setId(e.target.value);
                  setIdError("");
                }}
              />
              {idError && (
                <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>
                  {idError}
                </Typography>
              )}
            </Grid>

            {/* Category Name */}
            <Grid size={6}>
              <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                Category Name
              </Typography>
              <OutlinedInput
                fullWidth
                size="small"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameError("");
                }}
              />
              {nameError && (
                <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>
                  {nameError}
                </Typography>
              )}
            </Grid>

            {/* Submit Button */}
            <Grid size={12} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ width: "18%", backgroundColor: "#1E218D" }}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Create Category"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </>
  );
};

export default AddCategory;
