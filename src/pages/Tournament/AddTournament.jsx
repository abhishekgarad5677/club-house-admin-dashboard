import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
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
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";

const AddTournament = () => {
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

    // createGame(form)
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((err) => {
    //     console.log("error", err);
    //   });

    // Now send the form to API (if needed)
    // await createGame(form);
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const allCountries = [
    "India",
    "USA",
    "UK",
    "Germany",
    "Australia",
    "Canada",
    "Brazil",
  ];

  return (
    <>
      <CustomBreadcrumbs
        items={[
          {
            label: "Tournament",
            href: "/dashboard/tournament",
            icon: <EmojiEventsIcon fontSize="small" />,
          },
          {
            label: "Add Tournament",
            href: "/dashboard/add-tournament",
            icon: <AddCircleIcon fontSize="small" />,
          },
        ]}
      />
      <Paper sx={{ height: "auto", width: "100%", padding: 3 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              {/* ...your existing inputs... */}

              {/* Minimum Players */}
              <Grid item size={6}>
                <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                  Minimum Players
                </Typography>
                <Controller
                  name="minPlayers"
                  control={control}
                  rules={{ required: "Minimum players required" }}
                  render={({ field }) => (
                    <OutlinedInput
                      {...field}
                      type="number"
                      fullWidth
                      size="small"
                    />
                  )}
                />
                {errors.minPlayers && (
                  <p style={{ color: "red" }}>{errors.minPlayers.message}</p>
                )}
              </Grid>

              {/* Maximum Players */}
              <Grid item size={6}>
                <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                  Maximum Players
                </Typography>
                <Controller
                  name="maxPlayers"
                  control={control}
                  rules={{ required: "Maximum players required" }}
                  render={({ field }) => (
                    <OutlinedInput
                      {...field}
                      type="number"
                      fullWidth
                      size="small"
                    />
                  )}
                />
                {errors.maxPlayers && (
                  <p style={{ color: "red" }}>{errors.maxPlayers.message}</p>
                )}
              </Grid>

              {/* Winning Prize */}
              <Grid item size={6}>
                <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                  Winning Prize
                </Typography>
                <Controller
                  name="winningPrize"
                  control={control}
                  rules={{
                    required: "Winning prize required",
                    min: {
                      value: 1,
                      message: "Winning prize must be greater than 0",
                    },
                  }}
                  render={({ field }) => (
                    <OutlinedInput
                      {...field}
                      type="number"
                      fullWidth
                      size="small"
                    />
                  )}
                />
                {errors.winningPrize && (
                  <p style={{ color: "red" }}>{errors.winningPrize.message}</p>
                )}
              </Grid>

              {/* Schedule Time */}
              <Grid item size={6}>
                <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                  Schedule Time
                </Typography>
                <Controller
                  name="scheduleTime"
                  control={control}
                  rules={{ required: "Schedule time is required" }}
                  render={({ field }) => (
                    <DateTimePicker
                      {...field}
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(val) => field.onChange(val?.toISOString())}
                      slotProps={{
                        textField: { fullWidth: true, size: "small" },
                      }}
                    />
                  )}
                />
                {errors.scheduleTime && (
                  <p style={{ color: "red" }}>{errors.scheduleTime.message}</p>
                )}
              </Grid>

              {/* Tournament Type */}
              <Grid item size={6}>
                <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                  Tournament Type
                </Typography>
                <Controller
                  name="tournamentType"
                  control={control}
                  rules={{ required: "Tournament type is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      fullWidth
                      input={<OutlinedInput size="small" />}
                    >
                      <MenuItem value="Algo1">
                        Winner takes all (Algo 1)
                      </MenuItem>
                      <MenuItem value="Algo2">Top 5% winners (Algo 2)</MenuItem>
                      <MenuItem value="Algo3">Top 10 winners (Algo 3)</MenuItem>
                    </Select>
                  )}
                />
                {errors.tournamentType && (
                  <p style={{ color: "red" }}>
                    {errors.tournamentType.message}
                  </p>
                )}
              </Grid>

              {/* Tournament Status */}
              <Grid item size={6}>
                <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                  Tournament Status
                </Typography>
                <Controller
                  name="tournamentStatus"
                  control={control}
                  rules={{ required: "Status is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      fullWidth
                      input={<OutlinedInput size="small" />}
                    >
                      <MenuItem value="Live">Live</MenuItem>
                      <MenuItem value="Upcoming">Upcoming</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                    </Select>
                  )}
                />
                {errors.tournamentStatus && (
                  <p style={{ color: "red" }}>
                    {errors.tournamentStatus.message}
                  </p>
                )}
              </Grid>

              {/* Start Time */}
              <Grid item size={6}>
                <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                  Start Time
                </Typography>
                <Controller
                  name="startTime"
                  control={control}
                  rules={{ required: "Start time required" }}
                  render={({ field }) => (
                    <DateTimePicker
                      {...field}
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(val) => field.onChange(val?.toISOString())}
                      slotProps={{
                        textField: { fullWidth: true, size: "small" },
                      }}
                    />
                  )}
                />
                {errors.startTime && (
                  <p style={{ color: "red" }}>{errors.startTime.message}</p>
                )}
              </Grid>

              {/* End Time */}
              <Grid item size={6}>
                <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                  End Time
                </Typography>
                <Controller
                  name="endTime"
                  control={control}
                  rules={{ required: "End time required" }}
                  render={({ field }) => (
                    <DateTimePicker
                      {...field}
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(val) => field.onChange(val?.toISOString())}
                      slotProps={{
                        textField: { fullWidth: true, size: "small" },
                      }}
                    />
                  )}
                />
                {errors.endTime && (
                  <p style={{ color: "red" }}>{errors.endTime.message}</p>
                )}
              </Grid>
              <Grid item size={6}>
                <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                  Eligible Countries
                </Typography>
                <Controller
                  name="eligibleCountries"
                  control={control}
                  defaultValue={[]} // Important: must be an array
                  rules={{ required: "At least one country must be selected" }}
                  render={({ field }) => (
                    <FormControl fullWidth size="small">
                      <InputLabel id="eligible-countries-label">
                        Countries
                      </InputLabel>
                      <Select
                        {...field}
                        labelId="eligible-countries-label"
                        multiple
                        value={field.value || []}
                        onChange={(e) => field.onChange(e.target.value)}
                        input={<OutlinedInput label="Countries" />}
                        renderValue={(selected) => selected.join(", ")}
                        MenuProps={MenuProps}
                      >
                        {allCountries.map((name) => (
                          <MenuItem key={name} value={name}>
                            <Checkbox checked={field.value?.includes(name)} />
                            <ListItemText primary={name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
                {errors.eligibleCountries && (
                  <p style={{ color: "red" }}>
                    {errors.eligibleCountries.message}
                  </p>
                )}
              </Grid>

              {/* Submit Button */}
              <Grid
                item
                size={12}
                sx={{ mt: 2, display: "flex", justifyContent: "center" }}
              >
                <Button
                  variant="contained"
                  sx={{ width: "20%", height: 46, backgroundColor: "#5D87FF" }}
                  type="submit"
                >
                  Create
                </Button>
              </Grid>
            </Grid>
          </form>
        </LocalizationProvider>
      </Paper>
    </>
  );
};

export default AddTournament;
