import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MenuAppBar from './navbar/page';
import LoginPage from './login/page';
import DashboardPage from './dashboard/page';
import TaskManagementPage from './taskManagement/page';
import Slides from './slides/page';
import Home from './home/page';

function App() {
  return (
    <Router>
      <MenuAppBar />
      <div style={{ marginTop: '64px', padding: '16px' }}>
        <Routes>         
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/slides" element={<Slides />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/task-management" element={<TaskManagementPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
