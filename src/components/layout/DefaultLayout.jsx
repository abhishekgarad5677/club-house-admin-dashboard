import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import logo from "../../../public/logo.png";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { Tooltip } from "@mui/material";
import { ProfileAvatarMenu } from "../Avatar/ProfileAvatarMenu";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "../../pages/Dashboard/Dashboard";
import Games from "../../pages/Games/Games";
import AddGame from "../../pages/Games/AddGame";
import Tournament from "../../pages/Tournament/Tournament";
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import AddTournament from "../../pages/Tournament/AddTournament";

const drawerWidth = 255;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

export default function DefaultLayout() {
  const location = useLocation();
  // const isActive = location.pathname === ele.path;

  const acticeTabStyle = {
    backgroundColor: "#1E218D",
    color: "#fff",
  };

  const acticeIconStyle = {
    color: "#fff",
  };

  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const navSectionOne = [
    { title: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
    {
      title: "Games",
      path: "/dashboard/games",
      icon: <SportsEsportsIcon />,
    },
    {
      title: "Tournament",
      path: "/dashboard/tournament",
      icon: <EmojiEventsIcon />,
    },
  
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        sx={{ boxShadow: "none", background: "#1E218D" }}
      >
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={[
                {
                  marginRight: 5,
                },
                open && { display: "none" },
              ]}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Admin Dashboard
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <ProfileAvatarMenu />
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              paddingLeft: 1,
              paddingY: 0.5,
            }}
          >
            {open && (
              <img
                style={{ transition: "ease" }}
                src={logo}
                alt=""
                width={"50%"}
                // height={"100"}
              />
            )}
          </Box>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        {/* <Divider /> */}
        <List>
          {navSectionOne.map((ele, index) => (
            <ListItem key={index} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                component={Link}
                to={ele.path}
                sx={[
                  {
                    minHeight: 48,
                    margin: "0 10px",
                    borderRadius: "7px",
                    backgroundColor:
                      ele.path === location.pathname ? "#5d87ff" : "",
                    px: 2.5,
                  },
                  ele.path === location.pathname ? acticeTabStyle : null,
                  open
                    ? {
                        justifyContent: "initial",
                      }
                    : {
                        justifyContent: "center",
                      },
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: "center",
                    },
                    ele.path === location.pathname ? acticeIconStyle : null,
                    open
                      ? {
                          mr: 2,
                        }
                      : {
                          mr: "auto",
                        },
                  ]}
                >
                  {open ? (
                    ele.icon
                  ) : (
                    <Tooltip title={ele.title} arrow placement="right">
                      {ele.icon}
                    </Tooltip>
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={ele.title}
                  sx={[
                    open
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                        },
                  ]}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          overflow: "auto",
          height: "100vh",
          scrollbarWidth: "none", // For Firefox
          "&::-webkit-scrollbar": {
            display: "none", // For Chrome, Safari
          },
        }}
      >
        <DrawerHeader />
        <Routes>
          <Route index path="/" element={<Dashboard />} />
          <Route path="/games" element={<Games />} />
          <Route path="/add-games" element={<AddGame />} />
          <Route path="/tournament" element={<Tournament />} />
          <Route path="/add-tournament" element={<AddTournament />} />
        </Routes>
        <Typography
          variant="p"
          fontSize={12}
          mt={4}
          textAlign={"center"}
          color="#ccc"
          noWrap
          component="div"
        >
          Copyright © 2025 TMKOC Club House Inc. All Rights Reserved. <br />
          Powered by Neela Mediatech Private Limited
        </Typography>
      </Box>
    </Box>
  );
}
