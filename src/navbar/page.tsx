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
import { useNavigate } from 'react-router-dom';

export default function MenuAppBar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

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
          <IconButton size="large" edge="start" color="inherit" sx={{ mr: 2 }}>
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
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My Account</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
