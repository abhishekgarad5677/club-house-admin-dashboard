import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormHelperText,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  styled,
  TextField,
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

const AddGame = () => {
  const [data, setData] = useState([]);

  const [getCategoryData, { isLoading, error, data: getAllCategories }] =
    useGetAllCategoriesMutation();

  const [
    createGame,
    {
      isLoading: createGameLoading0,
      error: createGameError,
      data: createGameData,
    },
  ] = useAddGameMutation();

  useEffect(() => {
    getCategoryData({});
  }, []);

  useEffect(() => {
    if (getAllCategories) {
      setData(getAllCategories?.data[0]?.activeCategory);
    }
  }, [getAllCategories]);

  // console.log(data);
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    const form = new FormData();

    form.append("Name", formData?.name);
    form.append("Version", formData?.version);
    form.append("GameTutorialURL", formData?.tutorialUrl);
    form.append("CateoryIds", formData?.category);

    if (formData?.assetAOS instanceof File) {
      form.append("AssetBundleAOS", formData?.assetAOS);
    } else {
      console.error("AssetBundleAOS is missing or not a File");
    }

    if (formData?.assetIOS instanceof File) {
      form.append("AssetBundleIOS", formData?.assetIOS);
    } else {
      console.error("AssetBundleIOS is missing or not a File");
    }

    // ✅ Correct way to log FormData:
    for (let pair of form.entries()) {
      console.log(pair[0] + ": ", pair[1]);
    }

    // console.log(form);

    createGame(form)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log("error", err);
      });

    // Now send the form to API (if needed)
    // await createGame(form);
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid size={6}>
              <Typography variant="subtitle1" fontWeight={"500"} gutterBottom>
                Name
              </Typography>
              {/* <OutlinedInput
                name="name"
                control={control}
                rules={{ required: "Name is required" }}
                render={({ field }) => (
                  <OutlinedInput {...field} fullWidth size="small" />
                )}
                fullWidth
                size="small"
              /> */}
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
            <Grid size={6}>
              <Typography variant="subtitle1" fontWeight={"500"} gutterBottom>
                Version
              </Typography>
              {/* <OutlinedInput fullWidth size="small" /> */}
              <Controller
                name="version"
                control={control}
                rules={{ required: "Version is required" }}
                render={({ field }) => (
                  <OutlinedInput {...field} fullWidth size="small" />
                )}
              />
              {errors.version && (
                <p style={{ color: "red" }}>{errors.version.message}</p>
              )}
            </Grid>
            <Grid size={6}>
              <Typography variant="subtitle1" fontWeight={"500"} gutterBottom>
                Game Tutorial URL
              </Typography>
              {/* <OutlinedInput fullWidth size="small" /> */}
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
            <Grid size={6}>
              <Typography variant="subtitle1" fontWeight={"500"} gutterBottom>
                Select Category
              </Typography>
              {/* <Select
                fullWidth
                input={<OutlinedInput fullWidth size="small" />}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                defaultValue={"default"}
              >
                <MenuItem value={"default"}>
                  <em>None</em>
                </MenuItem>
                {data?.map((ele, index) => {
                  return (
                    <MenuItem key={index} value={ele?.id}>
                      {ele?.name}
                    </MenuItem>
                  );
                })}
              </Select> */}
              <Controller
                name="category"
                control={control}
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    fullWidth
                    displayEmpty
                    input={<OutlinedInput size="small" />}
                  >
                    <MenuItem value="default">
                      <em>None</em>
                    </MenuItem>
                    {data?.map((ele, index) => (
                      <MenuItem key={index} value={ele?.id}>
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
            <Grid size={6}>
              <Typography variant="subtitle1" fontWeight={"500"} gutterBottom>
                Asset Bundle AOS
              </Typography>
              {/* <OutlinedInput type="file" fullWidth size="small" /> */}
              <Controller
                name="assetAOS"
                control={control}
                rules={{ required: "Asset Bundle AOS is required" }}
                render={({ field }) => (
                  <OutlinedInput
                    fullWidth
                    size="small"
                    type="file"
                    onChange={(e) => field.onChange(e.target.files[0])}
                  />
                )}
              />
              {errors.assetAOS && (
                <p style={{ color: "red" }}>{errors.assetAOS.message}</p>
              )}
            </Grid>
            <Grid size={6}>
              <Typography variant="subtitle1" fontWeight={"500"} gutterBottom>
                Asset Bundle IOS
              </Typography>
              {/* <OutlinedInput type="file" fullWidth size="small" /> */}
              <Controller
                name="assetIOS"
                control={control}
                rules={{ required: "Asset Bundle IOS is required" }}
                render={({ field }) => (
                  <OutlinedInput
                    type="file"
                    fullWidth
                    size="small"
                    onChange={(e) => field.onChange(e.target.files[0])}
                  />
                )}
              />
              {errors.assetIOS && (
                <p style={{ color: "red" }}>{errors.assetIOS.message}</p>
              )}
            </Grid>
            <Grid size={6} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                // onClick={handleSubmit}
                sx={{ width: "30%" }}
                type="submit"
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </>
  );
};

export default AddGame;
