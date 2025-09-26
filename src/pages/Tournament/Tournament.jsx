import React from "react";
import { Box, Button, Paper, TextField } from "@mui/material";
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import AddIcon from "@mui/icons-material/Add";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useNavigate } from "react-router-dom";

const Tournament = () => {
  const navigate = useNavigate();
  return (
    <>
      <CustomBreadcrumbs
        items={[
          {
            label: "Tournament",
            href: "/dashboard/tournament",
            icon: <EmojiEventsIcon fontSize="small" />,
          },
        ]}
      />
      <Paper sx={{ height: "85vh", width: "100%", padding: 3 }}>
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
            label="search tournament"
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
            onClick={() => navigate("/dashboard/add-tournament")}
          >
            Add Tournament
          </Button>
        </Box>
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
          <>Tournament</>
        </Box>
      </Paper>
    </>
  );
};

export default Tournament;
