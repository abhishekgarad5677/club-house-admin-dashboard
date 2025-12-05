import React, { useEffect } from "react";
import {
  Button,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Typography,
  Box,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import CategoryIcon from "@mui/icons-material/Category";
import EditIcon from "@mui/icons-material/Edit";
import { useForm, Controller } from "react-hook-form";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";
import { Link } from "react-router-dom";
// import { useGetGameByIdQuery, useUpdateGameMutation } from "../../redux/slices/apiSlice";

// 🔹 Dummy game data – later replace with API data
const dummyGame = {
  id: "1",
  name: "Gada Electronics Runner",
  description:
    "Endless runner game where Jethalal dodges obstacles and collects gadgets from Gada Electronics.",
  tutorialUrl: "https://youtu.be/dQw4w9WgXcQ",
  categories: ["Arcade", "Runner"],

  iconUrl: "https://via.placeholder.com/160x160.png?text=Game+Icon",
  assetBundleAOSUrl: "https://example.com/bundles/gada-runner-aos",
  assetBundleIOSUrl: "https://example.com/bundles/gada-runner-ios",
};

// Dummy category list (replace with API)
const dummyCategories = [
  { id: 1, name: "Arcade" },
  { id: 2, name: "Runner" },
  { id: 3, name: "Puzzle" },
  { id: 4, name: "Kids" },
];

const EditGame = () => {
  // In real app:
  // const { id } = useParams();
  // const { data: game, isLoading } = useGetGameByIdQuery(id);
  // const [updateGame, { isLoading: updateLoading }] = useUpdateGameMutation();

  const game = dummyGame;
  const categories = dummyCategories;

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      tutorialUrl: "",
      description: "",
      category: [],
      icon: null,
      assetAOS: null,
      assetIOS: null,
    },
  });

  // Prefill form when game data is available
  useEffect(() => {
    if (game) {
      reset({
        name: game.name || "",
        tutorialUrl: game.tutorialUrl || "",
        description: game.description || "",
        category: game.categories || [],
        icon: null,
        assetAOS: null,
        assetIOS: null,
      });
    }
  }, [game, reset]);

  const onSubmit = async (formData) => {
    const form = new FormData();

    form.append("Name", formData.name);
    form.append("GameTutorialURL", formData.tutorialUrl);
    form.append("Description", formData.description || "");

    // categories = array of names
    form.append("CateoryIds", JSON.stringify(formData.category || []));

    // Icon – only send if new file selected
    if (formData.icon instanceof File) {
      form.append("Icon", formData.icon);
    }

    // Asset AOS – only send if new file selected
    if (formData.assetAOS instanceof File) {
      form.append("AssetBundleAOS", formData.assetAOS);
    }

    // Asset IOS – only send if new file selected
    if (formData.assetIOS instanceof File) {
      form.append("AssetBundleIOS", formData.assetIOS);
    }

    // Debug log
    for (let pair of form.entries()) {
      console.log(pair[0] + ": ", pair[1]);
    }

    // In real app:
    // await updateGame({ id: game.id, body: form });

    console.log("Edit form submitted for game id:", game.id);
  };

  // if (isLoading) return <div>Loading...</div>;

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
            label: "Edit Game",
            href: `/dashboard/edit-game`,
            icon: <EditIcon fontSize="small" />,
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
            justifyContent: "flex-start",
            marginBottom: 10,
            width: "fit-content",
          }}
          to={"/dashboard/games"}
        >
          <ArrowBackIosIcon sx={{ fontSize: 14 }} />
          back
        </Link>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* LEFT SIDE: Icon & current file info */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                Current Icon
              </Typography>
              <Box
                sx={{
                  width: 160,
                  height: 160,
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "1px solid #eee",
                  bgcolor: "#fafafa",
                  mb: 2,
                }}
              >
                <img
                  src={game.iconUrl}
                  alt={game.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Uploading a new icon will replace the current one.
              </Typography>
              <Controller
                name="icon"
                control={control}
                render={({ field }) => (
                  <OutlinedInput
                    type="file"
                    fullWidth
                    size="small"
                    inputProps={{ accept: "image/*" }}
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                  />
                )}
              />
              {errors.icon && (
                <p style={{ color: "red" }}>{errors.icon.message}</p>
              )}

              {/* Current asset bundle links (AOS & IOS) */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                  Current Asset Bundles
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Android (AOS):
                </Typography>
                {game.assetBundleAOSUrl ? (
                  <Button
                    variant="text"
                    size="small"
                    sx={{ pl: 0, mb: 1 }}
                    href={game.assetBundleAOSUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View / Download AOS Bundle
                  </Button>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    No AOS bundle uploaded.
                  </Typography>
                )}

                <Controller
                  name="assetAOS"
                  control={control}
                  render={({ field }) => (
                    <OutlinedInput
                      type="file"
                      fullWidth
                      size="small"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                    />
                  )}
                />
                {errors.assetAOS && (
                  <p style={{ color: "red" }}>{errors.assetAOS.message}</p>
                )}

                <Box sx={{ mt: 2 }} />

                <Typography variant="body2" color="text.secondary">
                  iOS:
                </Typography>
                {game.assetBundleIOSUrl ? (
                  <Button
                    variant="text"
                    size="small"
                    sx={{ pl: 0, mb: 1 }}
                    href={game.assetBundleIOSUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View / Download iOS Bundle
                  </Button>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    No iOS bundle uploaded.
                  </Typography>
                )}

                <Controller
                  name="assetIOS"
                  control={control}
                  render={({ field }) => (
                    <OutlinedInput
                      type="file"
                      fullWidth
                      size="small"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                    />
                  )}
                />
                {errors.assetIOS && (
                  <p style={{ color: "red" }}>{errors.assetIOS.message}</p>
                )}
              </Box>
            </Grid>

            {/* RIGHT SIDE: Text fields & categories */}
            <Grid size={{ xs: 12, md: 8 }}>
              {/* Name */}
              <Grid container spacing={3}>
                <Grid size={12}>
                  <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                    Name
                  </Typography>
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: "Name is required" }}
                    render={({ field }) => (
                      <OutlinedInput {...field} fullWidth size="small" />
                    )}
                  />
                  {errors.name && (
                    <p style={{ color: "red" }}>{errors.name.message}</p>
                  )}
                </Grid>

                {/* Tutorial URL */}
                <Grid size={12}>
                  <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                    Game Tutorial URL
                  </Typography>
                  <Controller
                    name="tutorialUrl"
                    control={control}
                    rules={{ required: "URL is required" }}
                    render={({ field }) => (
                      <OutlinedInput {...field} fullWidth size="small" />
                    )}
                  />
                  {errors.tutorialUrl && (
                    <p style={{ color: "red" }}>{errors.tutorialUrl.message}</p>
                  )}
                </Grid>

                {/* Description */}
                <Grid size={12}>
                  <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                    Description
                  </Typography>
                  <Controller
                    name="description"
                    control={control}
                    rules={{ required: "Description is required" }}
                    render={({ field }) => (
                      <OutlinedInput
                        {...field}
                        fullWidth
                        size="small"
                        multiline
                        minRows={3}
                      />
                    )}
                  />
                  {errors.description && (
                    <p style={{ color: "red" }}>{errors.description.message}</p>
                  )}
                </Grid>

                {/* Categories (multi select, names) */}
                <Grid size={12}>
                  <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                    Select Categories
                  </Typography>
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: "At least one category is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        multiple
                        fullWidth
                        displayEmpty
                        input={<OutlinedInput size="small" />}
                        value={field.value || []}
                        onChange={(e) => field.onChange(e.target.value)}
                        renderValue={(selected) =>
                          (selected || []).length === 0
                            ? "Select categories"
                            : (selected || []).join(", ")
                        }
                      >
                        <MenuItem disabled value="">
                          <em>Select categories</em>
                        </MenuItem>
                        {categories.map((cat) => (
                          <MenuItem key={cat.id} value={cat.name}>
                            {cat.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.category && (
                    <p style={{ color: "red" }}>{errors.category.message}</p>
                  )}
                </Grid>

                {/* Submit */}
                <Grid size={12} sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ width: "20%", backgroundColor: "#1E218D" }}
                    type="submit"
                  >
                    Save Changes
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </>
  );
};

export default EditGame;
