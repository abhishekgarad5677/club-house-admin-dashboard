import React, { useEffect, useState } from "react";
import { Box, Chip, Paper, TextField, Tooltip } from "@mui/material";
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";
import { useGetAllUsersMutation } from "../../redux/slices/apiSlice";
import TableSkeleton from "../../components/skeleton/TableSkeleton";
import GroupIcon from "@mui/icons-material/Group";
import { useNavigate } from "react-router-dom";
import { TableWithExport } from "../../components/table/TableWithExport";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import CustomRangeSelect from "../../utils/CustomRangeSelect";
import { appFilterOptions, dateFilterOptions } from "../../utils/constant";
import DatePicker from "react-datepicker";

const UserManagement = () => {
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

  const [date, setDate] = useState("today");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [platform, setPlatform] = useState(2);

  const [rowCount, setRowCount] = useState(() => {
    const saved = sessionStorage.getItem("user-management-totalUsers");
    return saved ? Number(saved) : 0;
  });

  const [getAllUsers, { data: userData, isLoading, error }] =
    useGetAllUsersMutation();

  // ---------- FETCH LOGIC WITH TOKEN PER PAGE ----------
  useEffect(() => {
    // Find the token for the current page from the history
    const tokenForCurrentPage =
      pageTokens[paginationModel.page] !== undefined
        ? pageTokens[paginationModel.page]
        : "";

    const payload = {
      SearchText: "",
      PageSize: paginationModel.pageSize,
      NextToken: tokenForCurrentPage,
      Filter: {
        FilterType: "12months", // you can wire this to your date filters later
        Platform: platform,
        // FromDate / ToDate from date/dateRange if backend supports it
      },
    };

    getAllUsers(payload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    paginationModel.page,
    paginationModel.pageSize,
    platform,
    date,
    startDate,
    endDate,
    getAllUsers,
  ]);
  // NOTE: we intentionally do NOT include pageTokens in deps,
  // to avoid double-calling with same token.

  // ---------- HANDLE API RESPONSE + TOKEN HISTORY ----------
  useEffect(() => {
    if (!userData?.data) return;

    const { items = [], totalUsers = 0, nextToken = "" } = userData.data;

    // update table data
    setData(items);

    // row count caching
    if (paginationModel.page === 0) {
      // On first page, trust backend total and cache it
      setRowCount(totalUsers ?? 0);
      sessionStorage.setItem(
        "user-management-totalUsers",
        String(totalUsers ?? 0)
      );
    } else {
      // On other pages, use cached total if present
      const saved = sessionStorage.getItem("user-management-totalUsers");
      if (saved) {
        setRowCount(Number(saved));
      }
    }

    // Store token for NEXT page in history
    // pageTokens[currentPage + 1] = nextToken from this response
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
  }, [userData, paginationModel.page]);

  // ---------- FILTER HANDLERS (RESET TOKENS WHEN FILTERS CHANGE) ----------

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setDate(selectedDate);

    // reset pagination + token history when filter changes
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
    setPageTokens([""]);

    if (selectedDate === "custom") {
      sessionStorage.setItem("selectedDate", selectedDate);
      sessionStorage.setItem("startDate", startDate);
      sessionStorage.setItem("endDate", endDate);
    } else {
      sessionStorage.setItem("selectedDate", selectedDate);
      sessionStorage.removeItem("startDate");
      sessionStorage.removeItem("endDate");
    }
  };

  const handlePlatformChange = (event) => {
    const value = event.target.value;
    setPlatform(value);

    // reset pagination + token history when filter changes
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
    setPageTokens([""]);
  };

  // Handle DataGrid pagination changes:
  // - If pageSize changes, reset everything and refetch from page 0
  // - If only page changes, just set new page (tokens already stored)
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

  const columns = [
    { field: "name", headerName: "Name", width: 250 },
    { field: "email", headerName: "Email", width: 300 },
    {
      field: "isBanned",
      headerName: "Banned",
      width: 200,
      renderCell: (params) => (
        <Chip label={params?.row?.isBanned === "1" ? "Yes" : "No"} />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <Box
          sx={{ display: "flex", gap: 2, alignItems: "center", marginTop: 2 }}
        >
          <Tooltip title="View Details" arrow>
            <RemoveRedEyeIcon
              onClick={() =>
                navigate(`/dashboard/user-details/${params.row.email}`)
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
              label: "User Management",
              href: "/dashboard/user-management",
              icon: <GroupIcon fontSize="small" />,
            },
          ]}
        />

        <Box
          sx={{
            marginBottom: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
          }}
        >
          <CustomRangeSelect
            value={platform}
            label={"App"}
            onChange={handlePlatformChange}
            options={appFilterOptions}
          />
          <CustomRangeSelect
            value={date}
            label={"Date"}
            onChange={handleDateChange}
            options={dateFilterOptions}
          />
          {date === "custom" && (
            <DatePicker
              maxDate={new Date()}
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => {
                setDateRange(update);
                const [start, end] = update;
                sessionStorage.setItem("startDate", start);
                sessionStorage.setItem("endDate", end);
              }}
              dateFormat="dd/MM/yyyy"
              placeholderText="Select date range"
              customInput={
                <TextField
                  size="small"
                  fullWidth
                  label="Custom Date Range"
                  sx={{ width: 250 }}
                />
              }
            />
          )}
        </Box>
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
          <TextField
            label="Search user"
            variant="outlined"
            size="small"
            // hook this to backend search when needed
          />
        </Box>

        {isLoading ? (
          <TableSkeleton rows={10} columns={columns.length} />
        ) : (
          <TableWithExport
            userTableData={data?.map((d) => ({
              ...d,
              id: d.email || d.id,
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

export default UserManagement;
