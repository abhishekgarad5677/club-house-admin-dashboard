import { Snackbar, Alert } from "@mui/material";

const CustomSnackbar = ({
  snackbarOpen,
  snackbarMessage,
  snackbarSeverity,
  handleCloseSnackbar,
}) => {
  return (
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={4000} // Closes after 4 seconds
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // Position of Snackbar
    >
      <Alert
        onClose={handleCloseSnackbar}
        severity={snackbarSeverity}
        sx={{ width: "100%" }}
      >
        {snackbarMessage}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
