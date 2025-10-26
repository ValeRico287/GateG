import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Add as AddIcon,
  Group as TeamIcon,
  AccessTime as TimeIcon,
  Stars as PointsIcon
} from '@mui/icons-material';
import { apiClient, Task, Team } from '../services/api';

const TaskManagementPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<Task, 'id' | 'team_name'>>({
    name: '',
    description: '',
    team_id: undefined,
    standard_time_seconds: 0,
    points_base: 0,
    points_bonus_per_second_saved: 1
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksData, teamsData] = await Promise.all([
        apiClient.getAdminTasks(),
        apiClient.getTeams()
      ]);
      setTasks(tasksData);
      setTeams(teamsData);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await apiClient.updateTask(editingTask.id!, formData);
        setSuccess('Tarea actualizada exitosamente');
      } else {
        await apiClient.createTask(formData);
        setSuccess('Tarea creada exitosamente');
      }
      
      await loadData();
      handleCloseDialog();
    } catch (err: any) {
      setError(err.message || 'Error al guardar la tarea');
    }
  };

  const handleDelete = async () => {
    if (!taskToDelete?.id) return;
    
    try {
      await apiClient.deleteTask(taskToDelete.id);
      setSuccess('Tarea eliminada exitosamente');
      await loadData();
      setIsDeleteDialogOpen(false);
      setTaskToDelete(null);
    } catch (err: any) {
      setError(err.message || 'Error al eliminar la tarea');
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      name: task.name,
      description: task.description || '',
      team_id: task.team_id,
      standard_time_seconds: task.standard_time_seconds,
      points_base: task.points_base,
      points_bonus_per_second_saved: task.points_bonus_per_second_saved
    });
    setIsDialogOpen(true);
  };

  const handleOpenCreateDialog = () => {
    setEditingTask(null);
    setFormData({
      name: '',
      description: '',
      team_id: undefined,
      standard_time_seconds: 0,
      points_base: 0,
      points_bonus_per_second_saved: 1
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTask(null);
    setError(null);
  };

  const handleDeleteClick = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteDialogOpen(true);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const getTeamName = (teamId: number | undefined) => {
    const team = teams.find(t => t.id === teamId);
    return team?.name || 'Sin equipo';
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Cargando...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 'bold', color: '#001f4d' }}>
          Gestión de Tareas
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Administra las tareas disponibles en el sistema
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
          sx={{ 
            backgroundColor: '#001f4d',
            '&:hover': { backgroundColor: '#003366' }
          }}
        >
          Nueva Tarea
        </Button>
      </Box>

      {/* Mensajes de estado */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Lista de tareas */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Nombre</strong></TableCell>
                  <TableCell><strong>Descripción</strong></TableCell>
                  <TableCell><strong>Equipo</strong></TableCell>
                  <TableCell><strong>Tiempo Estándar</strong></TableCell>
                  <TableCell><strong>Puntos Base</strong></TableCell>
                  <TableCell><strong>Bonus por Segundo</strong></TableCell>
                  <TableCell><strong>Acciones</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {task.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {task.description || 'Sin descripción'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getTeamName(task.team_id)}
                        icon={<TeamIcon />}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TimeIcon sx={{ mr: 1, fontSize: 18, color: '#001f4d' }} />
                        {formatTime(task.standard_time_seconds)}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PointsIcon sx={{ mr: 1, fontSize: 18, color: '#001f4d' }} />
                        {task.points_base}
                      </Box>
                    </TableCell>
                    <TableCell>{task.points_bonus_per_second_saved}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(task)}
                          sx={{ color: '#001f4d' }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(task)}
                          sx={{ color: '#d32f2f' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {tasks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No hay tareas registradas
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialog para crear/editar tarea */}
      <Dialog 
        open={isDialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingTask ? 'Editar Tarea' : 'Nueva Tarea'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
              <TextField
                label="Nombre de la tarea"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                fullWidth
              />
              
              <TextField
                label="Descripción"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={3}
                fullWidth
              />
              
              <FormControl fullWidth>
                <InputLabel>Equipo</InputLabel>
                <Select
                  value={formData.team_id || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    team_id: e.target.value ? Number(e.target.value) : undefined 
                  })}
                  label="Equipo"
                >
                  <MenuItem value="">Sin equipo específico</MenuItem>
                  {teams.map((team) => (
                    <MenuItem key={team.id} value={team.id}>
                      {team.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TextField
                label="Tiempo estándar (segundos)"
                type="number"
                value={formData.standard_time_seconds}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  standard_time_seconds: parseInt(e.target.value) || 0 
                })}
                required
                fullWidth
                inputProps={{ min: 1 }}
              />
              
              <TextField
                label="Puntos base"
                type="number"
                value={formData.points_base}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  points_base: parseInt(e.target.value) || 0 
                })}
                required
                fullWidth
                inputProps={{ min: 1 }}
              />
              
              <TextField
                label="Puntos bonus por segundo ahorrado"
                type="number"
                value={formData.points_bonus_per_second_saved}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  points_bonus_per_second_saved: parseFloat(e.target.value) || 0 
                })}
                fullWidth
                inputProps={{ min: 0, step: 0.1 }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button 
              type="submit" 
              variant="contained"
              sx={{ 
                backgroundColor: '#001f4d',
                '&:hover': { backgroundColor: '#003366' }
              }}
            >
              {editingTask ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog de confirmación para eliminar */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres eliminar la tarea "{taskToDelete?.name}"?
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TaskManagementPage;