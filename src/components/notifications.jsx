import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

// material ui imports
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';

import apiFunctions from '../firebase/api';
//style="position: absolute; inset: 0px 0px auto auto; margin: 0px; transform: translate3d(-44.8px, 40.8px, 0px);"

const NotificationsBox = (anchor, handleCloseNotif) => {

    return (
        /*
        <div style={{
            color: "black",
            border: "1px",
            borderStyle: "solid",
            zIndex: 10,
            position: "absolute",
            inset: "80px 0vw 0 0",
            margin: "0px",
            opacity: "solid",
            width: "auto"
        }}
        >
            notif <br></br>
            notif <br></br>
            notif <br></br>
            notif <br></br>
        </div>
        */
        <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchor}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={Boolean(anchor)}
            onClose={handleCloseNotif}
        >
            <MenuItem>notif</MenuItem>
            <MenuItem>notif</MenuItem>
            <MenuItem>notif</MenuItem>
            <MenuItem>notif</MenuItem>
            <MenuItem>notif</MenuItem>
        </Menu>
    )
}


export default NotificationsBox;