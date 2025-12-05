import React, { useEffect, useState } from "react";
import { Box, Chip, Paper, TextField, Tooltip } from "@mui/material";
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";
import { useGetAllGamesMutation } from "../../redux/slices/apiSlice"; // 👈 create this hook in apiSlice
import TableSkeleton from "../../components/skeleton/TableSkeleton";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import { useNavigate } from "react-router-dom";
import { TableWithExport } from "../../components/table/TableWithExport";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

const Games = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  // pagination model used by DataGrid
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // pageTokens[page] = token to send to backend for that page
  // page 0 always starts with empty string
  const [pageTokens, setPageTokens] = useState([""]);

  const [rowCount, setRowCount] = useState(() => {
    const saved = sessionStorage.getItem("games-management-totalCount");
    return saved ? Number(saved) : 0;
  });

  const [getAllGames, { data: gamesData, isLoading, error }] =
    useGetAllGamesMutation();

  // ---------- FETCH LOGIC WITH TOKEN PER PAGE ----------
  useEffect(() => {
    // Find the token for the current page from the history
    const tokenForCurrentPage =
      pageTokens[paginationModel.page] !== undefined
        ? pageTokens[paginationModel.page]
        : "";

    const payload = {
      PageSize: paginationModel.pageSize,
      NextToken: tokenForCurrentPage,
      // no Filter object for games
    };

    getAllGames(payload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel.page, paginationModel.pageSize, getAllGames]);
  // NOTE: pageTokens intentionally NOT in deps

  // ---------- HANDLE API RESPONSE + TOKEN HISTORY ----------
  useEffect(() => {
    if (!gamesData?.data) return;

    const { games = [], count = 0, nextToken = "" } = gamesData.data;

    // update table data
    setData(games);

    // row count caching
    if (paginationModel.page === 0) {
      // On first page, trust backend total and cache it

      setRowCount(count ?? 0);
      sessionStorage.setItem("games-management-totalCount", String(count ?? 0));
    } else {
      // On other pages, use cached total if present
      const saved = sessionStorage.getItem("games-management-totalCount");
      if (saved) {
        setRowCount(Number(saved));
      }
    }

    // Store token for NEXT page in history
    setPageTokens((prev) => {
      const copy = [...prev];

      // Ensure current page has a token stored (if not already)
      if (copy[paginationModel.page] === undefined) {
        copy[paginationModel.page] =
          paginationModel.page === 0 ? "" : copy[paginationModel.page];
      }

      // Store the token that should be used when user goes to next page
      copy[paginationModel.page + 1] = nextToken || "";

      return copy;
    });
  }, [gamesData, paginationModel.page]);

  // ---------- PAGINATION HANDLER ----------
  const handlePaginationModelChange = (newModel) => {
    setPaginationModel((prev) => {
      const pageSizeChanged = newModel.pageSize !== prev.pageSize;

      if (pageSizeChanged) {
        // reset tokens when page size changes
        setPageTokens([""]);
        return {
          page: 0,
          pageSize: newModel.pageSize,
        };
      }

      // just a page change (next/prev)
      return newModel;
    });
  };

  // ---------- TABLE COLUMNS ----------
  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    {
      field: "name",
      headerName: "Game Name",
      width: 220,
    },
    {
      field: "assetBundleName",
      headerName: "Bundle Name",
      width: 200,
    },
    {
      field: "isLive",
      headerName: "Live",
      width: 100,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.row.isLive ? "Yes" : "No"}
          color={params.row.isLive ? "success" : "default"}
          variant={params.row.isLive ? "filled" : "outlined"}
        />
      ),
    },
    {
      field: "isNewGames",
      headerName: "New",
      width: 100,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.row.isNewGames ? "New" : "—"}
          color={params.row.isNewGames ? "primary" : "default"}
          variant={params.row.isNewGames ? "filled" : "outlined"}
        />
      ),
    },
    {
      field: "isUnderMaintenance",
      headerName: "Maintenance",
      width: 140,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.row.isUnderMaintenance ? "Yes" : "No"}
          color={params.row.isUnderMaintenance ? "warning" : "default"}
          variant={params.row.isUnderMaintenance ? "filled" : "outlined"}
        />
      ),
    },
    {
      field: "playCount",
      headerName: "Plays",
      width: 100,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 140,
      renderCell: (params) => (
        <Box
          sx={{ display: "flex", gap: 2, alignItems: "center", marginTop: 1 }}
        >
          <Tooltip title="View Game Details" arrow>
            <RemoveRedEyeIcon
              onClick={() => navigate(`/dashboard/game-details/${params.row.id}`)}
              sx={{ color: "#5d87ff", cursor: "pointer" }}
            />
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <>
      {/* Header + Breadcrumbs */}
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
              label: "Games Management",
              href: "/dashboard/games-management",
              icon: <SportsEsportsIcon fontSize="small" />,
            },
          ]}
        />

        {/* If you later want filters for category/isLive/etc, add here */}
        <Box
          sx={{
            marginBottom: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
          }}
        >
          {/* Reserved for future filters */}
        </Box>
      </Box>

      <Paper sx={{ height: "auto", width: "100%", padding: 3 }}>
        {/* Top Bar (Search etc.) */}
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
          <TextField
            label="Search game"
            variant="outlined"
            size="small"
            // hook this to backend search when needed
          />
        </Box>

        {/* Table */}
        {isLoading ? (
          <TableSkeleton rows={10} columns={columns.length} />
        ) : (
          <TableWithExport
            userTableData={data?.map((g) => ({
              ...g,
              id: g.id ?? g.assetBundleName, // ensure unique id
            }))}
            columns={columns}
            pageSizeOptions={[10, 15, 20, 50, 100]}
            rowCount={rowCount}
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationModelChange}
          />
        )}
      </Paper>
    </>
  );
};

export default Games;
