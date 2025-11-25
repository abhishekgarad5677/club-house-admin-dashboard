import React, { useEffect, useState } from "react";
import { Box, Paper, styled, TextField, Typography } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Grid from "@mui/material/Grid2";
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";
import CustomRangeSelect from "../../utils/CustomRangeSelect";
import DatePicker from "react-datepicker";
import { dateFilterOptions } from "../../utils/constant";
import DashboardSummary from "../../components/Dashboard/DashboardSummary";

const Dashboard = () => {
  const [date, setDate] = useState("today");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setDate(selectedDate);

    if (selectedDate === "custom") {
      // Store the custom date range in sessionStorage
      sessionStorage.setItem("selectedDate", selectedDate);
      sessionStorage.setItem("startDate", startDate);
      sessionStorage.setItem("endDate", endDate);
    } else {
      // Store the selected date (e.g., "today", "yesterday", etc.)
      sessionStorage.setItem("selectedDate", selectedDate);
      sessionStorage.removeItem("startDate");
      sessionStorage.removeItem("endDate");
    }
  };

  useEffect(() => {
    const storedDate = sessionStorage.getItem("selectedDate");
    const storedStartDate = sessionStorage.getItem("startDate");
    const storedEndDate = sessionStorage.getItem("endDate");

    if (storedDate) {
      setDate(storedDate); // Set the stored date to default value
    }
    if (storedStartDate && storedEndDate) {
      setDateRange([new Date(storedStartDate), new Date(storedEndDate)]); // Set the date range if custom is selected
    }
  }, []);

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
              label: "Dashboard",
              href: "/dashboard",
              icon: <DashboardIcon fontSize="small" />,
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
                sessionStorage.setItem("startDate", start); // Store the start date
                sessionStorage.setItem("endDate", end); // Store the end date
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
      <Box sx={{ height: "85vh", width: "100%" }}>
        <DashboardSummary />
      </Box>
    </>
  );
};

export default Dashboard;
