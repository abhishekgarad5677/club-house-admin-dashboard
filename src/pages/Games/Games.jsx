import { Box, Button, Chip, Paper, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { CommonTable } from "../../components/table/Table";
import { useFormattedDate } from "../../utils/Hooks";
import { useGetAllGamesMutation } from "../../redux/slices/apiSlice";
import TableSkeleton from "../../components/skeleton/TableSkeleton";
import AddIcon from "@mui/icons-material/Add";
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { useNavigate } from "react-router-dom";

const Games = () => {
  const [data, setData] = useState();
  const navigate = useNavigate();

  const [postData, { isLoading, error, data: getAllGames }] =
    useGetAllGamesMutation();

  useEffect(() => {
    postData({});
  }, []);

  useEffect(() => {
    if (getAllGames) {
      console.log(getAllGames?.data[0]?.allGamesList);

      setData(getAllGames?.data[0]?.allGamesList);
    }
  }, [getAllGames]);

  const columns = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "name", headerName: "Name", width: 250 },
    { field: "version", headerName: "Version", width: 150 },
    { field: "playCount", headerName: "Play Count", width: 150 },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 200,
      renderCell: (params) => useFormattedDate(params?.row?.createdAt),
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      width: 200,
      renderCell: (params) => useFormattedDate(params?.row?.updatedAt),
    },
    { field: "tournaments", headerName: "Tournaments", width: 150 },
    {
      field: "tournamentSchedules",
      headerName: "Tournaments Scheduled",
      width: 250,
    },
  ];

  return (
    <>
      <CustomBreadcrumbs
        items={[
          {
            label: "Games",
            href: "/dashboard/games",
            icon: <SportsEsportsIcon fontSize="small" />,
          },
        ]}
      />
      <Paper sx={{ height: "auto", width: "100%", padding: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          mb={2}
          sx={{
            gap: 1,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          {/* search student */}
          <TextField
            label="search game"
            variant="outlined"
            size="small"
            // onChange={(e) => filterUserData(e)}
          />

          {/* add category button */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              width: { xs: "100%", sm: "auto", backgroundColor: "#1E218D" },
            }}
            onClick={() => navigate("/dashboard/add-games")}
          >
            Add Game
          </Button>
        </Box>
        {/* all games table */}
        {isLoading ? (
          <TableSkeleton rows={10} columns={6} />
        ) : (
          <CommonTable
            userTableData={data}
            columns={columns}
            pageSizeOptions={[10, 15, 20, 50, 100]}
          />
        )}
      </Paper>
    </>
  );
};

export default Games;
