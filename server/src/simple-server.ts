import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Simple server running' });
});

app.post('/api/auth/login', (req, res) => {
  console.log('Login request:', req.body);
  res.json({
    success: true,
    token: 'test-token-123',
    employee: {
      id: 1,
      employee_code: 'EMP001',
      first_name: 'Test',
      last_name: 'User',
      role: 'Administrador',
      points: 100,
      level: 1
    }
  });
});

app.get('/api/admin/tasks', (req, res) => {
  console.log('Tasks request');
  res.json([
    {
      id: 1,
      name: 'Tarea de prueba',
      description: 'Una tarea de ejemplo',
      team_id: 1,
      standard_time_seconds: 300,
      points_base: 10,
      points_bonus_per_second_saved: 1,
      team_name: 'Equipo A'
    }
  ]);
});

app.get('/api/teams', (req, res) => {
  console.log('Teams request');
  res.json([
    { id: 1, name: 'Equipo A', supervisor_id: 1 },
    { id: 2, name: 'Equipo B', supervisor_id: 2 }
  ]);
});

app.listen(PORT, () => {
  console.log(`✅ Servidor simple ejecutándose en http://localhost:${PORT}`);
});