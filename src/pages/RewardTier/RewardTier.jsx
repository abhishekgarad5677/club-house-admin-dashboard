import React, { useState, useEffect } from "react";
import {
  Paper,
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  IconButton,
  Card,
  CardContent,
  Divider,
  Alert,
  Stack,
  CircularProgress,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import { Link } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useAddRewardTierMutation } from "../../redux/slices/apiSlice";
import CustomSnackbar from "../../components/snackbar/Snackbar";

const RewardTier = () => {
  const [name, setName] = useState("");
  const [totalPlayers, setTotalPlayers] = useState("100");
  const [totalAmount, setTotalAmount] = useState("1000");
  const [tiers, setTiers] = useState([]);
  const [error, setError] = useState("");
  const [
    createRewardTier,
    { isLoading, error: createRewardTierError, data: createRewardTierData },
  ] = useAddRewardTierMutation();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Close the Snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const [errors, setErrors] = useState({
    name: "",
    totalPlayers: "",
    totalAmount: "",
    tiers: [], // [{label:"", amountPerUser:""}]
  });

  const numericTotalPlayers = Number.isFinite(parseInt(totalPlayers, 10))
    ? parseInt(totalPlayers, 10)
    : 0;
  const numericTotalAmount = Number.isFinite(parseFloat(totalAmount))
    ? parseFloat(totalAmount)
    : 0;

  const parseLabel = (label) => {
    if (!label) return { start: 0, end: 0 };
    const parts = label.split("-").map((p) => p.trim());
    if (parts.length === 1) {
      const n = parseInt(parts[0], 10);
      return { start: isNaN(n) ? 0 : n, end: 0 };
    }
    const s = parseInt(parts[0], 10);
    const e = parseInt(parts[1], 10);
    return { start: isNaN(s) ? 0 : s, end: isNaN(e) ? 0 : e };
  };
  const effectiveEnd = (start, end) => (end && end > 0 ? end : start);

  const calculateTierAmount = (start, end, amountPerUser) => {
    const amt = parseFloat(amountPerUser);
    if (!amt || isNaN(amt) || isNaN(start)) return 0;
    const eEnd = effectiveEnd(start, end);
    const count = Math.max(0, eEnd - start + 1);
    return count * amt;
  };

  const handleLabelChange = (index, label) => {
    const { start, end } = parseLabel(label);
    const updated = [...tiers];
    updated[index].label = label;
    updated[index].startRank = start;
    updated[index].endRank = end;
    updated[index].totalAmount = calculateTierAmount(
      start,
      end,
      updated[index].amountPerUser
    );
    setTiers(updated);
  };

  const handleTierChange = (index, key, value) => {
    const updated = [...tiers];
    updated[index][key] = value;
    if (key === "amountPerUser") {
      updated[index].totalAmount = calculateTierAmount(
        updated[index].startRank,
        updated[index].endRank,
        value
      );
    }
    setTiers(updated);
  };

  const calculateOverallTotal = () =>
    tiers.reduce((sum, t) => sum + (t.totalAmount || 0), 0);

  // helpers for auto-fill
  const getExpectedStart = (idx, list = tiers) => {
    if (idx === 0) return 1;
    const p = list[idx - 1];
    const prevEnd = effectiveEnd(p.startRank, p.endRank);
    return prevEnd + 1;
  };
  const getPrevSpan = (list = tiers) => {
    if (list.length === 0) return 1;
    const last = list[list.length - 1];
    const span =
      effectiveEnd(last.startRank, last.endRank) - last.startRank + 1;
    return Math.max(1, span || 1);
  };

  // ADD TIER: auto-fill the new tier's label
  const addTier = () => {
    const updated = [...tiers];
    const expectedStart = getExpectedStart(updated.length, updated);
    const span = getPrevSpan(updated); // preserve last span; defaults to 1
    const start = expectedStart;

    // if start is already beyond total players, still add an empty label so validation surfaces the issue
    let end = Math.min(start + span - 1, numericTotalPlayers);

    const label =
      start <= numericTotalPlayers
        ? end === start
          ? String(start)
          : `${start}-${end}`
        : "";

    const newTier = {
      label,
      startRank: start <= numericTotalPlayers ? start : 0,
      endRank: start <= numericTotalPlayers ? (end === start ? 0 : end) : 0,
      amountPerUser: "",
      totalAmount:
        start <= numericTotalPlayers ? calculateTierAmount(start, end, "") : 0,
    };

    updated.push(newTier);
    setTiers(updated);

    setErrors((prev) => ({
      ...prev,
      tiers: [...prev.tiers, { label: "", amountPerUser: "" }],
    }));
  };

  const removeTier = (index) => {
    setTiers((prev) => prev.filter((_, i) => i !== index));
    setErrors((prev) => ({
      ...prev,
      tiers: prev.tiers.filter((_, i) => i !== index),
    }));
  };

  // ---------- VALIDATION ----------
  const validateAll = () => {
    const nextErrors = {
      name: "",
      totalPlayers: "",
      totalAmount: "",
      tiers: [],
    };

    // Reward Tier Name: required & min length 3
    if (!name.trim()) nextErrors.name = "Reward Tier Name is required.";
    else if (name.trim().length < 3)
      nextErrors.name = "Name must be at least 3 characters.";

    // total players
    if (totalPlayers === "")
      nextErrors.totalPlayers = "Total Players is required.";
    else if (!/^\d+$/.test(totalPlayers))
      nextErrors.totalPlayers = "Enter a whole number.";
    else if (numericTotalPlayers <= 0)
      nextErrors.totalPlayers = "Must be at least 1.";

    // tiers sequential rule
    let expectedStart = 1;
    tiers.forEach((t, i) => {
      const tierErr = { label: "", amountPerUser: "" };
      const s = Number(t.startRank);
      const e = effectiveEnd(t.startRank, t.endRank);

      if (!t.label || t.label.trim() === "") {
        tierErr.label = "Label is required (e.g., 1 or 2-5).";
      } else if (!Number.isInteger(s) || !Number.isInteger(e) || s <= 0) {
        tierErr.label = "Invalid label. Use positive ranks (e.g., 1 or 2-5).";
      } else if (s !== expectedStart) {
        tierErr.label = `Label must start at rank ${expectedStart}.`;
      } else if (e < s) {
        tierErr.label = "End rank must be ≥ start.";
      } else if (e > numericTotalPlayers) {
        tierErr.label = `End rank cannot exceed Total Players (${numericTotalPlayers}).`;
      }

      if (t.amountPerUser === "")
        tierErr.amountPerUser = "Amount per user is required.";
      else if (isNaN(parseFloat(t.amountPerUser)))
        tierErr.amountPerUser = "Enter a valid number.";
      else if (parseFloat(t.amountPerUser) < 0)
        tierErr.amountPerUser = "Cannot be negative.";

      nextErrors.tiers[i] = tierErr;

      if (!tierErr.label) expectedStart = e + 1;
    });

    // total amount vs distributed
    const distributed = calculateOverallTotal();
    if (totalAmount === "")
      nextErrors.totalAmount = "Total Amount is required.";
    else if (isNaN(numericTotalAmount))
      nextErrors.totalAmount = "Enter a valid number.";
    else if (numericTotalAmount < 0)
      nextErrors.totalAmount = "Cannot be negative.";
    else if (distributed > numericTotalAmount) {
      nextErrors.totalAmount = `Increase Total Amount (distributed = ${distributed.toFixed(
        2
      )}).`;
    }

    setErrors(nextErrors);

    if (distributed > numericTotalAmount) {
      setError(
        `Total tier amount (${distributed.toFixed(
          2
        )}) exceeds available total (${numericTotalAmount.toFixed(2)})`
      );
    } else setError("");

    const hasTop =
      !!nextErrors.name ||
      !!nextErrors.totalPlayers ||
      !!nextErrors.totalAmount;
    const hasTier = nextErrors.tiers.some(
      (t) =>
        (t?.label || t?.amountPerUser) &&
        (t.label !== "" || t.amountPerUser !== "")
    );
    return !(hasTop || hasTier);
  };

  useEffect(() => {
    validateAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, totalPlayers, totalAmount, tiers]);

  useEffect(() => {
    const total = calculateOverallTotal();
    if (total > numericTotalAmount) {
      setError(
        `Total tier amount (${total.toFixed(
          2
        )}) exceeds available total (${numericTotalAmount.toFixed(2)})`
      );
    } else setError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiers, numericTotalAmount]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    if (!validateAll()) return;

    // Calculate total distributed amount
    const distributed = calculateOverallTotal();

    // Check if total distributed amount equals total amount
    if (distributed !== numericTotalAmount) {
      setError(
        `Total tier amount (${distributed.toFixed(
          2
        )}) must equal Total Amount (${numericTotalAmount.toFixed(2)}).`
      );
      return; // Prevent API call
    }

    // Prepare the form data (DTO)
    const dto = {
      name,
      totalPlayers: numericTotalPlayers,
      totalAmount: numericTotalAmount,
      labels: tiers.map((t) => t.label),
      startRanks: tiers.map((t) => parseInt(t.startRank, 10) || 0),
      endRanks: tiers.map((t) => parseInt(t.endRank, 10) || 0),
      amountsPerUser: tiers.map((t) => parseFloat(t.amountPerUser) || 0),
    };

    // Create FormData to send with the API request
    const formData = new FormData();
    formData.append("Name", dto.name);
    formData.append("TotalPlayers", String(dto.totalPlayers));
    formData.append("TotalAmount", String(dto.totalAmount));
    dto.labels.forEach((l) => formData.append("Labels", l));
    dto.startRanks.forEach((r) => formData.append("StartRanks", String(r)));
    dto.endRanks.forEach((r) => formData.append("EndRanks", String(r)));
    dto.amountsPerUser.forEach((a) =>
      formData.append("AmountsPerUser", String(a))
    );

    console.log("🧾 Form Data Submitted:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    console.log("DTO Object:", dto);

    // Proceed with API call if validation passes
    createRewardTier(formData);
  };

  useEffect(() => {
    if (createRewardTierData) {
      if (createRewardTierData?.status === true) {
        console.log(createRewardTierData);

        setSnackbarMessage(createRewardTierData?.message);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage(createRewardTierData?.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  }, [createRewardTierData]);

  return (
    <Paper sx={{ p: 3 }}>
      <CustomSnackbar
        snackbarOpen={snackbarOpen}
        snackbarMessage={snackbarMessage}
        snackbarSeverity={snackbarSeverity}
        handleCloseSnackbar={handleCloseSnackbar}
      />
      <Link
        style={{
          textDecoration: "none",
          color: "#1976d2",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          marginBottom: 16,
        }}
        to={"/dashboard/reward-tier-list"}
      >
        <ArrowBackIosIcon sx={{ fontSize: 14 }} />
        back
      </Link>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <MilitaryTechIcon color="primary" />
        <Typography variant="h5" fontWeight={700}>
          Reward Tier Builder
        </Typography>
      </Stack>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Reward Tier Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              type="number"
              label="Total Players"
              value={totalPlayers}
              onChange={(e) => setTotalPlayers(e.target.value)}
              inputProps={{ min: 0 }}
              onBlur={() =>
                setTotalPlayers((v) =>
                  v === "" || isNaN(Number(v)) ? "0" : String(parseInt(v, 10))
                )
              }
              error={!!errors.totalPlayers}
              helperText={errors.totalPlayers}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              type="number"
              label="Total Amount"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              inputProps={{ min: 0, step: "0.01" }}
              onBlur={() =>
                setTotalAmount((v) =>
                  v === "" || isNaN(Number(v)) ? "0" : String(parseFloat(v))
                )
              }
              error={!!errors.totalAmount}
              helperText={errors.totalAmount}
            />
          </Grid>
        </Grid>

        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Button
            startIcon={<AddCircleIcon />}
            variant="contained"
            color="success"
            onClick={addTier}
          >
            Add Tier
          </Button>
        </Stack>

        <Stack spacing={1}>
          {tiers.map((t, i) => (
            <Card key={i} variant="outlined">
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Label (e.g., 1 or 3-10)"
                      value={t.label}
                      onChange={(e) => handleLabelChange(i, e.target.value)}
                      error={!!errors.tiers[i]?.label}
                      helperText={errors.tiers[i]?.label}
                    />
                  </Grid>

                  <Grid item xs={6} md={2}>
                    <TextField
                      fullWidth
                      label="Start"
                      value={t.startRank}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <TextField
                      fullWidth
                      label="End"
                      value={t.endRank}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Amount per User"
                      value={t.amountPerUser}
                      onChange={(e) =>
                        handleTierChange(i, "amountPerUser", e.target.value)
                      }
                      inputProps={{ min: 0, step: "0.01" }}
                      onBlur={(e) =>
                        handleTierChange(
                          i,
                          "amountPerUser",
                          e.target.value === "" || isNaN(Number(e.target.value))
                            ? ""
                            : String(parseFloat(e.target.value))
                        )
                      }
                      error={!!errors.tiers[i]?.amountPerUser}
                      helperText={errors.tiers[i]?.amountPerUser}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={10}
                    md={1.8}
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Typography variant="body2" fontWeight={600}>
                      Total: {t.totalAmount.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    md={0.2}
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <IconButton
                      aria-label="delete tier"
                      color="error"
                      onClick={() => removeTier(i)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Stack spacing={1}>
          <Typography variant="h6" fontWeight={700}>
            Overall Distributed: {calculateOverallTotal().toFixed(2)} /{" "}
            {numericTotalAmount.toFixed(2)}
          </Typography>

          {!!error && <Alert severity="error">{error}</Alert>}

          <Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!!error || tiers.length === 0 || isLoading} // disable when loading
              startIcon={
                isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : null
              } // show loading spinner
            >
              {isLoading ? "Submitting..." : "Submit Reward Tier"} 
            </Button>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
};

export default RewardTier;
