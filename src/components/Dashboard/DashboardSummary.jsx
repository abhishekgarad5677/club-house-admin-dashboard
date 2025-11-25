import React from "react";
import { useEffect, useState } from "react";
import { Box, Paper, Skeleton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import MailIcon from "@mui/icons-material/Mail";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShareIcon from "@mui/icons-material/Share";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import MobileFriendlyIcon from "@mui/icons-material/MobileFriendly";
import SendToMobileIcon from "@mui/icons-material/SendToMobile";
import {
  formatDateToReadableString,
  useFormattedDate,
} from "../../utils/Hooks";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import HourglassDisabledIcon from "@mui/icons-material/HourglassDisabled";
import { useNavigate } from "react-router-dom";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import SportsHandballIcon from "@mui/icons-material/SportsHandball";
import DateRangeIcon from "@mui/icons-material/DateRange";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import SavingsIcon from "@mui/icons-material/Savings";

const DashboardSummary = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData([
      {
        title: "Total Players count",
        size: 4,
        value: 33,
        icon: <PeopleIcon sx={{ fontSize: 40, color: "#5f2eff" }} />,
        color: "#edf2fe",
        valueColor: "#2f74ff",
      },
      {
        title: "Total Ads watched",
        size: 4,
        value: 33,
        icon: <AdsClickIcon sx={{ fontSize: 40, color: "#E91E63" }} />, // vibrant pink
        color: "#FFE4EC", // light pink background
        valueColor: "#E91E63", // main pink
      },
      {
        title: "Active Tournamnets",
        size: 4,
        value: 33,
        icon: <EmojiEventsIcon sx={{ fontSize: 40, color: "#ff9900" }} />, // vibrant pink
        color: "#fff6e6",
        valueColor: "#ff9900",
      },
      {
        title: "Upcoming Tournamnets",
        size: 4,
        value: 33,
        icon: <DateRangeIcon sx={{ fontSize: 40, color: "#ec007d" }} />, // vibrant pink
        color: "#feedf6",
        valueColor: "#ec007d",
      },
      {
        title: "Active Players",
        size: 4,
        value: 33,
        icon: <SportsHandballIcon sx={{ fontSize: 40, color: "#2f74ff" }} />, // vibrant pink
        color: "#edf2fe",
        valueColor: "#2f74ff",
      },
      {
        title: "IAP's Purcahsed",
        size: 4,
        value: 33,
        icon: <ShoppingCartIcon sx={{ fontSize: 40, color: "#E91E63" }} />, // vibrant pink
        color: "#FFE4EC", // light pink background
        valueColor: "#E91E63", // main pink
      },
      {
        title: "Total Amount Withdrawn",
        size: 6,
        value: 33,
        icon: <CreditScoreIcon sx={{ fontSize: 40, color: "#00c292" }} />, // vibrant pink
        color: "#e6fff9",
        valueColor: "#00c292",
      },
      {
        title: "Total In Game Money Players Hold",
        size: 6,
        value: 33,
        icon: <SavingsIcon sx={{ fontSize: 40, color: "#ff9900" }} />, // vibrant pink
        color: "#fff6e6",
        valueColor: "#ff9900",
      },
    ]);
  }, []);

  return (
    <Grid container mb={4} spacing={2}>
      {data?.map((card, index) => {
        const isSubscribedCard = card.title === "Subscribed Users";
        const isDropOffCard = card.title === "Drop Offs After Sign In";
        const freeTrial = card.title === "Play Services Started";
        const freeTrialEnded = card.title === "Cash Free Trial Started";
        const domesticRevenue = card.title === "Total Revenue";
        const razorpayFreeTiral = card.title === "Razorpay Free Trial Users";

        const isClickable =
          isSubscribedCard ||
          isDropOffCard ||
          freeTrial ||
          freeTrialEnded ||
          domesticRevenue ||
          razorpayFreeTiral;

        const handleClick = () => {
          if (isSubscribedCard) navigate("/dashboard/students");
          else if (isDropOffCard) navigate("/dashboard/UnsubscribedUsers");
          else if (freeTrial) navigate("/dashboard/free-trial-started");
          else if (freeTrialEnded)
            navigate("/dashboard/cash-free-trial-started");
          else if (domesticRevenue) navigate("/dashboard/domestic-revenue");
          else if (razorpayFreeTiral)
            navigate("/dashboard/razor-pay-free-trial");
        };

        const content = (
          <Paper
            elevation={0}
            sx={{
              backgroundColor: card.color,
              p: 2,
              textAlign: "center",
              borderRadius: 2,
              transition: "transform 0.2s ease-in-out",
              "&:hover": isClickable ? { transform: "scale(1.03)" } : {},
              cursor: isClickable ? "pointer" : "default",
            }}
          >
            <Box mb={1}>{card.icon}</Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
              {card.title}
            </Typography>
            <Typography
              variant="h5"
              sx={{ color: card.valueColor, fontWeight: "bold" }}
            >
              {card.value}
            </Typography>
          </Paper>
        );

        return (
          <Grid size={card?.size} key={index}>
            {isClickable ? <Box onClick={handleClick}>{content}</Box> : content}
          </Grid>
        );
      })}
    </Grid>
  );
};

export default DashboardSummary;
