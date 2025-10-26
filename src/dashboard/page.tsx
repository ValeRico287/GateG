"use client";
import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";

export default function DashboardPage() {
	const cards = [
		{
			title: "Total Boxes Packed",
			value: "0",
			subtitle: "All time",
			icon: <Inventory2Icon sx={{ color: "#001f4d" }} />,
		},
		{
			title: "Total Time",
			value: "0h 0m",
			subtitle: "All time",
			icon: <AccessTimeIcon sx={{ color: "#001f4d" }} />,
		},
		{
			title: "Average Efficiency",
			value: "0.0",
			subtitle: "boxes per hour",
			trend: "+0% vs previous",
			icon: <TrendingUpIcon sx={{ color: "#001f4d" }} />,
		},
		{
			title: "Level",
			value: "3",
			subtitle: "1250 points",
			icon: <EmojiEventsIcon sx={{ color: "#001f4d" }} />,
		},
	];

	return (
		<Box
			sx={{
				p: 4,
				backgroundColor: "#f4f6fa",
				minHeight: "100vh",
				fontFamily: "Roboto, sans-serif",
			}}
		>
			<Box
				sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}
			>
				<Box>
					<Typography variant="h4" fontWeight="bold" color="#001f4d" sx={{ mb: 0.5 }}>
						Welcome back, John Doe!
					</Typography>
					<Typography variant="body1" color="text.secondary">
						Track your performance and improve your efficiency
					</Typography>
				</Box>

				<Button
					variant="contained"
					sx={{
						backgroundColor: "#001f4d",
						"&:hover": { backgroundColor: "#002a6d" },
						textTransform: "none",
						px: 3,
						py: 1,
						borderRadius: 2,
						fontWeight: "bold",
					}}
				>
					+ Log Task
				</Button>
			</Box>

					<Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
						{cards.map((card, i) => (
							<Box key={i} sx={{ width: { xs: "100%", sm: "50%", md: "25%" } }}>
								<Card
							sx={{
								borderRadius: 3,
								boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
								transition: "transform 0.2s ease, box-shadow 0.2s ease",
								"&:hover": {
									transform: "translateY(-4px)",
									boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
								},
							}}
						>
							<CardContent>
								<Box display="flex" justifyContent="space-between" alignItems="center">
									<Typography variant="h6" color="#001f4d">
										{card.title}
									</Typography>
									{card.icon}
								</Box>

								<Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
									{card.value}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{card.subtitle}
								</Typography>
								{card.trend && (
									<Typography variant="caption" color="error">
										{card.trend}
									</Typography>
								)}
							</CardContent>
						</Card>
					</Box>
				))}
			</Box>

					{/* Trends and Feedback */}
					<Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
						<Box sx={{ width: { xs: "100%", md: "50%" } }}>
							<Card sx={{ borderRadius: 3, boxShadow: "0 4px 10px rgba(0,0,0,0.1)", height: "100%" }}>
						<CardContent>
							<Typography variant="h6" color="#001f4d" sx={{ mb: 1 }}>
								Performance Trend
							</Typography>
							<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
								Your efficiency over time
							</Typography>
							<Divider sx={{ mb: 2 }} />
							<Typography variant="body2" color="text.secondary">
								No data available yet. Start logging tasks to see your performance trend.
							</Typography>
						</CardContent>
					</Card>
						</Box>

						<Box sx={{ width: { xs: "100%", md: "50%" } }}>
							<Card sx={{ borderRadius: 3, boxShadow: "0 4px 10px rgba(0,0,0,0.1)", height: "100%" }}>
						<CardContent>
							<Typography variant="h6" color="#001f4d" sx={{ mb: 1 }}>
								Feedback & Tips
							</Typography>
							<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
								Performance insights and suggestions
							</Typography>
							<Divider sx={{ mb: 2 }} />
							<Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" mt={4}>
								<LightbulbOutlinedIcon sx={{ fontSize: 50, color: "#001f4d", mb: 1 }} />
								<Typography variant="body2" color="text.secondary">
									No feedback yet. Keep up the good work!
								</Typography>
							</Box>
						</CardContent>
					</Card>
				</Box>
			</Box>
		</Box>
	);
}