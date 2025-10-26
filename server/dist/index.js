"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'gateg-secret-key';
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Rutas de salud
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'GateG API is running' });
});
// Ruta de login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { employee_code, pin } = req.body;
        if (!employee_code || !pin) {
            return res.status(400).json({
                error: 'employee_code y pin son requeridos'
            });
        }
        // Buscar empleado por código
        const employees = await (0, db_1.query)('SELECT * FROM employees WHERE employee_code = ? AND is_active = TRUE', [employee_code]);
        if (employees.length === 0) {
            return res.status(401).json({
                error: 'Credenciales inválidas'
            });
        }
        const employee = employees[0];
        // Verificar PIN
        const isValidPin = await bcrypt_1.default.compare(pin, employee.pin_hash);
        if (!isValidPin) {
            return res.status(401).json({
                error: 'Credenciales inválidas'
            });
        }
        // Generar JWT
        const token = jsonwebtoken_1.default.sign({
            employeeId: employee.id,
            employeeCode: employee.employee_code,
            role: employee.role
        }, JWT_SECRET, { expiresIn: '8h' });
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
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
// Middleware de autenticación
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token de acceso requerido' });
    }
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido' });
        }
        req.user = decoded;
        next();
    });
};
// Ruta protegida: perfil del empleado
app.get('/api/employee/profile', authenticateToken, async (req, res) => {
    try {
        const { employeeId } = req.user;
        const employees = await (0, db_1.query)(`SELECT e.*, t.name as team_name 
       FROM employees e 
       LEFT JOIN teams t ON e.team_id = t.id 
       WHERE e.id = ?`, [employeeId]);
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
    }
    catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
// Ruta: obtener tareas del equipo
app.get('/api/tasks', authenticateToken, async (req, res) => {
    try {
        const { employeeId } = req.user;
        // Obtener el team_id del empleado
        const employeeData = await (0, db_1.query)('SELECT team_id FROM employees WHERE id = ?', [employeeId]);
        if (employeeData.length === 0) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }
        const teamId = employeeData[0].team_id;
        // Obtener tareas del equipo
        const tasks = await (0, db_1.query)('SELECT * FROM task_definitions WHERE team_id = ? OR team_id IS NULL', [teamId]);
        res.json(tasks);
    }
    catch (error) {
        console.error('Tasks error:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
// Ruta: iniciar work log
app.post('/api/work-logs/start', authenticateToken, async (req, res) => {
    try {
        const { employeeId } = req.user;
        const { task_definition_id } = req.body;
        if (!task_definition_id) {
            return res.status(400).json({ error: 'task_definition_id es requerido' });
        }
        // Verificar que no hay work logs activos para este empleado
        const activeWorkLogs = await (0, db_1.query)('SELECT id FROM work_logs WHERE employee_id = ? AND status = "activo"', [employeeId]);
        if (activeWorkLogs.length > 0) {
            return res.status(400).json({ error: 'Ya tienes una tarea activa. Completa la tarea actual antes de iniciar una nueva.' });
        }
        // Crear nuevo work log
        const result = await (0, db_1.query)(`INSERT INTO work_logs (employee_id, task_definition_id, status, start_time) 
       VALUES (?, ?, 'activo', NOW())`, [employeeId, task_definition_id]);
        // Obtener el work log creado con información de la tarea
        const workLog = await (0, db_1.query)(`SELECT wl.*, td.name as task_name, td.description as task_description
       FROM work_logs wl 
       JOIN task_definitions td ON wl.task_definition_id = td.id
       WHERE wl.id = ?`, [result.insertId]);
        res.json({
            success: true,
            work_log: workLog[0],
            message: 'Tarea iniciada exitosamente'
        });
    }
    catch (error) {
        console.error('Start work log error:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
// Ruta: completar work log
app.post('/api/work-logs/complete', authenticateToken, async (req, res) => {
    try {
        const { employeeId } = req.user;
        const { work_log_id } = req.body;
        if (!work_log_id) {
            return res.status(400).json({ error: 'work_log_id es requerido' });
        }
        // Obtener work log activo
        const workLogs = await (0, db_1.query)(`SELECT wl.*, td.points_base, td.points_bonus_per_second_saved, td.standard_time_seconds
       FROM work_logs wl 
       JOIN task_definitions td ON wl.task_definition_id = td.id
       WHERE wl.id = ? AND wl.employee_id = ? AND wl.status = 'activo'`, [work_log_id, employeeId]);
        if (workLogs.length === 0) {
            return res.status(404).json({ error: 'Work log no encontrado o ya completado' });
        }
        const workLog = workLogs[0];
        const endTime = new Date();
        const startTime = new Date(workLog.start_time);
        const durationSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
        // Calcular puntos
        let pointsEarned = workLog.points_base;
        if (durationSeconds < workLog.standard_time_seconds) {
            const secondsSaved = workLog.standard_time_seconds - durationSeconds;
            pointsEarned += secondsSaved * workLog.points_bonus_per_second_saved;
        }
        // Actualizar work log
        await (0, db_1.query)(`UPDATE work_logs 
       SET status = 'completado', end_time = NOW(), duration_seconds = ?, points_earned = ?
       WHERE id = ?`, [durationSeconds, pointsEarned, work_log_id]);
        // Actualizar puntos del empleado
        await (0, db_1.query)('UPDATE employees SET points = points + ? WHERE id = ?', [pointsEarned, employeeId]);
        res.json({
            success: true,
            points_earned: pointsEarned,
            duration_seconds: durationSeconds,
            message: 'Tarea completada exitosamente'
        });
    }
    catch (error) {
        console.error('Complete work log error:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
// ===== RUTAS ADMINISTRATIVAS =====
// Ruta: obtener todos los equipos
app.get('/api/teams', authenticateToken, async (req, res) => {
    try {
        const teams = await (0, db_1.query)('SELECT id, name, supervisor_id FROM teams ORDER BY name');
        res.json(teams);
    }
    catch (error) {
        console.error('Teams error:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
// Ruta: obtener todas las tareas (admin)
app.get('/api/admin/tasks', authenticateToken, async (req, res) => {
    try {
        const { role } = req.user;
        // Verificar permisos
        if (role !== 'Administrador' && role !== 'Supervisor') {
            return res.status(403).json({ error: 'No tienes permisos para acceder a esta función' });
        }
        const tasks = await (0, db_1.query)(`
      SELECT td.*, t.name as team_name 
      FROM task_definitions td
      LEFT JOIN teams t ON td.team_id = t.id
      ORDER BY td.name
    `);
        res.json(tasks);
    }
    catch (error) {
        console.error('Admin tasks error:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
// Ruta: crear nueva tarea
app.post('/api/admin/tasks', authenticateToken, async (req, res) => {
    try {
        const { role } = req.user;
        if (role !== 'Administrador' && role !== 'Supervisor') {
            return res.status(403).json({ error: 'No tienes permisos para crear tareas' });
        }
        const { name, description, team_id, standard_time_seconds, points_base, points_bonus_per_second_saved } = req.body;
        if (!name || !standard_time_seconds || !points_base) {
            return res.status(400).json({ error: 'Campos requeridos: name, standard_time_seconds, points_base' });
        }
        const result = await (0, db_1.query)(`
      INSERT INTO task_definitions 
      (name, description, team_id, standard_time_seconds, points_base, points_bonus_per_second_saved)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [name, description || '', team_id || null, standard_time_seconds, points_base, points_bonus_per_second_saved || 1]);
        // Obtener la tarea creada
        const newTask = await (0, db_1.query)('SELECT * FROM task_definitions WHERE id = ?', [result.insertId]);
        res.json(newTask[0]);
    }
    catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
// Ruta: actualizar tarea
app.put('/api/admin/tasks/:id', authenticateToken, async (req, res) => {
    try {
        const { role } = req.user;
        if (role !== 'Administrador' && role !== 'Supervisor') {
            return res.status(403).json({ error: 'No tienes permisos para editar tareas' });
        }
        const { id } = req.params;
        const { name, description, team_id, standard_time_seconds, points_base, points_bonus_per_second_saved } = req.body;
        await (0, db_1.query)(`
      UPDATE task_definitions 
      SET name = ?, description = ?, team_id = ?, standard_time_seconds = ?, 
          points_base = ?, points_bonus_per_second_saved = ?
      WHERE id = ?
    `, [name, description || '', team_id || null, standard_time_seconds, points_base, points_bonus_per_second_saved || 1, id]);
        // Obtener la tarea actualizada
        const updatedTask = await (0, db_1.query)('SELECT * FROM task_definitions WHERE id = ?', [id]);
        res.json(updatedTask[0]);
    }
    catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
// Ruta: eliminar tarea
app.delete('/api/admin/tasks/:id', authenticateToken, async (req, res) => {
    try {
        const { role } = req.user;
        if (role !== 'Administrador' && role !== 'Supervisor') {
            return res.status(403).json({ error: 'No tienes permisos para eliminar tareas' });
        }
        const { id } = req.params;
        // Verificar si la tarea tiene work logs asociados
        const workLogs = await (0, db_1.query)('SELECT COUNT(*) as count FROM work_logs WHERE task_definition_id = ?', [id]);
        if (workLogs[0].count > 0) {
            return res.status(400).json({
                error: 'No se puede eliminar la tarea porque tiene registros de trabajo asociados'
            });
        }
        await (0, db_1.query)('DELETE FROM task_definitions WHERE id = ?', [id]);
        res.json({ success: true, message: 'Tarea eliminada exitosamente' });
    }
    catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
// Iniciar servidor
const startServer = async () => {
    // Verificar conexión a la base de datos
    const dbConnected = await (0, db_1.testConnection)();
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
//# sourceMappingURL=index.js.map