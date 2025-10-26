import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home as HomeIcon,
  Login as LoginIcon,
  Dashboard as DashboardIcon,
  Assignment as TaskIcon,
  Slideshow as SlidesIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';

interface MenuAppBarProps {
  onMenuClick?: () => void;
}

export default function MenuAppBar({ onMenuClick }: MenuAppBarProps = {}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [localDrawerOpen, setLocalDrawerOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleDrawerToggle = () => {
    if (onMenuClick) {
      onMenuClick();
    } else {
      setLocalDrawerOpen(!localDrawerOpen);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('gateg_token');
    localStorage.removeItem('gateg_employee');
    navigate('/');
    handleClose();
  };

  const menuItems = [
    { text: 'Inicio', icon: <HomeIcon />, path: '/' },
    { text: 'Login', icon: <LoginIcon />, path: '/login' },
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Gestión Tareas', icon: <TaskIcon />, path: '/task-management' },
    { text: 'Slides', icon: <SlidesIcon />, path: '/slides' },
  ];

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box sx={{ p: 2, bgcolor: '#001f4d', color: 'white' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Packing Monitor
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              onClick={() => {
                navigate(item.path);
                if (onMenuClick) {
                  onMenuClick();
                } else {
                  setLocalDrawerOpen(false);
                }
              }}
            >
              <ListItemIcon sx={{ color: '#001f4d' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: '#001f4d', 
          boxShadow: '0px 2px 10px rgba(0,0,0,0.2)',
        }}
      >
        <Toolbar>
          <IconButton 
            size="large" 
            edge="start" 
            color="inherit" 
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Packing Monitor
          </Typography>

          <Button
            color="inherit"
            onClick={() => navigate('/login')}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            Login
          </Button>

          <Button
            color="inherit"
            onClick={() => navigate('/dashboard')}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              mr: 1,
              backgroundColor: location.pathname === '/dashboard' ? 'rgba(255,255,255,0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            Dashboard
          </Button>

          <Button
            color="inherit"
            onClick={() => navigate('/task-management')}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              mr: 1,
              backgroundColor: location.pathname === '/task-management' ? 'rgba(255,255,255,0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            Gestión Tareas
          </Button>

          <div>
            <IconButton size="large" onClick={handleMenu} color="inherit">
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={() => { navigate('/dashboard'); handleClose(); }}>
                <PersonIcon sx={{ mr: 1 }} />
                Mi Perfil
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} />
                Cerrar Sesión
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>

      {/* Drawer lateral */}
      <Drawer
        anchor="left"
        open={localDrawerOpen}
        onClose={() => setLocalDrawerOpen(false)}
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
