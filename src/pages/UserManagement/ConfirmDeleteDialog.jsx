import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Box,
  Button,
} from "@mui/material";

const ConfirmDeleteDialog = ({
  open,
  onClose,
  title,
  warningText,
  confirmText,
  setConfirmText,
  loading,
  onConfirm,
  actionLabel = "Confirm",
  requiredKeyword = "DELETE", // 👈 NEW — dynamic keyword
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>

      <DialogContent dividers>
        <Typography sx={{ mb: 2 }}>
          To confirm this action, type <strong>{requiredKeyword}</strong> in the
          box below.
        </Typography>

        <TextField
          autoFocus
          fullWidth
          size="small"
          label={`Type ${requiredKeyword} to confirm`}
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
        />

        {warningText && (
          <Box
            sx={{
              mt: 2,
              p: 1.5,
              borderRadius: 1,
              bgcolor: "#fff9e6",
              border: "1px solid #ffe58f",
            }}
          >
            <Typography variant="body2" color="warning.main">
              ⚠️ {warningText}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>

        <Button
          variant="contained"
          color="error"
          disabled={confirmText !== requiredKeyword || loading}
          onClick={onConfirm}
        >
          {loading ? "Processing..." : actionLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
