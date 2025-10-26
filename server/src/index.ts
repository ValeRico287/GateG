import express, { Request, Response } from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { testConnection, query, Employee } from './db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'gateg-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Rutas de salud
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'GateG API is running' });
});

// Ruta de login
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { employee_code, pin } = req.body;

    if (!employee_code || !pin) {
      return res.status(400).json({ 
        error: 'employee_code y pin son requeridos' 
      });
    }

    // Buscar empleado por código
    const employees = await query(
      'SELECT * FROM employees WHERE employee_code = ? AND is_active = TRUE',
      [employee_code]
    ) as Employee[];

    if (employees.length === 0) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    const employee = employees[0];

    // Verificar PIN
    const isValidPin = await bcrypt.compare(pin, employee.pin_hash);
    if (!isValidPin) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    // Generar JWT
    const token = jwt.sign(
      { 
        employeeId: employee.id, 
        employeeCode: employee.employee_code,
        role: employee.role 
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      success: true,
      token,
      employee: {
        id: employee.id,
        employee_code: employee.employee_code,
        first_name: employee.first_name,
        last_name: employee.last_name,
        role: employee.role,
        team_id: employee.team_id,
        points: employee.points,
        level: employee.level
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Middleware de autenticación
const authenticateToken = (req: Request, res: Response, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    (req as any).user = decoded;
    next();
  });
};

// Ruta protegida: perfil del empleado
app.get('/api/employee/profile', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { employeeId } = (req as any).user;
    
    const employees = await query(
      `SELECT e.*, t.name as team_name 
       FROM employees e 
       LEFT JOIN teams t ON e.team_id = t.id 
       WHERE e.id = ?`,
      [employeeId]
    ) as any[];

    if (employees.length === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    const employee = employees[0];
    res.json({
      id: employee.id,
      employee_code: employee.employee_code,
      first_name: employee.first_name,
      last_name: employee.last_name,
      role: employee.role,
      team_id: employee.team_id,
      team_name: employee.team_name,
      points: employee.points,
      level: employee.level,
      is_active: employee.is_active
    });

  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta: obtener tareas del equipo
app.get('/api/tasks', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { employeeId } = (req as any).user;
    
    // Obtener el team_id del empleado
    const employeeData = await query(
      'SELECT team_id FROM employees WHERE id = ?',
      [employeeId]
    ) as any[];

    if (employeeData.length === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    const teamId = employeeData[0].team_id;
    
    // Obtener tareas del equipo
    const tasks = await query(
      'SELECT * FROM task_definitions WHERE team_id = ? OR team_id IS NULL',
      [teamId]
    );

    res.json(tasks);

  } catch (error) {
    console.error('Tasks error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Iniciar servidor
const startServer = async () => {
  // Verificar conexión a la base de datos
  const dbConnected = await testConnection();
  
  if (!dbConnected) {
    console.error('❌ No se pudo conectar a la base de datos. Verifica tu configuración.');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
    console.log(`📊 API Health: http://localhost:${PORT}/health`);
  });
};

startServer();