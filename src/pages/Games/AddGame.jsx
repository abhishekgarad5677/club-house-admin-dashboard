import React, { useEffect, useState } from "react";
import {
  Button,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Grid from "@mui/material/Grid2";
import {
  useAddGameMutation,
  useGetAllCategoriesMutation,
} from "../../redux/slices/apiSlice";
import { useForm, Controller } from "react-hook-form";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Link } from "react-router-dom";

const AddGame = () => {
  const [data, setData] = useState([]);

  const [getCategoryData, { isLoading, error, data: getAllCategories }] =
    useGetAllCategoriesMutation();

  const [
    createGame,
    {
      isLoading: createGameLoading,
      error: createGameError,
      data: createGameData,
    },
  ] = useAddGameMutation();

  useEffect(() => {
    getCategoryData({});
  }, []);

  useEffect(() => {
    if (getAllCategories) {
      setData(getAllCategories?.data);
    }
  }, [getAllCategories]);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    const form = new FormData();

    form.append("Id", parseInt(formData.id, 10)); // 👈 ensure integer
    form.append("Name", formData?.name);
    form.append("GameTutorialURL", formData?.tutorialUrl);

    const selectedCategoryNames = formData?.category || [];
    form.append("CateoryIds", JSON.stringify(selectedCategoryNames));
    form.append("Description", formData?.description || "");

    if (formData?.icon instanceof File) {
      form.append("Icon", formData.icon);
    }
    if (formData?.assetAOS instanceof File) {
      form.append("AssetBundleAOS", formData.assetAOS);
    }
    if (formData?.assetIOS instanceof File) {
      form.append("AssetBundleIOS", formData.assetIOS);
    }

    for (let pair of form.entries()) {
      console.log(pair[0] + ": ", pair[1]);
    }

    createGame(form);
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
            label: "Add Game",
            href: "/dashboard/add-games",
            icon: <AddCircleIcon fontSize="small" />,
          },
        ]}
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
          to={"/dashboard/games"}
        >
          <ArrowBackIosIcon sx={{ fontSize: 14 }} />
          back
        </Link>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid size={6}>
              <Typography variant="subtitle1" fontWeight={"500"} gutterBottom>
                Game ID
              </Typography>
              <Controller
                name="id"
                control={control}
                rules={{
                  required: "ID is required",
                  validate: (value) =>
                    Number.isInteger(Number(value)) || "ID must be an integer",
                }}
                render={({ field }) => (
                  <OutlinedInput
                    {...field}
                    fullWidth
                    size="small"
                    type="number"
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                )}
              />
              {errors.id && <p style={{ color: "red" }}>{errors.id.message}</p>}
            </Grid>

            {/* Name */}
            <Grid size={6}>
              <Typography variant="subtitle1" fontWeight={"500"} gutterBottom>
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

            {/* Icon upload */}
            <Grid size={6}>
              <Typography variant="subtitle1" fontWeight={"500"} gutterBottom>
                Icon
              </Typography>
              <Controller
                name="icon"
                control={control}
                rules={{ required: "Icon image is required" }}
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
            </Grid>

            {/* Game Tutorial URL */}
            <Grid size={6}>
              <Typography variant="subtitle1" fontWeight={"500"} gutterBottom>
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

            {/* Select Category (MULTI SELECT) */}
            <Grid size={6}>
              <Typography variant="subtitle1" fontWeight={"500"} gutterBottom>
                Select Category
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
                    {data?.map((ele, index) => (
                      <MenuItem key={index} value={ele?.name}>
                        {ele?.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.category && (
                <p style={{ color: "red" }}>{errors.category.message}</p>
              )}
            </Grid>

            {/* Asset Bundle AOS */}
            <Grid size={6}>
              <Typography variant="subtitle1" fontWeight={"500"} gutterBottom>
                Asset Bundle AOS
              </Typography>
              <Controller
                name="assetAOS"
                control={control}
                rules={{ required: "Asset Bundle AOS is required" }}
                render={({ field }) => (
                  <OutlinedInput
                    fullWidth
                    size="small"
                    type="file"
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                  />
                )}
              />
              {errors.assetAOS && (
                <p style={{ color: "red" }}>{errors.assetAOS.message}</p>
              )}
            </Grid>

            {/* Asset Bundle IOS */}
            <Grid size={6}>
              <Typography variant="subtitle1" fontWeight={"500"} gutterBottom>
                Asset Bundle IOS
              </Typography>
              <Controller
                name="assetIOS"
                control={control}
                rules={{ required: "Asset Bundle IOS is required" }}
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
            </Grid>

            {/* Description */}
            <Grid size={6}>
              <Typography variant="subtitle1" fontWeight={"500"} gutterBottom>
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

            {/* Submit */}
            <Grid size={12} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ width: "18%", backgroundColor: "#1E218D" }}
                type="submit"
                disabled={createGameLoading}
              >
                {createGameLoading ? "Adding..." : "Add Game"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </>
  );
};

export default AddGame;
