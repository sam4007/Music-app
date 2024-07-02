import React, { useState, useEffect } from 'react'
import { AppBar, Toolbar, Typography, Container, Box, IconButton, Menu, MenuItem, Button, Avatar, Tooltip } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode';
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useStyles } from './styles'
import { jwtDecode } from 'jwt-decode'
import { LOGOUT } from '../../constants/actionTypes'
import { useTheme } from '../../ThemeContext'


const Navbar = () => {
    const classes = useStyles();
    const location = useLocation();
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();

    const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
    const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
    const handleCloseNavMenu = () => setAnchorElNav(null);
    const handleCloseUserMenu = () => setAnchorElUser(null);

    const handleProfile = () => {
        setAnchorElUser(null);
        navigate('/profile');
    }
    const handleAlbum = () => {
        setAnchorElUser(null);
        navigate('/allAlbum');
    }
    const handleHome = () => {
        setAnchorElUser(null);
        navigate('/');
    }

    const logout = () => {
        setAnchorElUser(null);
        dispatch({ type: LOGOUT });
        navigate('/');
        setUser(null);
    }
    const handleUserRedirect = (id) => {
        setAnchorElUser(null);
        navigate(`/${user.user._id}`)
    }
    const handleUploadRedirect = (id) => {
        setAnchorElUser(null);
        navigate(`/songupload`)
    }
    
    useEffect(() => {
        const token = user?.token
        if (token) {
            const decodedToken = jwtDecode(token)
            if (decodedToken.exp * 1000 < new Date().getTime()) logout()
        }
        setUser(JSON.parse(localStorage.getItem('profile')));
    }, [location, user?.token]);

    return (
        <AppBar sx={{ backgroundColor: 'secondary.dark', color: 'primary.dark' }} position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography variant="h6" component={Link} to='/' noWrap sx={classes.logo1}>muSic</Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                            keepMounted
                            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            <MenuItem sx={{ backgroundColor: 'secondary.dark', color: 'primary.dark' }} onClick={handleHome}>
                                    <Typography textAlign="center">Home</Typography>
                            </MenuItem>
                            <MenuItem sx={{ backgroundColor: 'secondary.dark', color: 'primary.dark' }} onClick={handleAlbum}>
                                <Typography textAlign="center">Albums</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>

                    <Typography variant="h5" noWrap component={Link} to='/' sx={classes.logo2}>muSic</Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        <Button onClick={handleHome} sx={{ my: 2, color: 'white', display: 'block' }}>
                            Home
                        </Button>
                        <Button onClick={handleAlbum} sx={{ my: 2, color: 'white', display: 'block' }}>
                            Albums
                        </Button>
                    </Box>
                    
                    <Button color='inherit' onClick={toggleTheme}>
                        {isDarkMode ? <DarkModeIcon /> : <LightModeIcon />}
                    </Button>

                    {user ? (
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt={user.user.displayName} src={user.user.imageURL}>{user.user.displayName.charAt(0)}</Avatar>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                keepMounted
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <MenuItem sx={{ backgroundColor: 'secondary.dark', color: 'primary.dark' }} onClick={handleProfile}>
                                    <Typography textAlign="center">Profile</Typography>
                                </MenuItem>
                                <MenuItem sx={{ backgroundColor: 'secondary.dark', color: 'primary.dark' }} onClick={handleUserRedirect}>
                                    <Typography textAlign="center">My Uploads</Typography>
                                </MenuItem>
                                <MenuItem sx={{ backgroundColor: 'secondary.dark', color: 'primary.dark' }} onClick={handleUploadRedirect}>
                                    <Typography textAlign="center">Upload muSic</Typography>
                                </MenuItem>
                                <MenuItem sx={{ backgroundColor: 'secondary.dark', color: 'primary.dark' }} onClick={logout}>
                                    <Typography textAlign="center">Logout</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                    ) : (
                        <IconButton onClick={() => navigate('/auth')}>
                            <Avatar />
                        </IconButton>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
