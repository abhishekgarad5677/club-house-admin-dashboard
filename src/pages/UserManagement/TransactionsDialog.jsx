// TransactionsDialog.jsx
import React from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";

const formatDateTime = (value) => {
  if (!value && value !== 0) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
};

const getTypeChipProps = (type) => {
  switch (type) {
    case "Winning":
      return { label: "Winning", color: "success", variant: "filled" };
    case "Withdrawal":
      return { label: "Withdrawal", color: "primary", variant: "outlined" };
    case "TDSDeduction":
      return { label: "TDS Deduction", color: "warning", variant: "outlined" };
    default:
      return {
        label: type || "Unknown",
        color: "default",
        variant: "outlined",
      };
  }
};

const TransactionsDialog = ({
  open,
  onClose,
  transactions,
  loading,
  error,
  // new pagination props
  onNextPage,
  onPrevPage,
  hasMore,
  hasPrev,
  page,
  totalCount, // optional, if backend passes data.totalCount
}) => {
  const emailFromData = transactions?.[0]?.emailId;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        Lifetime Transactions
        {emailFromData && (
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            {emailFromData}
          </Typography>
        )}
      </DialogTitle>

      <DialogContent dividers>
        {/* Loading state */}
        {loading && (
          <Box
            sx={{
              py: 4,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {/* Error state */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to load transactions. Please try again.
          </Alert>
        )}

        {/* Empty state */}
        {!loading && !error && (!transactions || transactions.length === 0) && (
          <Typography variant="body2" color="text.secondary">
            No transactions found.
          </Typography>
        )}

        {/* Table view */}
        {!loading && !error && transactions && transactions.length > 0 && (
          <>
            <Box
              sx={{
                mb: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Showing {transactions.length}
                {typeof totalCount === "number"
                  ? ` of ${totalCount} transactions`
                  : " transactions"}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Page {page + 1}
              </Typography>
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Amount (₹)</TableCell>
                    <TableCell>Transaction ID</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((tx) => {
                    const chipProps = getTypeChipProps(tx.type);
                    return (
                      <TableRow
                        key={
                          tx.transactionId ??
                          `${tx.emailId}-${tx.amount}-${tx.createdAt}`
                        }
                      >
                        <TableCell>
                          <Chip
                            size="small"
                            {...chipProps}
                            sx={{ fontSize: "0.75rem" }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600}>
                            {tx.amount}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              maxWidth: 260,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            title={tx.transactionId || "N/A"}
                          >
                            {tx.transactionId || "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDateTime(tx.createdAt)}
                            {tx.createdAt === 0 && " (sample data)"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onPrevPage}
          disabled={loading || !hasPrev}
          variant="outlined"
        >
          Previous
        </Button>
        <Button
          onClick={onNextPage}
          disabled={loading || !hasMore}
          variant="outlined"
        >
          Next
        </Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionsDialog;
