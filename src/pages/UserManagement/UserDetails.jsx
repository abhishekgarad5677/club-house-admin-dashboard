// UserDetailsContainer.jsx
import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
} from "@mui/material";
import { useParams } from "react-router-dom";
import {
  useGetUserProfileWalletQuery,
  useLazyGetUserLifetimeTransactionsQuery,
  useLazyGetUserTournamentsQuery,
  useUpdateUserBanMutation, 
} from "../../redux/slices/apiSlice";
import UserDetailsView from "./UserDetailsView";
import TransactionsDialog from "./TransactionsDialog";
import TournamentsDialog from "./TournamentsDialog"; 
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";

const UserDetailsContainer = () => {
  const { id } = useParams(); // email from route
  const email = id;

  const { data, isLoading, error, refetch } =
    useGetUserProfileWalletQuery(email);

  // ───────────────── BAN USER STATE ─────────────────

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [pendingBanAction, setPendingBanAction] = useState(null); // store action type

  const isBanned = data?.data?.userProfile?.isBanned;
  const requiredKeyword = pendingBanAction === "BAN" ? "BAN" : "UNBAN";

  const [updateUserBan, { isLoading: isBanUpdating }] =
    useUpdateUserBanMutation();

  const handleBanToggleClick = () => {
    setPendingBanAction(isBanned ? "UNBAN" : "BAN");
    setConfirmText("");
    setConfirmOpen(true);
  };

  const handleConfirmBan = async () => {
    try {
      await updateUserBan(email).unwrap();
      setConfirmOpen(false);
      refetch(); // refresh user data
    } catch (err) {
      console.error("Ban/Unban failed", err);
    }
  };

  // ───────────────── TRANSACTIONS STATE ─────────────────
  const [transactionsOpen, setTransactionsOpen] = useState(false);

  const [
    getUserLifetimeTransactions,
    {
      data: transactionsResponse,
      isFetching: isTransactionsLoading,
      isError: isTransactionsError,
    },
  ] = useLazyGetUserLifetimeTransactionsQuery();

  const [transactionsPage, setTransactionsPage] = useState(0);
  const [transactionsPageSize] = useState(10);
  const [transactionsPageTokens, setTransactionsPageTokens] = useState([""]); // [page] = token

  const handleOpenTransactions = () => {
    if (!email) return;

    setTransactionsPage(0);
    setTransactionsPageTokens([""]);
    setTransactionsOpen(true);

    getUserLifetimeTransactions({
      emailId: email,
      pageSize: transactionsPageSize,
      nextToken: "",
    });
  };

  const handleCloseTransactions = () => {
    setTransactionsOpen(false);
  };

  // store nextToken for NEXT transactions page
  useEffect(() => {
    if (!transactionsResponse?.data) return;

    const { nextToken = "" } = transactionsResponse.data;

    setTransactionsPageTokens((prev) => {
      const copy = [...prev];
      copy[transactionsPage + 1] = nextToken || "";
      return copy;
    });
  }, [transactionsResponse, transactionsPage]);

  const handleNextTransactionsPage = () => {
    if (!email || !transactionsResponse?.data) return;

    const nextToken = transactionsResponse.data.nextToken;
    if (!nextToken) return;

    const nextPageIndex = transactionsPage + 1;
    setTransactionsPage(nextPageIndex);

    getUserLifetimeTransactions({
      emailId: email,
      pageSize: transactionsPageSize,
      nextToken,
    });
  };

  const handlePrevTransactionsPage = () => {
    if (!email) return;
    if (transactionsPage === 0) return;

    const prevPageIndex = transactionsPage - 1;
    const tokenForPrevPage =
      transactionsPageTokens[prevPageIndex] !== undefined
        ? transactionsPageTokens[prevPageIndex]
        : "";

    setTransactionsPage(prevPageIndex);

    getUserLifetimeTransactions({
      emailId: email,
      pageSize: transactionsPageSize,
      nextToken: tokenForPrevPage,
    });
  };

  const transactions = transactionsResponse?.data?.items ?? [];
  const hasMoreTransactions = Boolean(transactionsResponse?.data?.nextToken);
  const transactionsTotalCount = transactionsResponse?.data?.totalCount;
  const hasPrevTransactions = transactionsPage > 0;

  // ───────────────── TOURNAMENTS STATE ─────────────────
  const [tournamentsOpen, setTournamentsOpen] = useState(false);

  const [
    getUserTournaments,
    {
      data: tournamentsResponse,
      isFetching: isTournamentsLoading,
      isError: isTournamentsError,
    },
  ] = useLazyGetUserTournamentsQuery();

  const [tournamentsPage, setTournamentsPage] = useState(0);
  const [tournamentsPageSize] = useState(10);
  const [tournamentsPageTokens, setTournamentsPageTokens] = useState([""]); // [page] = token

  const handleOpenTournaments = () => {
    if (!email) return;

    setTournamentsPage(0);
    setTournamentsPageTokens([""]);
    setTournamentsOpen(true);

    getUserTournaments({
      emailId: email,
      pageSize: tournamentsPageSize,
      nextToken: "",
    });
  };

  const handleCloseTournaments = () => {
    setTournamentsOpen(false);
  };

  // store nextToken for NEXT tournaments page
  useEffect(() => {
    if (!tournamentsResponse?.data) return;

    const { nextToken = "" } = tournamentsResponse.data;

    setTournamentsPageTokens((prev) => {
      const copy = [...prev];
      copy[tournamentsPage + 1] = nextToken || "";
      return copy;
    });
  }, [tournamentsResponse, tournamentsPage]);

  const handleNextTournamentsPage = () => {
    if (!email || !tournamentsResponse?.data) return;

    const nextToken = tournamentsResponse.data.nextToken;
    if (!nextToken) return;

    const nextPageIndex = tournamentsPage + 1;
    setTournamentsPage(nextPageIndex);

    getUserTournaments({
      emailId: email,
      pageSize: tournamentsPageSize,
      nextToken,
    });
  };

  const handlePrevTournamentsPage = () => {
    if (!email) return;
    if (tournamentsPage === 0) return;

    const prevPageIndex = tournamentsPage - 1;
    const tokenForPrevPage =
      tournamentsPageTokens[prevPageIndex] !== undefined
        ? tournamentsPageTokens[prevPageIndex]
        : "";

    setTournamentsPage(prevPageIndex);

    getUserTournaments({
      emailId: email,
      pageSize: tournamentsPageSize,
      nextToken: tokenForPrevPage,
    });
  };

  const tournaments = tournamentsResponse?.data?.items ?? [];
  const hasMoreTournaments = Boolean(tournamentsResponse?.data?.nextToken);
  const tournamentsTotalCount = tournamentsResponse?.data?.totalCount;
  const hasPrevTournaments = tournamentsPage > 0;

  // ───────────────── BASIC USER STATE ─────────────────
  if (!email) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="body1">
          No email provided for this user.
        </Typography>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">
          Failed to load user details. Please try again.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <UserDetailsView
        data={data?.data}
        onViewTransactions={handleOpenTransactions}
        onViewTournaments={handleOpenTournaments}
        onBanToggle={handleBanToggleClick}
        isBanUpdating={isBanUpdating}
      />

      <TransactionsDialog
        open={transactionsOpen}
        onClose={handleCloseTransactions}
        transactions={transactions}
        loading={isTransactionsLoading}
        error={isTransactionsError}
        onNextPage={handleNextTransactionsPage}
        onPrevPage={handlePrevTransactionsPage}
        hasMore={hasMoreTransactions}
        hasPrev={hasPrevTransactions}
        page={transactionsPage}
        pageSize={transactionsPageSize}
        totalCount={transactionsTotalCount}
      />

      <TournamentsDialog
        open={tournamentsOpen}
        onClose={handleCloseTournaments}
        tournaments={tournaments}
        loading={isTournamentsLoading}
        error={isTournamentsError}
        onNextPage={handleNextTournamentsPage}
        onPrevPage={handlePrevTournamentsPage}
        hasMore={hasMoreTournaments}
        hasPrev={hasPrevTournaments}
        page={tournamentsPage}
        pageSize={tournamentsPageSize}
        totalCount={tournamentsTotalCount}
      />

      <ConfirmDeleteDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={pendingBanAction === "BAN" ? "Ban User" : "Unban User"}
        warningText={`This action will ${
          pendingBanAction === "BAN" ? "ban" : "unban"
        } this user immediately.`}
        confirmText={confirmText}
        setConfirmText={setConfirmText}
        loading={isBanUpdating}
        onConfirm={handleConfirmBan}
        actionLabel={pendingBanAction === "BAN" ? "Ban User" : "Unban User"}
        requiredKeyword={pendingBanAction === "BAN" ? "BAN" : "UNBAN"}
      />
    </>
  );
};

export default UserDetailsContainer;
