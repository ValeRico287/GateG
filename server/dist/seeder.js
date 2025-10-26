"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = seedDatabase;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("./db");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const seedEmployees = [
    {
        employee_code: 'EMP001',
        first_name: 'Ana',
        last_name: 'García',
        pin: '1234',
        role: 'Empleado',
        team_id: 1,
        points: 850,
        level: 1
    },
    {
        employee_code: 'EMP002',
        first_name: 'Carlos',
        last_name: 'López',
        pin: '1234',
        role: 'Empleado',
        team_id: 1,
        points: 1200,
        level: 2
    },
    {
        employee_code: 'SUP001',
        first_name: 'María',
        last_name: 'Rodríguez',
        pin: '1234',
        role: 'Supervisor',
        team_id: 1,
        points: 3500,
        level: 3
    },
    {
        employee_code: 'ADM001',
        first_name: 'Juan',
        last_name: 'Martínez',
        pin: '1234',
        role: 'Administrador',
        team_id: null,
        points: 5000,
        level: 4
    }
];
async function seedDatabase() {
    try {
        console.log('🌱 Iniciando seeding de la base de datos...');
        // Verificar conexión
        const connected = await (0, db_1.testConnection)();
        if (!connected) {
            throw new Error('No se pudo conectar a la base de datos');
        }
        // 1. Insertar equipos
        console.log('📋 Insertando equipos...');
        await (0, db_1.query)(`
      INSERT IGNORE INTO teams (id, name) VALUES 
      (1, 'Línea de Empaquetado 1'),
      (2, 'Control de Calidad'),
      (3, 'Logística')
    `);
        // 2. Insertar niveles de gamificación
        console.log('🎮 Insertando niveles de gamificación...');
        await (0, db_1.query)(`
      INSERT IGNORE INTO gamification_levels (level, points_required, title) VALUES 
      (1, 0, 'Novato'),
      (2, 1000, 'Eficiente'),
      (3, 2500, 'Experto'),
      (4, 5000, 'Maestro'),
      (5, 10000, 'Leyenda')
    `);
        // 3. Insertar empleados
        console.log('👥 Insertando empleados...');
        for (const emp of seedEmployees) {
            const pinHash = await bcrypt_1.default.hash(emp.pin, 10);
            console.log(`   Creando ${emp.employee_code} - ${emp.first_name} ${emp.last_name}`);
            await (0, db_1.query)(`
        INSERT IGNORE INTO employees 
        (employee_code, first_name, last_name, pin_hash, role, team_id, points, level, is_active) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE)
      `, [
                emp.employee_code,
                emp.first_name,
                emp.last_name,
                pinHash,
                emp.role,
                emp.team_id,
                emp.points,
                emp.level
            ]);
        }
        // 4. Actualizar supervisor del equipo
        console.log('👔 Asignando supervisor...');
        await (0, db_1.query)(`UPDATE teams SET supervisor_id = (SELECT id FROM employees WHERE employee_code = 'SUP001') WHERE id = 1`);
        // 5. Insertar definiciones de tareas
        console.log('📝 Insertando tareas...');
        await (0, db_1.query)(`
      INSERT IGNORE INTO task_definitions (name, description, team_id, standard_time_seconds, points_base, points_bonus_per_second_saved) VALUES 
      ('Empaquetado Básico', 'Empaquetar productos en cajas estándar', 1, 300, 50, 1),
      ('Control de Calidad', 'Revisar productos antes del empaquetado', 1, 180, 30, 2),
      ('Etiquetado', 'Aplicar etiquetas de envío', 1, 120, 25, 1),
      ('Inventario Rápido', 'Contar productos en almacén', 2, 600, 80, 1)
    `);
        // 6. Insertar badges
        console.log('🏆 Insertando badges...');
        await (0, db_1.query)(`
      INSERT IGNORE INTO badges (id, name, description, icon_url, criteria) VALUES 
      (1, 'Velocista', 'Completa 10 tareas en tiempo récord', 'https://example.com/badges/speed.png', '{"tasks_completed": 10, "time_improvement": "15%"}'),
      (2, 'Consistente', 'Trabaja 5 días consecutivos sin faltas', 'https://example.com/badges/consistent.png', '{"consecutive_days": 5}'),
      (3, 'Colaborador', 'Ayuda a 3 compañeros diferentes', 'https://example.com/badges/team.png', '{"helped_colleagues": 3}')
    `);
        // 7. Insertar algunos work logs de ejemplo
        console.log('📊 Insertando logs de trabajo...');
        await (0, db_1.query)(`
      INSERT IGNORE INTO work_logs (employee_id, task_definition_id, status, start_time, end_time, duration_seconds, points_earned) VALUES 
      ((SELECT id FROM employees WHERE employee_code = 'EMP001'), 1, 'completado', '2025-10-26 08:00:00', '2025-10-26 08:04:30', 270, 80),
      ((SELECT id FROM employees WHERE employee_code = 'EMP001'), 2, 'completado', '2025-10-26 08:15:00', '2025-10-26 08:18:00', 180, 30),
      ((SELECT id FROM employees WHERE employee_code = 'EMP002'), 1, 'completado', '2025-10-26 09:00:00', '2025-10-26 09:04:00', 240, 110)
    `);
        // Verificar datos insertados
        console.log('\n📈 Verificando datos insertados:');
        const [employeeCount] = await (0, db_1.query)('SELECT COUNT(*) as count FROM employees');
        const [teamCount] = await (0, db_1.query)('SELECT COUNT(*) as count FROM teams');
        const [taskCount] = await (0, db_1.query)('SELECT COUNT(*) as count FROM task_definitions');
        console.log(`   👥 Empleados: ${employeeCount.count}`);
        console.log(`   📋 Equipos: ${teamCount.count}`);
        console.log(`   📝 Tareas: ${taskCount.count}`);
        console.log('\n✅ Seeding completado exitosamente!');
        console.log('\n🔑 Credenciales de prueba:');
        seedEmployees.forEach(emp => {
            console.log(`   ${emp.employee_code} - ${emp.first_name} ${emp.last_name} (${emp.role}) - PIN: ${emp.pin}`);
        });
    }
    catch (error) {
        console.error('❌ Error durante el seeding:', error);
        process.exit(1);
    }
}
// Ejecutar seeder si se llama directamente
if (require.main === module) {
    seedDatabase()
        .then(() => {
        console.log('\n🎉 Seeder ejecutado exitosamente');
        process.exit(0);
    })
        .catch((error) => {
        console.error('❌ Error en seeder:', error);
        process.exit(1);
    });
}
//# sourceMappingURL=seeder.js.map