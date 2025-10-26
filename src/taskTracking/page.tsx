"use client";

import React, { useState } from "react";
import { Box, Typography, Button, Card, CardContent, TextField, InputAdornment, IconButton, MenuItem, Select, FormControl, InputLabel, SelectChangeEvent } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CubeIcon from "@mui/icons-material/Inventory2";

export default function TaskTrackingPage() {
  // Definir tipos explícitos para los estados
  const [timeUnit, setTimeUnit] = useState<"minutes" | "hours" | "both">("minutes"); // Tipo para unidad de tiempo
  const [hours, setHours] = useState<string>("");  // Estado para las horas, tipo string
  const [minutes, setMinutes] = useState<string>(""); // Estado para los minutos, tipo string

  // Cambiar el estado timeUnit cuando el usuario selecciona una opción
  const handleTimeUnitChange = (event: SelectChangeEvent<"minutes" | "hours" | "both">) => {
    setTimeUnit(event.target.value);
  };

  return (
    <Box sx={{ p: 5 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <IconButton
          sx={{
            backgroundColor: "white",
            border: "1px solid #ddd",
            color: "#003366",
            "&:hover": { backgroundColor: "#f4e8e8" },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="#003366">
            Task Tracking
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Log your work and monitor your progress
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        <Card sx={{ flex: "1 1 300px", borderRadius: 3, boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
          <CardContent>
            <Typography variant="h6" color="#003366" fontWeight="bold" mb={1}>
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
              {/* Campo para ingresar horas si se elige "hours" */}
              {timeUnit === "hours" && (
                <TextField
                  label="Hours"
                  fullWidth
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccessTimeOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
              {/* Campo para ingresar minutos */}
              <TextField
                label="Time Spent (minutes)"
                fullWidth
                type="number"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTimeOutlinedIcon />
                    </InputAdornment>
                  ),
                }}
              />
              {/* Selector de unidad de tiempo */}
              <FormControl fullWidth>
                <InputLabel>Time Unit</InputLabel>
                <Select
                  value={timeUnit}
                  onChange={handleTimeUnitChange}
                  label="Time Unit"
                >
                  <MenuItem value="minutes">Minutes</MenuItem>
                  <MenuItem value="hours">Hours</MenuItem>
                  <MenuItem value="both">Hours & Minutes</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                backgroundColor: "#003366",
                "&:hover": { backgroundColor: "#001f33" },
                borderRadius: 2,
                textTransform: "none",
              }}
            >
              Log Task
            </Button>
          </CardContent>
        </Card>

        <Card sx={{ flex: "1 1 300px", borderRadius: 3, boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
          <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <Typography variant="h6" color="#003366" fontWeight="bold" mb={1}>
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
  );
}
