// src/pages/JoinBotTournament.jsx
import React, { useMemo, useState } from "react";
import {
  Container,
  Box,
  Paper,
  Stack,
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
  Alert,
  Divider,
  Card,
  CardContent,
  Tooltip,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";


const int = (v) => (isNaN(Number(v)) ? 0 : Math.floor(Number(v)));
const clamp = (n, a, b) => Math.min(b, Math.max(a, n));

const DEFAULT_GROUP = () => ({
  totalUser: 1,
  manual: true,
  totalAttempt: 1,
  scoresPerAttempt: [100],
  minScore: 0,
  maxScore: 100,
  minAttempts: 1,
  maxAttempts: 1,
});

const JoinBot = () => {
  const [tournamentId, setTournamentId] = useState("");
  const [botUserRoleId, setBotUserRoleId] = useState(
    "d323ebb3-a045-4dab-bea1-777c98bf0b79"
  );
  const [autoPopulateRemaining, setAutoPopulateRemaining] = useState(true);

  const [groups, setGroups] = useState([DEFAULT_GROUP()]);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  const totalUsersPlanned = useMemo(
    () => groups.reduce((a, g) => a + int(g.totalUser), 0),
    [groups]
  );

  const updateGroup = (i, patch) => {
    setGroups((prev) =>
      prev.map((g, idx) => {
        if (idx !== i) return g;
        const next = { ...g, ...patch };
        // keep attempts/scores coherent in manual mode
        if ("manual" in patch) {
          if (patch.manual) {
            const ta = Math.max(
              1,
              int(next.totalAttempt || g.totalAttempt || 1)
            );
            const arr = (
              next.scoresPerAttempt ||
              g.scoresPerAttempt ||
              []
            ).slice(0, ta);
            while (arr.length < ta) arr.push(next.maxScore ?? 100);
            next.totalAttempt = ta;
            next.minAttempts = ta;
            next.maxAttempts = ta;
            next.scoresPerAttempt = arr;
          }
        }
        if ("totalAttempt" in patch && (next.manual || g.manual)) {
          const ta = Math.max(1, int(patch.totalAttempt));
          next.totalAttempt = ta;
          next.minAttempts = ta;
          next.maxAttempts = ta;
          const arr = (next.scoresPerAttempt || []).slice(0, ta);
          while (arr.length < ta) arr.push(next.maxScore ?? 100);
          next.scoresPerAttempt = arr;
        }
        return next;
      })
    );
  };

  const addGroup = () => setGroups((g) => [...g, DEFAULT_GROUP()]);
  const removeGroup = (i) => setGroups((g) => g.filter((_, idx) => idx !== i));
  const resetAll = () => {
    setTournamentId("");
    setBotUserRoleId("");
    setAutoPopulateRemaining(true);
    setGroups([DEFAULT_GROUP()]);
    setMsg("");
  };

  const payload = useMemo(() => {
    return {
      tournamentId: int(tournamentId),
      botUserRoleId: (botUserRoleId || "").trim(),
      autoPopulateRemaining: !!autoPopulateRemaining,
      rankConfigs: groups.map((g) => {
        const totalUser = int(g.totalUser);
        const manual = !!g.manual;
        if (manual) {
          const totalAttempt = int(g.totalAttempt) || 1;
          const scoresPerAttempt = (g.scoresPerAttempt || [])
            .slice(0, totalAttempt)
            .map((n) => Number(n));
          const minScore = Number(g.minScore ?? Math.min(...scoresPerAttempt));
          const maxScore = Number(g.maxScore ?? Math.max(...scoresPerAttempt));
          return {
            totalUser,
            totalAttempt,
            manual,
            scoresPerAttempt,
            minScore,
            maxScore,
            minAttempts: totalAttempt,
            maxAttempts: totalAttempt,
          };
        } else {
          const minAttempts = int(g.minAttempts) || 1;
          const maxAttempts = Math.max(
            minAttempts,
            int(g.maxAttempts) || minAttempts
          );
          const minScore = Number(g.minScore ?? 0);
          const maxScore = Number(g.maxScore ?? minScore);
          return {
            totalUser,
            manual,
            minScore,
            maxScore,
            minAttempts,
            maxAttempts,
          };
        }
      }),
    };
  }, [tournamentId, botUserRoleId, autoPopulateRemaining, groups]);

  const submit = async () => {
    setMsg("");
    if (!payload.tournamentId) {
      setMsg("Enter a valid Tournament ID.");
      return;
    }
    if (!payload.botUserRoleId) {
      setMsg("Enter Bot User Role ID.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.joinBots(payload);
      setMsg(res?.data?.message || "Bots joined successfully.");
    } catch (e) {
      setMsg(e?.response?.data?.message || "Failed to join bots.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Actions */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Join Bot Users to Tournament
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Configure rank groups, attempts, and scores. Submit to seed bots.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              onClick={resetAll}
              variant="outlined"
              startIcon={<RefreshIcon />}
            >
              Reset
            </Button>
            <Button
              onClick={submit}
              disabled={submitting}
              variant="contained"
              startIcon={<CloudUploadIcon />}
            >
              {submitting ? "Submitting…" : "Submit"}
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Message */}
      {msg && (
        <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
          {msg}
        </Alert>
      )}

      {/* Tournament Section */}
      <Paper elevation={1} sx={{ mb: 3, borderRadius: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", p: 2.5 }}>
          <Typography variant="h6">Tournament</Typography>
        </Box>

        <Box sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                type="number"
                label="Tournament ID"
                placeholder="e.g. 3"
                value={tournamentId}
                onChange={(e) => setTournamentId(e.target.value)}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={8}>
              <TextField
                label="Bot User Role ID (GUID)"
                placeholder="d323ebb3-a045-4dab-bea1-777c98bf0b79"
                value={botUserRoleId}
                onChange={(e) => setBotUserRoleId(e.target.value)}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={autoPopulateRemaining}
                    onChange={(e) => setAutoPopulateRemaining(e.target.checked)}
                  />
                }
                label="Auto-populate remaining users"
              />
            </Grid>

            <Grid
              item
              xs={12}
              md={8}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Typography variant="body2" color="text.secondary">
                Planned users across groups:{" "}
                <Typography component="b" variant="body2" fontWeight={700}>
                  {totalUsersPlanned}
                </Typography>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Rank Groups */}
      <Paper elevation={1} sx={{ mb: 3, borderRadius: 3 }}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            p: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">Rank Configs</Typography>
          <Button
            onClick={addGroup}
            variant="outlined"
            startIcon={<AddCircleOutlineIcon />}
          >
            Add Group
          </Button>
        </Box>

        <Box sx={{ p: 3 }}>
          <Stack spacing={2}>
            {groups.map((g, i) => (
              <Card key={i} variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mb: 2 }}
                  >
                    <Typography variant="subtitle2" fontWeight={700}>
                      Group #{i + 1}
                    </Typography>
                    <Tooltip title="Remove group">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => removeGroup(i)}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                      <TextField
                        type="number"
                        label="Total Users"
                        inputProps={{ min: 1 }}
                        value={g.totalUser}
                        onChange={(e) =>
                          updateGroup(i, {
                            totalUser: Math.max(1, int(e.target.value)),
                          })
                        }
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Select
                        value={g.manual ? "manual" : "auto"}
                        onChange={(e) =>
                          updateGroup(i, {
                            manual: e.target.value === "manual",
                          })
                        }
                        fullWidth
                        displayEmpty
                      >
                        <MenuItem value="manual">
                          Manual Scores (per attempt)
                        </MenuItem>
                        <MenuItem value="auto">
                          Auto Range (score/attempts)
                        </MenuItem>
                      </Select>
                    </Grid>

                    {g.manual ? (
                      <>
                        <Grid item xs={12} md={3}>
                          <TextField
                            type="number"
                            label="Total Attempts"
                            inputProps={{ min: 1 }}
                            value={g.totalAttempt}
                            onChange={(e) =>
                              updateGroup(i, {
                                totalAttempt: Math.max(1, int(e.target.value)),
                              })
                            }
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} md={3}>
                          {/* Spacer to keep grid alignment */}
                        </Grid>

                        <Grid item xs={12} md={3}>
                          <TextField
                            type="number"
                            label="Min Score (opt)"
                            value={g.minScore}
                            onChange={(e) =>
                              updateGroup(i, {
                                minScore: Number(e.target.value),
                              })
                            }
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <TextField
                            type="number"
                            label="Max Score (opt)"
                            value={g.maxScore}
                            onChange={(e) =>
                              updateGroup(i, {
                                maxScore: Number(e.target.value),
                              })
                            }
                            fullWidth
                          />
                        </Grid>

                        {/* Scores per attempt */}
                        <Grid item xs={12}>
                          <Paper
                            variant="outlined"
                            sx={{ p: 2, borderRadius: 2 }}
                          >
                            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                              Scores Per Attempt
                            </Typography>
                            <Grid container spacing={2}>
                              {Array.from({
                                length: int(g.totalAttempt) || 1,
                              }).map((_, aIdx) => (
                                <Grid item xs={12} sm={6} md={3} key={aIdx}>
                                  <TextField
                                    type="number"
                                    label={`Attempt #${aIdx + 1}`}
                                    value={g.scoresPerAttempt?.[aIdx] ?? ""}
                                    onChange={(e) => {
                                      const val = Number(e.target.value);
                                      setGroups((prev) =>
                                        prev.map((gg, gi) => {
                                          if (gi !== i) return gg;
                                          const arr = [
                                            ...(gg.scoresPerAttempt || []),
                                          ];
                                          const ta = Math.max(
                                            1,
                                            int(gg.totalAttempt || 1)
                                          );
                                          if (arr.length < ta) {
                                            while (arr.length < ta)
                                              arr.push(gg.maxScore ?? 100);
                                          }
                                          arr[aIdx] = clamp(
                                            val,
                                            Number(gg.minScore) || -1e9,
                                            Number(gg.maxScore) || 1e9
                                          );
                                          return {
                                            ...gg,
                                            scoresPerAttempt: arr,
                                          };
                                        })
                                      );
                                    }}
                                    fullWidth
                                  />
                                </Grid>
                              ))}
                            </Grid>
                          </Paper>
                        </Grid>
                      </>
                    ) : (
                      <>
                        <Grid item xs={12} md={3}>
                          <TextField
                            type="number"
                            label="Min Attempts"
                            inputProps={{ min: 1 }}
                            value={g.minAttempts}
                            onChange={(e) => {
                              const v = Math.max(1, int(e.target.value));
                              updateGroup(i, {
                                minAttempts: v,
                                maxAttempts: Math.max(v, int(g.maxAttempts)),
                              });
                            }}
                            fullWidth
                          />
                        </Grid>

                        <Grid item xs={12} md={3}>
                          <TextField
                            type="number"
                            label="Max Attempts"
                            inputProps={{ min: g.minAttempts || 1 }}
                            value={g.maxAttempts}
                            onChange={(e) =>
                              updateGroup(i, {
                                maxAttempts: Math.max(
                                  int(g.minAttempts) || 1,
                                  int(e.target.value)
                                ),
                              })
                            }
                            fullWidth
                          />
                        </Grid>

                        <Grid item xs={12} md={3}>
                          <TextField
                            type="number"
                            label="Min Score"
                            value={g.minScore}
                            onChange={(e) =>
                              updateGroup(i, {
                                minScore: Number(e.target.value),
                              })
                            }
                            fullWidth
                          />
                        </Grid>

                        <Grid item xs={12} md={3}>
                          <TextField
                            type="number"
                            label="Max Score"
                            value={g.maxScore}
                            onChange={(e) => {
                              const v = Number(e.target.value);
                              updateGroup(i, {
                                maxScore: Math.max(Number(g.minScore) || 0, v),
                              });
                            }}
                            fullWidth
                          />
                        </Grid>
                      </>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            ))}

            {!groups.length && (
              <Alert severity="info">No groups. Add one to begin.</Alert>
            )}
          </Stack>
        </Box>
      </Paper>

      {/* Preview */}
      <Paper elevation={1} sx={{ borderRadius: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", p: 2.5 }}>
          <Typography variant="h6">Request Preview</Typography>
        </Box>
        <Box sx={{ p: 3 }}>
          <Box
            component="pre"
            sx={{
              maxHeight: 300,
              overflow: "auto",
              p: 2,
              borderRadius: 2,
              bgcolor: "grey.50",
              border: "1px solid",
              borderColor: "divider",
              fontSize: 12,
            }}
          >
            {JSON.stringify(payload, null, 2)}
          </Box>
        </Box>
      </Paper>

      <Divider sx={{ my: 4 }} />
    </Container>
  );
};

export default JoinBot;
