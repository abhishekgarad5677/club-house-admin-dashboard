import React, { useEffect, useState } from "react";
import { Box, Button, Chip, Paper, TextField, Tooltip } from "@mui/material";
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";
import { useFormattedDate } from "../../utils/Hooks";
import { useGetAllGamesMutation } from "../../redux/slices/apiSlice";
import TableSkeleton from "../../components/skeleton/TableSkeleton";
import AddIcon from "@mui/icons-material/Add";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import { useNavigate } from "react-router-dom";
import { TableWithExport } from "../../components/table/TableWithExport";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

const Games = () => {
  const [data, setData] = useState();
  const navigate = useNavigate();
  const [rowCount, setRowCount] = useState(0);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [postData, { isLoading, error, data: getAllGames }] =
    useGetAllGamesMutation();

  useEffect(() => {
    const formData = new FormData();

    formData.append("FilterType", "lifetime");
    formData.append("PageSize", paginationModel.pageSize);
    formData.append("PageNumber", paginationModel.page + 1); // API is 1-indexed

    postData(formData);
  }, []);

  useEffect(() => {
    if (getAllGames) {
      console.log(getAllGames?.data?.games);
      setData(getAllGames?.data?.games);
      setRowCount(getAllGames?.data?.totalCount);
    }
  }, [getAllGames]);

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Name", width: 250 },
    { field: "version", headerName: "Version", width: 150 },
    { field: "playCount", headerName: "Play Count", width: 130 },
    { field: "likeCount", headerName: "Like Count", width: 150 },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 200,
      renderCell: (params) => useFormattedDate(params?.row?.createdAt),
    },
    {
      field: "isUnderMaintenance",
      headerName: "Under Maintenance",
      width: 200,
      renderCell: (params) =>
        params?.row?.isUnderMaintenance ? (
          <Chip label="Yes" />
        ) : (
          <Chip label="No" />
        ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <Box
          sx={{ display: "flex", gap: 2, alignItems: "center", marginTop: 2 }}
        >
          <Tooltip title="View Tournament" arrow>
            <RemoveRedEyeIcon
              onClick={() =>
                navigate(`/dashboard/game-tournament/${params.row.id}`)
              }
              sx={{ color: "#5d87ff", cursor: "pointer" }}
            />
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <CustomBreadcrumbs
          items={[
            {
              label: "Games",
              href: "/dashboard/games",
              icon: <SportsEsportsIcon fontSize="small" />,
            },
          ]}
        />
      </Box>
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
          <TableWithExport
            userTableData={data?.map((d) => ({ ...d, id: d.id }))}
            columns={columns}
            pageSizeOptions={[10, 15, 20, 50, 100]}
            rowCount={rowCount}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        )}
      </Paper>
    </>
  );
};

export default Games;
