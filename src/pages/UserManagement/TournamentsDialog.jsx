// TournamentsDialog.jsx
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
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
};

const TournamentsDialog = ({
  open,
  onClose,
  tournaments,
  loading,
  error,
  onNextPage,
  onPrevPage,
  hasMore,
  hasPrev,
  page,
  pageSize,
  totalCount,
}) => {
  const emailFromData = tournaments?.[0]?.emailId;

  const hasTotal = typeof totalCount === "number" && totalCount >= 0;

  let rangeText = "";
  if (tournaments && tournaments.length > 0 && hasTotal) {
    const startIndex = page * pageSize + 1;
    const endIndex = Math.min(page * pageSize + tournaments.length, totalCount);
    rangeText = `Showing ${startIndex}–${endIndex} of ${totalCount} tournaments`;
  } else if (tournaments && tournaments.length > 0) {
    rangeText = `Showing ${tournaments.length} tournaments`;
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        User Tournaments
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
        {/* Loading */}
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

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to load tournaments. Please try again.
          </Alert>
        )}

        {/* Empty */}
        {!loading && !error && (!tournaments || tournaments.length === 0) && (
          <Typography variant="body2" color="text.secondary">
            No tournaments found.
          </Typography>
        )}

        {/* Table */}
        {!loading && !error && tournaments && tournaments.length > 0 && (
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
                {rangeText}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Page {page + 1}
              </Typography>
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Tournament ID</TableCell>
                    <TableCell align="right">Entries</TableCell>
                    <TableCell align="right">Score</TableCell>
                    <TableCell align="right">Cash Earned (₹)</TableCell>
                    <TableCell>Joined</TableCell>
                    <TableCell>Played</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tournaments.map((t) => (
                    <TableRow key={t.tournamentId}>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 260,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          title={t.tournamentId}
                        >
                          {t.tournamentId}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">{t.entriesCount}</TableCell>
                      <TableCell align="right">{t.score}</TableCell>
                      <TableCell align="right">{t.cashEarned}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={t.isJoined ? "Yes" : "No"}
                          color={t.isJoined ? "success" : "default"}
                          variant={t.isJoined ? "filled" : "outlined"}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={t.isPlayed ? "Yes" : "No"}
                          color={t.isPlayed ? "success" : "default"}
                          variant={t.isPlayed ? "filled" : "outlined"}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDateTime(t.createdAt)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
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

export default TournamentsDialog;
