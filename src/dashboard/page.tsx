"use client";
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { apiClient, type Employee, type Task, type WorkLogResponse } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
	const navigate = useNavigate();
	const [employee, setEmployee] = useState<Employee | null>(null);
	const [tasks, setTasks] = useState<Task[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [taskDialogOpen, setTaskDialogOpen] = useState(false);

	useEffect(() => {
		loadDashboardData();
	}, []);

	const loadDashboardData = async () => {
		try {
			setLoading(true);
			
			// Verificar si está autenticado
			if (!apiClient.isAuthenticated()) {
				navigate('/login');
				return;
			}

			// Cargar datos del empleado y tareas en paralelo
			const [employeeData, tasksData] = await Promise.all([
				apiClient.getProfile(),
				apiClient.getTasks()
			]);

			setEmployee(employeeData);
			setTasks(tasksData);
		} catch (err: any) {
			console.error('Error loading dashboard:', err);
			setError(err.message || 'Error cargando datos');
			
			// Si hay error de autenticación, redirigir al login
			if (err.message?.includes('Token') || err.message?.includes('401')) {
				apiClient.logout();
				navigate('/login');
			}
		} finally {
			setLoading(false);
		}
	};

	const handleLogTaskClick = () => {
		setTaskDialogOpen(true);
	};

	const handleStartTask = async (taskId: number) => {
		try {
			const result = await apiClient.startWorkLog(taskId);
			
			if (result.success) {
				const taskName = tasks.find(t => t.id === taskId)?.name;
				alert(`¡Tarea iniciada exitosamente!\n\nTarea: ${taskName}\n\nComienza a trabajar. Cuando termines, podrás marcar la tarea como completada.`);
				setTaskDialogOpen(false);
				
				// Recargar datos del dashboard para actualizar la información
				await loadDashboardData();
			}
		} catch (err: any) {
			setError(err.message || 'Error iniciando tarea');
		}
	};

	if (loading) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Box p={4}>
				<Alert severity="error">{error}</Alert>
			</Box>
		);
	}
	const cards = [
		{
			title: "Total Tasks Completed",
			value: "0", // TODO: obtener de work_logs
			subtitle: "All time",
			icon: <Inventory2Icon sx={{ color: "#001f4d" }} />,
		},
		{
			title: "Total Time",
			value: "0h 0m", // TODO: calcular de work_logs
			subtitle: "All time",
			icon: <AccessTimeIcon sx={{ color: "#001f4d" }} />,
		},
		{
			title: "Current Points",
			value: employee?.points?.toString() || "0",
			subtitle: `Level ${employee?.level || 1}`,
			trend: "+0% vs previous",
			icon: <TrendingUpIcon sx={{ color: "#001f4d" }} />,
		},
		{
			title: "Level",
			value: employee?.level?.toString() || "1",
			subtitle: `${employee?.points || 0} points`,
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
						Welcome back, {employee?.first_name} {employee?.last_name}!
					</Typography>
					<Typography variant="body1" color="text.secondary">
						{employee?.role} - {employee?.team_name || 'Sin equipo asignado'}
					</Typography>
				</Box>

				<Button
					variant="contained"
					onClick={handleLogTaskClick}
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

			{/* Dialog para seleccionar tarea */}
			<Dialog open={taskDialogOpen} onClose={() => setTaskDialogOpen(false)} maxWidth="sm" fullWidth>
				<DialogTitle>Seleccionar Tarea</DialogTitle>
				<DialogContent>
					<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
						Elige una tarea para comenzar a trabajar:
					</Typography>
					<List>
						{tasks.map((task) => (
							<ListItem key={task.id} disablePadding>
								<ListItemButton onClick={() => handleStartTask(task.id)}>
									<PlayArrowIcon sx={{ mr: 2, color: "#001f4d" }} />
									<ListItemText
										primary={task.name}
										secondary={
											<>
												<Typography component="span" variant="body2">
													{task.description}
												</Typography>
												<br />
												<Typography component="span" variant="caption" color="text.secondary">
													Tiempo estándar: {Math.floor(task.standard_time_seconds / 60)}m {task.standard_time_seconds % 60}s | 
													Puntos base: {task.points_base}
												</Typography>
											</>
										}
									/>
								</ListItemButton>
							</ListItem>
						))}
					</List>
					{tasks.length === 0 && (
						<Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
							No hay tareas disponibles para tu equipo.
						</Typography>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setTaskDialogOpen(false)}>Cancelar</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}