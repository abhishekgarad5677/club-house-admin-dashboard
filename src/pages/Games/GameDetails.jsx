import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import CategoryIcon from "@mui/icons-material/Category";
import GamepadIcon from "@mui/icons-material/SportsEsports";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";
import { Link, useParams } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {
  useGetGameByIdQuery,
  useToggleGameMaintenanceMutation,
  useToggleGameLiveMutation, // 🔹 NEW
} from "../../redux/slices/apiSlice";

// Base URL for bundles
const BUNDLE_BASE_URL = "https://v6.mui.com/material-ui/react-table/";

// Placeholder game
const dummyGame = {
  id: "",
  name: "",
  iconUrl: "",
  description: "",
  tutorialUrl: "",
  categories: [],
  assetBundleName: "",
  createdAt: "",
  updatedAt: "",
  status: "Inactive",
  likeCount: 0,
  playCount: 0,
  isNewGame: false,
  isUnderMaintenance: false,
  isArchived: false,
  isLive: false,
};

const statusLabelMap = {
  isNewGame: "New Game",
  isLive: "Live",
  isUnderMaintenance: "Under Maintenance",
  isArchived: "Archived",
};

const ViewGame = () => {
  const { id } = useParams();

  const [game, setGame] = useState(dummyGame);

  const {
    data: gameResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetGameByIdQuery(id, {
    skip: !id,
  });

  const [toggleGameMaintenance, { isLoading: maintenanceUpdating }] =
    useToggleGameMaintenanceMutation();

  const [toggleGameLive, { isLoading: liveUpdating }] =
    useToggleGameLiveMutation(); // 🔹 NEW

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);

  // Map API → local state
  useEffect(() => {
    if (gameResponse?.data) {
      const g = gameResponse.data;

      setGame({
        id: g.id,
        name: g.name,
        iconUrl: g.iconURL,
        description: g.description,
        tutorialUrl: g.gameTutorialURL,
        categories: g.categoryNames || [],
        assetBundleName: g.assetBundleName,
        createdAt: g.createdAt,
        updatedAt: g.updatedAt,
        status: g.isLive ? "Active" : "Inactive",
        likeCount: g.likeCount ?? 0,
        playCount: g.playCount ?? 0,
        isNewGame: g.isNewGames ?? false,
        isUnderMaintenance: g.isUnderMaintenance ?? false,
        isArchived: g.isArchived ?? false,
        isLive: g.isLive ?? false,
      });
    }
  }, [gameResponse]);

  const handleToggleClick = (key, currentValue) => {
    setSelectedAction({ key, currentValue });
    setConfirmOpen(true);
  };

  const handleCloseDialog = () => {
    setConfirmOpen(false);
    setSelectedAction(null);
  };

  const confirmToggle = async () => {
    if (!selectedAction) return;

    const { key } = selectedAction;

    try {
      if (key === "isUnderMaintenance") {
        const formData = new FormData();
        formData.append("gameId", Number(game.id));

        await toggleGameMaintenance(formData);
        await refetch();
      } else if (key === "isLive") {
        const formData = new FormData();
        formData.append("gameId", Number(game.id));

        // 🔹 Call live toggle API
        await toggleGameLive(formData);
        // 🔹 Refetch latest game state
        await refetch();
      } else {
        // other statuses will be wired later with their own APIs
        console.log("Toggle for other status (no API yet):", key);
      }
    } catch (e) {
      console.error("Failed to toggle status:", e);
    } finally {
      handleCloseDialog();
    }
  };

  return (
    <>
      <CustomBreadcrumbs
        items={[
          {
            label: "Games",
            href: "/dashboard/games",
            icon: <CategoryIcon fontSize="small" />,
          },
          {
            label: "View Game",
            href: `/dashboard/game-details/${id}`,
            icon: <GamepadIcon fontSize="small" />,
          },
        ]}
      />

      <Paper sx={{ width: "100%", padding: 3 }}>
        <Link
          style={{
            textDecoration: "none",
            color: "#1976d2",
            display: "flex",
            alignItems: "center",
            marginBottom: 10,
            width: "fit-content",
          }}
          to={"/dashboard/games"}
        >
          <ArrowBackIosIcon sx={{ fontSize: 14 }} />
          back
        </Link>

        {isLoading && <Typography>Loading game details…</Typography>}

        {isError && (
          <Typography color="error">
            Failed to load game. {error?.data?.message}
          </Typography>
        )}

        {!isLoading && !isError && (
          <Grid container spacing={3}>
            {/* LEFT */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  padding: 2,
                  textAlign: "center",
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  Game Icon
                </Typography>

                <Box
                  sx={{
                    width: 160,
                    height: 160,
                    borderRadius: 2,
                    overflow: "hidden",
                    mx: "auto",
                    mb: 2,
                    border: "1px solid #eee",
                  }}
                >
                  <img
                    src={game.iconUrl}
                    alt={game.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>

                <Typography variant="h6" fontWeight={600}>
                  {game.name}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Status:{" "}
                  <strong
                    style={{
                      color: game.status === "Active" ? "#388e3c" : "#f57c00",
                    }}
                  >
                    {game.status}
                  </strong>
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Created: {game.createdAt}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Updated: {game.updatedAt}
                </Typography>
              </Box>
            </Grid>

            {/* RIGHT */}
            <Grid size={{ xs: 12, md: 8 }}>
              {/* Description */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Description
                </Typography>
                <Typography>{game.description}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Stats */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Game Stats
                </Typography>
                <Box sx={{ display: "flex", gap: 3 }}>
                  <Box>
                    <Typography variant="body2">Likes</Typography>
                    <Typography variant="h6">{game.likeCount}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2">Plays</Typography>
                    <Typography variant="h6">{game.playCount}</Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Status Flags */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Status Flags
                </Typography>

                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  {[
                    { label: "New Game", key: "isNewGame", color: "primary" },
                    { label: "Live", key: "isLive", color: "success" },
                    {
                      label: "Under Maintenance",
                      key: "isUnderMaintenance",
                      color: "warning",
                    },
                    { label: "Archived", key: "isArchived", color: "default" },
                  ].map((item) => (
                    <Box
                      key={item.key}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      <Chip
                        label={
                          game[item.key] ? item.label : `Not ${item.label}`
                        }
                        color={game[item.key] ? item.color : "default"}
                        size="small"
                        variant={game[item.key] ? "filled" : "outlined"}
                      />

                      <IconButton
                        onClick={() =>
                          handleToggleClick(item.key, game[item.key])
                        }
                        disabled={
                          (item.key === "isUnderMaintenance" &&
                            maintenanceUpdating) ||
                          (item.key === "isLive" && liveUpdating)
                        }
                      >
                        {game[item.key] ? (
                          <ToggleOnIcon
                            sx={{ color: item.color, fontSize: 30 }}
                          />
                        ) : (
                          <ToggleOffIcon sx={{ color: "#999", fontSize: 30 }} />
                        )}
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Categories */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Categories
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {game.categories.length ? (
                    game.categories.map((c) => (
                      <Chip key={c} label={c} size="small" color="primary" />
                    ))
                  ) : (
                    <Typography>No categories assigned</Typography>
                  )}
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Tutorial */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Tutorial URL
                </Typography>
                {game.tutorialUrl ? (
                  <Button
                    variant="outlined"
                    href={game.tutorialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open Tutorial
                  </Button>
                ) : (
                  <Typography>No tutorial URL</Typography>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Bundles */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Asset Bundles
                </Typography>

                <Grid container spacing={2}>
                  {/* AOS */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2">Android (AOS)</Typography>
                    {game.assetBundleName ? (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        href={`${BUNDLE_BASE_URL}${game.assetBundleName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View / Download AOS Bundle
                      </Button>
                    ) : (
                      <Typography>No AOS bundle link</Typography>
                    )}
                  </Grid>

                  {/* iOS */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2">iOS</Typography>
                    {game.assetBundleName ? (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        href={`${BUNDLE_BASE_URL}${game.assetBundleName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View / Download iOS Bundle
                      </Button>
                    ) : (
                      <Typography>No iOS bundle link</Typography>
                    )}
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        )}
      </Paper>

      {/* Confirm dialog */}
      <Dialog open={confirmOpen} onClose={handleCloseDialog}>
        <DialogTitle>
          {selectedAction
            ? `Are you sure you want to change "${
                statusLabelMap[selectedAction.key]
              }" status?`
            : "Are you sure you want to change this status?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="error">
            No
          </Button>
          <Button
            onClick={confirmToggle}
            color="primary"
            autoFocus
            disabled={
              (selectedAction?.key === "isUnderMaintenance" &&
                maintenanceUpdating) ||
              (selectedAction?.key === "isLive" && liveUpdating)
            }
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ViewGame;
