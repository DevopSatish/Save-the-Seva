import { CompareArrows, CurrencyRupee, Insights, QrCodeScanner, ReportProblem } from '@mui/icons-material';
import { Avatar, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import { deepOrange } from '@mui/material/colors';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { getActiveUser } from "../../config/user";

const drawerWidth = 240;

const activeUser = getActiveUser();

export function CustomAppBar({ onLogoutButtonClick, onEndShiftButtonClick, username, role }) {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                    Aadhaar Payments Dashboard
                </Typography>
                <Tooltip title={username + " (" + role.toString().toLowerCase() + ")"}>
                    <IconButton
                        type="button"
                        aria-label="Current user account"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <Avatar
                            sx={{ bgcolor: deepOrange[500] }}
                        >{username.substring(0, 1)}</Avatar>
                    </IconButton>
                </Tooltip>

                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={onEndShiftButtonClick}>End Shift</MenuItem>
                    <MenuItem onClick={onLogoutButtonClick}>Logout</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}

export function CustomAppDrawer({ activePage, onPageSelected }) {
    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="permanent"
            anchor="left"
        >
            <Toolbar />
            <Divider />
            <List>
                <ListItem
                    disablePadding
                    sx={{ backgroundColor: (activePage === 'metrics' || activePage === null || activePage === undefined) ? '#ede7f6' : undefined }}
                    onClick={() => onPageSelected('metrics')}
                >
                    <ListItemButton>
                        <ListItemIcon><Insights /></ListItemIcon>
                        <ListItemText primary="Metrics" />
                    </ListItemButton>
                </ListItem>

                <ListItem
                    disablePadding
                    sx={{ backgroundColor: (activePage === 'qr') ? '#ede7f6' : undefined }}
                    onClick={() => onPageSelected('qr')}
                >
                    <ListItemButton>
                        <ListItemIcon><QrCodeScanner /></ListItemIcon>
                        <ListItemText primary="Dynamic QR" />
                    </ListItemButton>
                </ListItem>

                <ListItem
                    disablePadding
                    sx={{ backgroundColor: (activePage === 'transactions') ? '#ede7f6' : undefined }}
                    onClick={() => onPageSelected('transactions')}
                >
                    <ListItemButton>
                        <ListItemIcon><CurrencyRupee /></ListItemIcon>
                        <ListItemText primary="Transactions" />
                    </ListItemButton>
                </ListItem>

                {
                    activeUser.role === "ADMIN" &&
                    <ListItem
                        disablePadding
                        sx={{ backgroundColor: (activePage === 'recon') ? '#ede7f6' : undefined }}
                        onClick={() => onPageSelected('recon')}
                    >
                        <ListItemButton>
                            <ListItemIcon><CompareArrows /></ListItemIcon>
                            <ListItemText primary="2 Way Recon" />
                        </ListItemButton>
                    </ListItem>
                }

                {
                    activeUser.role === "ADMIN" &&
                    <ListItem
                        disablePadding
                        sx={{ backgroundColor: (activePage === 'complaints') ? '#ede7f6' : undefined }}
                        onClick={() => onPageSelected('complaints')}
                    >
                        <ListItemButton>
                            <ListItemIcon><ReportProblem /></ListItemIcon>
                            <ListItemText primary="Complaints" />
                        </ListItemButton>
                    </ListItem>
                }

            </List>
        </Drawer>
    );
}
