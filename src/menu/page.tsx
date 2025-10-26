"use client";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SchoolIcon from "@mui/icons-material/School";
import LoginIcon from "@mui/icons-material/Login";
import TaskIcon from "@mui/icons-material/Task";
import { useNavigate } from "react-router-dom";

interface MenuOption {
  text: string;
  path: string;
  icon: React.ReactNode;
}

interface MenuDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
}

export default function MenuDrawer({ isOpen = false, onClose, onOpen }: MenuDrawerProps = {}) {
  const [localIsOpen, setLocalIsOpen] = useState(isOpen);
  const navigate = useNavigate();
  
  const drawerOpen = onClose && onOpen ? isOpen : localIsOpen;

  const menuOptions: MenuOption[] = [
    {
      text: "Inicio",
      path: "/",
      icon: <HomeIcon sx={{ color: "#001f4d" }} />,
    },
    {
      text: "Dashboard",
      path: "/dashboard",
      icon: <DashboardIcon sx={{ color: "#001f4d" }} />,
    },
    {
      text: "Entrenamiento",
      path: "/slides",
      icon: <SchoolIcon sx={{ color: "#001f4d" }} />,
    },
    {
      text: "Seguimiento de Tareas",
      path: "/taskTracking",
      icon: <TaskIcon sx={{ color: "#001f4d" }} />,
    },
    {
      text: "Iniciar Sesión",
      path: "/login",
      icon: <LoginIcon sx={{ color: "#001f4d" }} />,
    },
  ];

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }
    if (onClose && onOpen) {
      open ? onOpen() : onClose();
    } else {
      setLocalIsOpen(open);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (onClose) {
      onClose();
    } else {
      setLocalIsOpen(false);
    }
  };

  return (
    <>
      <IconButton
        onClick={toggleDrawer(true)}
        sx={{
          position: "fixed",
          left: 16,
          top: 16,
          backgroundColor: "white",
          "&:hover": {
            backgroundColor: "#f5f5f5",
          },
        }}
      >
        <MenuIcon sx={{ color: "#001f4d" }} />
      </IconButton>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 280,
            backgroundColor: "#f4f6fa",
            height: "100%",
            pt: 2,
          }}
          role="presentation"
        >
          <List>
            {menuOptions.map((option) => (
              <ListItem key={option.path} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(option.path)}
                  sx={{
                    py: 1.5,
                    "&:hover": {
                      backgroundColor: "rgba(0, 31, 77, 0.08)",
                    },
                  }}
                >
                  <ListItemIcon>{option.icon}</ListItemIcon>
                  <ListItemText
                    primary={option.text}
                    sx={{
                      "& .MuiListItemText-primary": {
                        color: "#001f4d",
                        fontWeight: 500,
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
