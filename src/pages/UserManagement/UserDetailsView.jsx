// UserDetailsView.jsx
import React from "react";
import {
  Avatar,
  Box,
  Card,
  CardHeader,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return date.toLocaleString();
};

const InfoRow = ({ label, value }) => (
  <Stack
    direction="row"
    justifyContent="space-between"
    alignItems="center"
    sx={{ py: 0.75 }}
  >
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2" fontWeight={500}>
      {value ?? "-"}
    </Typography>
  </Stack>
);

const UserDetailsView = ({
  data,
  onViewTransactions,
  onViewTournaments,
  onBanToggle,
  isBanUpdating,
}) => {
  if (!data) return null;

  const { userProfile, userWallet } = data;

  const email = userProfile?.email;
  const roleName = userProfile?.roleName || "User";

  const isBanned = userProfile?.isBanned;
  const emailConfirmed = userProfile?.emailConfirm;
  const isVerified = userWallet?.isVerified;

  const winning = userWallet?.winning ?? 0;
  const totalCoinsWon = userWallet?.totalCoinsWon ?? 0;
  const tdsPaid = userWallet?.tdsPaid ?? 0;
  const tdsToPay = userWallet?.tdstoPay ?? 0;

  console.log("===", userProfile?.isBanned);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ width: 48, height: 48 }}>
            {email?.[0]?.toUpperCase() || <PersonIcon />}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={600}>
              User Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {email}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip label={roleName} color="primary" size="small" />

          <Chip
            label={emailConfirmed ? "Email Verified" : "Email Not Verified"}
            size="small"
            color={emailConfirmed ? "success" : "warning"}
            variant={emailConfirmed ? "filled" : "outlined"}
          />

          <Chip
            label={isBanned ? "Banned" : "Active"}
            size="small"
            color={isBanned ? "error" : "success"}
            variant={isBanned ? "filled" : "outlined"}
          />
          <Button
            variant={isBanned ? "contained" : "outlined"}
            color="error"
            size="small"
            onClick={onBanToggle}
            disabled={isBanUpdating}
          >
            {isBanUpdating
              ? "Updating..."
              : isBanned
              ? "Unban User"
              : "Ban User"}
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardHeader title="Profile" subheader="Basic user information" />
            <Divider />
            <CardContent>
              <Stack spacing={1}>
                <InfoRow label="User Name" value={userProfile?.userName} />
                <InfoRow label="Nick Name" value={userProfile?.nickName} />
                <InfoRow label="Location" value={userProfile?.location} />
                <InfoRow
                  label="Platform"
                  value={userProfile?.platform ?? "-"}
                />
                <InfoRow label="App Version" value={userProfile?.appVersion} />
                <InfoRow
                  label="Created At"
                  value={formatDateTime(userProfile?.createdAt)}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Wallet Card */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardHeader
              avatar={
                <Avatar>
                  <AccountBalanceWalletIcon />
                </Avatar>
              }
              title="Wallet"
              subheader="Balance & winnings summary"
              action={
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    label={isVerified ? "KYC Verified" : "KYC Pending"}
                    color={isVerified ? "success" : "warning"}
                    size="small"
                    variant={isVerified ? "filled" : "outlined"}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={onViewTransactions}
                  >
                    View Transactions
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={onViewTournaments}
                  >
                    View Tournaments
                  </Button>
                </Stack>
              }
            />
            <Divider />
            <CardContent>
              {/* Wallet Highlight Numbers */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ textTransform: "uppercase" }}
                    >
                      Winning Balance
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      ₹{winning}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ textTransform: "uppercase" }}
                    >
                      Total Coins Won
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {totalCoinsWon}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Other wallet info */}
              <Stack spacing={1}>
                <InfoRow label="TDS Paid" value={`₹${tdsPaid}`} />
                <InfoRow label="TDS To Pay" value={`₹${tdsToPay}`} />
                <InfoRow label="VPA" value={userWallet?.vpa || "Not linked"} />
                <InfoRow
                  label="Wallet Created At"
                  value={formatDateTime(userWallet?.createdAt)}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDetailsView;
