"use client";
import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CubeIcon from "@mui/icons-material/Inventory2";

export default function TaskTrackingPage() {
  return (
    <Box
      sx={{
        backgroundColor: "#faf6f6",
        minHeight: "100vh",
        fontFamily: "Roboto, sans-serif",
      }}
    >
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: "white",
          color: "#6b0012",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="h6" fontWeight="bold" color="#6b0012">
              PackagePro
            </Typography>

            <Button sx={{ color: "#6b0012", textTransform: "none" }}>
              Dashboard
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#6b0012",
                "&:hover": { backgroundColor: "#900020" },
                textTransform: "none",
              }}
            >
              Track Work
            </Button>
            <Button sx={{ color: "#6b0012", textTransform: "none" }}>
              Achievements
            </Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#f4e8e8",
              borderRadius: 3,
              px: 2,
              py: 0.5,
            }}
          >
            <Typography sx={{ fontWeight: "bold", mr: 1 }}>John Doe</Typography>
            <Typography variant="body2" color="text.secondary">
              Employee
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 3,
          }}
        >
          <IconButton
            sx={{
              backgroundColor: "white",
              border: "1px solid #ddd",
              color: "#6b0012",
              "&:hover": { backgroundColor: "#f4e8e8" },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="#6b0012">
              Task Tracking
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Log your work and monitor your progress
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
          }}
        >
          <Card
            sx={{
              flex: "1 1 300px",
              borderRadius: 3,
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <CardContent>
              <Typography variant="h6" color="#6b0012" fontWeight="bold" mb={1}>
                Log Your Work
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Track your packaging progress and earn points
              </Typography>

              <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2}>
                <TextField
                  label="Boxes Packed"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Inventory2OutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Time Spent (minutes)"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccessTimeOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Button
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  backgroundColor: "#6b0012",
                  "&:hover": { backgroundColor: "#900020" },
                  borderRadius: 2,
                  textTransform: "none",
                }}
              >
                Log Task
              </Button>
            </CardContent>
          </Card>

          <Card
            sx={{
              flex: "1 1 300px",
              borderRadius: 3,
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Typography variant="h6" color="#6b0012" fontWeight="bold" mb={1}>
                Recent Tasks
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Your latest packaging activities
              </Typography>
              <CubeIcon sx={{ fontSize: 48, color: "#bbb", mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                No tasks logged yet. Start tracking your work above!
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
