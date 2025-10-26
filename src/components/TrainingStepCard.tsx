import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export interface TrainingStepProps {
  stepNumber: number;
  totalSteps: number;
  title: string;
  description: string;
  tips: string[];
  onPrev?: () => void;
  onNext?: () => void;
}

const TrainingStepCard: React.FC<TrainingStepProps> = ({
  stepNumber,
  totalSteps,
  title,
  description,
  tips,
  onPrev,
  onNext,
}) => {
  const progress = (stepNumber / totalSteps) * 100;

  return (
    <Box
      sx={{
        p: 4,
        backgroundColor: "#f5f7fa",
        minHeight: "100vh",
        fontFamily: "Roboto, sans-serif",
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" color="#0d1b2a">
          Packing Training
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 10,
            borderRadius: 5,
            backgroundColor: "#dce3f0",
            "& .MuiLinearProgress-bar": { backgroundColor: "#003366" },
            mt: 1,
          }}
        />
        <Typography
          variant="body2"
          sx={{ textAlign: "right", color: "#003366", mt: 0.5 }}
        >
          {stepNumber} of {totalSteps}
        </Typography>
      </Box>

      {/* Main card */}
      <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" color="#003366">
            Step {stepNumber}: {title}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
            {description}
          </Typography>

          <Box
            sx={{
              backgroundColor: "#eaf0fa",
              borderRadius: 2,
              p: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ color: "#003366", mb: 1 }}
            >
              Key Tips:
            </Typography>

            <List dense>
              {tips.map((tip, index) => (
                <ListItem key={index} sx={{ p: 0.5 }}>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: "#003366" }} />
                  </ListItemIcon>
                  <ListItemText primary={tip} />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 3,
            }}
          >
            <Button
              variant="outlined"
              onClick={onPrev}
              sx={{
                color: "#003366",
                borderColor: "#003366",
                "&:hover": {
                  backgroundColor: "#eaf0fa",
                  borderColor: "#00224d",
                },
              }}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              onClick={onNext}
              sx={{
                backgroundColor: "#003366",
                "&:hover": { backgroundColor: "#001f4d" },
              }}
            >
              Next
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TrainingStepCard;
