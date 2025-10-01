import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  TextField,
  Tooltip,
} from "@mui/material";
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";
import { CommonTable } from "../../components/table/Table";
import { useFormattedDate } from "../../utils/Hooks";
import { useGetAllGamesMutation } from "../../redux/slices/apiSlice";
import TableSkeleton from "../../components/skeleton/TableSkeleton";
import AddIcon from "@mui/icons-material/Add";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";

const GamesList = () => {
  const [data, setData] = useState();
  const navigate = useNavigate();

  const [postData, { isLoading, error, data: getAllGames }] =
    useGetAllGamesMutation();

  useEffect(() => {
    postData({});
  }, []);

  useEffect(() => {
    if (getAllGames) {
      setData(getAllGames?.data[0]?.allGamesList);
    }
  }, [getAllGames]);

  const columns = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "name", headerName: "Name", width: 250 },
    { field: "version", headerName: "Version", width: 150 },
    {
      field: "isUnderMaintenance",
      headerName: "Under Maintenance",
      width: 200,
      renderCell: (params) =>
        params?.row?.isUnderMaintenance ? (
          <Chip label="Yes" size="small" />
        ) : (
          <Chip label="No" size="small" />
        ),
    },
    {
      field: "actions",
      headerName: "Action",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title="View Tournament" placement="top">
          <IconButton
            color="primary"
            onClick={() =>
              navigate(`/dashboard/game-tournament/${params.row.id}`)
            }
          >
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  if (error) {
    return <Alert severity="error">Error while fetching data.</Alert>;
  }

  return (
    <>
      <CustomBreadcrumbs
        items={[
          {
            label: "Games List",
            href: "/dashboard/games-list",
            icon: <SportsEsportsIcon fontSize="small" />,
          },
        ]}
      />
      <Paper sx={{ height: "auto", width: "100%", padding: 3 }}>
        <Alert sx={{ mb: 2 }} severity="info">
          Click on any game row to view its tournaments
        </Alert>
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
          {/* <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              width: { xs: "100%", sm: "auto", backgroundColor: "#1E218D" },
            }}
            onClick={() => navigate("/dashboard/add-games")}
          >
            Add Game
          </Button> */}
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

export default GamesList;
