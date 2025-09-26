import { useState } from "react";
import { Avatar, IconButton, ListItemIcon, Menu, MenuItem, Tooltip, Typography } from "@mui/material"
import { Logout } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";


export const ProfileAvatarMenu = () => {

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    return (
        <>
            <Typography variant="h6" noWrap component="div">
                Hi, Abhishek
            </Typography>
            <Tooltip title="Account settings" arrow placement="bottom">
                <IconButton
                    onClick={handleClick}
                    size="small"
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <Avatar sx={{ bgcolor: 'white', color: '#1976d2', fontWeight: 500 }}>AG</Avatar>
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 30,
                                height: 30,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleClose}>
                    <Avatar sx={{ width: 10, height: 10 }} />
                    <Typography variant="p" fontSize={14} noWrap color="gray">
                        Profile
                    </Typography>
                </MenuItem>
                <MenuItem >
                    <ListItemIcon onClick={handleClose}>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="p" fontSize={14} noWrap color="gray" onClick={handleLogout}>
                        Logout
                    </Typography>
                </MenuItem>
            </Menu>
        </>
    )
}