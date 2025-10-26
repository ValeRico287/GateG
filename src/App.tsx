import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Box from '@mui/material/Box';
import MenuAppBar from './navbar/page';
import MenuDrawer from './menu/page';
import LoginPage from './login/page';
import DashboardPage from './dashboard/page';
import Slides from './slides/page';
import Home from './home/page';
import TaskTrackingPage from './taskTracking/page';

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const handleDrawerOpen = () => setIsDrawerOpen(true);
  const handleDrawerClose = () => setIsDrawerOpen(false);

  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <MenuAppBar onMenuClick={handleDrawerOpen} />
        <MenuDrawer
          isOpen={isDrawerOpen}
          onClose={handleDrawerClose}
          onOpen={handleDrawerOpen} />
        <Box component="main" sx={{ flexGrow: 1, marginTop: '64px' }}>
          <Routes>         
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/slides" element={<Slides />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/taskTracking" element={<TaskTrackingPage />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
