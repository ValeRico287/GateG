"use client";
import React from "react";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import BookOutlinedIcon from "@mui/icons-material/BookOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        background: "linear-gradient(180deg, #001f4d 0%, #003366 100%)",
        color: "white",
        fontFamily: "Roboto, sans-serif",
        py: 6,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 4,
        }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            color: "#001f4d",
            width: 48,
            height: 48,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: 24,
          }}
        >
          📦
        </Box>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Packing Monitor
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Training and Monitoring System
          </Typography>
        </Box>
      </Box>

      <Card
        sx={{
          width: "90%",
          maxWidth: 600,
          borderRadius: 4,
          textAlign: "center",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
          background: "white",
          color: "#001f4d",
          p: 3,
        }}
      >
        <CardContent>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
            Welcome to PackPro!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Your personal productivity assistant
          </Typography>

          <Typography variant="body1" fontWeight="medium" sx={{ mb: 3 }}>
            Is this your first time using the system?
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<BookOutlinedIcon />}
              onClick={() => navigate("/slides")}
              sx={{
                borderColor: "#001f4d",
                color: "#001f4d",
                borderRadius: 3,
                py: 2,
                textTransform: "none",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#001f4d",
                  color: "white",
                },
              }}
            >
              Yes, I'm new — View training and guides
            </Button>

            <Button
              variant="outlined"
              startIcon={<BoltOutlinedIcon />}
              onClick={() => navigate("/dashboard")}
              sx={{
                borderColor: "#001f4d",
                color: "#001f4d",
                borderRadius: 3,
                py: 2,
                textTransform: "none",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#001f4d",
                  color: "white",
                },
              }}
            >
              I'm experienced — Go to the dashboard
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
