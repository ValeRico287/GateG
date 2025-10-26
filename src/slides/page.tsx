"use client";
import React, { useState } from "react";
import TrainingStepCard from "../components/TrainingStepCard";
import { Box, Typography, Button } from "@mui/material";

interface TipStep {
  title: string;
  description: string;
  tips: string[];
}

interface VideoStep {
  title: string;
  description: string;
  videoUrl: string;
}

type Step = TipStep | VideoStep;

export default function Slides() {
  const [step, setStep] = useState(1);

  const steps: Step[] = [
    {
      title: "Workspace Preparation",
      description:
        "Before starting, make sure your work area is clean, organized, and ready for packing.",
      tips: [
        "Keep empty boxes on your right",
        "Place products to be packed on your left",
        "Have tape and tools within reach",
        "Organize labels by product category",
      ],
    },
    {
      title: "Packing Techniques",
      description:
        "Using the correct packing technique increases efficiency and reduces errors.",
      tips: [
        "Place heavier items at the bottom",
        "Fill empty spaces with cushioning material",
        "Double-check the order before sealing",
        "Seal boxes in an 'H' pattern for extra strength",
      ],
    },
    {
      title: "Quality Control",
      description:
        "High-quality packing reduces returns and increases customer satisfaction.",
      tips: [
        "Verify that each product matches the order",
        "Ensure nothing moves inside the box",
        "Place the label in a visible position",
        "Check that the seal is firm and clean",
      ],
    },
    {
      title: "Time Optimization",
      description: "Work smart, not just fast.",
      tips: [
        "Pack similar products in sequence",
        "Maintain a consistent pace — don’t rush",
        "Take short breaks every hour",
        "Review your performance metrics regularly",
      ],
    },
    {
      title: "Training Video Recap",
      description:
        "Watch this short video to review the correct packing process and best practices.",
      videoUrl: "https://www.youtube.com/embed/SvM7fm55bK8?start=126",
    },
  ];

  const currentStep = steps[step - 1];

  const isTipStep = (s: Step): s is TipStep => "tips" in s;

  return (
    <>
      {isTipStep(currentStep) ? (
        <TrainingStepCard
          stepNumber={step}
          totalSteps={steps.length}
          title={currentStep.title}
          description={currentStep.description}
          tips={currentStep.tips}
          onPrev={() => setStep((s) => Math.max(1, s - 1))}
          onNext={() => setStep((s) => Math.min(steps.length, s + 1))}
        />
      ) : (
        <Box
          sx={{
            p: 4,
            minHeight: "100vh",
            backgroundColor: "#f5f7fa",
            textAlign: "center",
          }}
        >
          <Typography variant="h5" fontWeight="bold" color="#003366" mb={2}>
            {currentStep.title}
          </Typography>
          <Typography variant="body1" mb={3}>
            {currentStep.description}
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <iframe
              width="800"
              height="450"
              src={currentStep.videoUrl}
              title="Training Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </Box>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#003366",
              "&:hover": { backgroundColor: "#001f4d" },
              mr: 2,
            }}
            onClick={() => setStep((s) => Math.max(1, s - 1))}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#003366",
              "&:hover": { backgroundColor: "#001f4d" },
            }}
            onClick={() =>
              alert("Training completed! You’re ready to start packing 🎉")
            }
          >
            Finish
          </Button>
        </Box>
      )}
    </>
  );
}
