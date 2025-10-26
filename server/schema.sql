-- Schema de base de datos para GateG
-- Sistema de monitoreo de empleados con gamificación

-- 1. Crear 'teams' primero, pero SIN la clave foránea a 'employees'
CREATE TABLE teams (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    supervisor_id BIGINT, 
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Crear 'employees', que SÍ puede referenciar a 'teams' porque ya existe
CREATE TABLE employees (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_code VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    pin_hash VARCHAR(255) NOT NULL,
    role ENUM('Empleado', 'Supervisor', 'Administrador') NOT NULL DEFAULT 'Empleado',
    team_id BIGINT,
    points BIGINT NOT NULL DEFAULT 0,
    level INT NOT NULL DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id)
);

-- 3. Ahora que 'employees' existe, añadimos la clave foránea a 'teams'
ALTER TABLE teams
ADD CONSTRAINT fk_supervisor
FOREIGN KEY (supervisor_id) REFERENCES employees(id) ON DELETE SET NULL;

-- 4. Resto de las tablas (con correcciones de sintaxis)
CREATE TABLE task_definitions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    team_id BIGINT,
    standard_time_seconds INT NOT NULL, 
    points_base INT NOT NULL DEFAULT 50,
    points_bonus_per_second_saved INT NOT NULL DEFAULT 1,
    FOREIGN KEY (team_id) REFERENCES teams(id)
);

CREATE TABLE work_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    task_definition_id BIGINT NOT NULL,
    status ENUM('activo', 'completado', 'cancelado') NOT NULL DEFAULT 'activo',
    start_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_time DATETIME NULL, 
    duration_seconds INT,
    points_earned INT NOT NULL DEFAULT 0,
    metadata JSON, 
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (task_definition_id) REFERENCES task_definitions(id)
);

CREATE TABLE gamification_levels (
    level INT PRIMARY KEY,
    points_required BIGINT NOT NULL,
    title VARCHAR(100) NOT NULL 
);

CREATE TABLE badges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url VARCHAR(255),
    criteria JSON NOT NULL
);

CREATE TABLE employee_badges (
    employee_id BIGINT NOT NULL,
    badge_id INT NOT NULL,
    earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (employee_id, badge_id),
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE
);

CREATE TABLE feedback_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    work_log_id BIGINT,
    message TEXT NOT NULL,
    type ENUM('positivo', 'negativo', 'motivacional') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (work_log_id) REFERENCES work_logs(id) ON DELETE SET NULL
);

-- 5. Índices para optimizar consultas
CREATE INDEX idx_work_logs_employee_time ON work_logs (employee_id, start_time DESC);
CREATE INDEX idx_work_logs_task_time ON work_logs (task_definition_id, start_time DESC);
CREATE INDEX idx_employees_team ON employees (team_id);

-- 6. Datos iniciales
INSERT INTO teams (name) VALUES ('Línea de Empaquetado 1');
INSERT INTO teams (name) VALUES ('Control de Calidad');
INSERT INTO teams (name) VALUES ('Logística');

-- Niveles de gamificación
INSERT INTO gamification_levels (level, points_required, title) VALUES (1, 0, 'Novato');
INSERT INTO gamification_levels (level, points_required, title) VALUES (2, 1000, 'Eficiente');
INSERT INTO gamification_levels (level, points_required, title) VALUES (3, 2500, 'Experto');
INSERT INTO gamification_levels (level, points_required, title) VALUES (4, 5000, 'Maestro');
INSERT INTO gamification_levels (level, points_required, title) VALUES (5, 10000, 'Leyenda');

-- Empleados de prueba (PIN: 1234 para todos, hash de bcrypt con salt 10)
-- Hash para "1234": $2b$10$rB5H4zDf.vxqyuLqmRvNO.X8BdmOEPFkQYCdJlhGHp8qGNz3X7Hxi
INSERT INTO employees (employee_code, first_name, last_name, pin_hash, role, team_id, points, level) VALUES
('EMP001', 'Ana', 'García', '$2b$10$rB5H4zDf.vxqyuLqmRvNO.X8BdmOEPFkQYCdJlhGHp8qGNz3X7Hxi', 'Empleado', 1, 850, 1),
('EMP002', 'Carlos', 'López', '$2b$10$rB5H4zDf.vxqyuLqmRvNO.X8BdmOEPFkQYCdJlhGHp8qGNz3X7Hxi', 'Empleado', 1, 1200, 2),
('SUP001', 'María', 'Rodríguez', '$2b$10$rB5H4zDf.vxqyuLqmRvNO.X8BdmOEPFkQYCdJlhGHp8qGNz3X7Hxi', 'Supervisor', 1, 3500, 3),
('ADM001', 'Juan', 'Martínez', '$2b$10$rB5H4zDf.vxqyuLqmRvNO.X8BdmOEPFkQYCdJlhGHp8qGNz3X7Hxi', 'Administrador', NULL, 5000, 4);

-- Actualizar supervisor del equipo
UPDATE teams SET supervisor_id = 3 WHERE id = 1;

-- Definiciones de tareas
INSERT INTO task_definitions (name, description, team_id, standard_time_seconds, points_base, points_bonus_per_second_saved) VALUES
('Empaquetado Básico', 'Empaquetar productos en cajas estándar', 1, 300, 50, 1),
('Control de Calidad', 'Revisar productos antes del empaquetado', 1, 180, 30, 2),
('Etiquetado', 'Aplicar etiquetas de envío', 1, 120, 25, 1),
('Inventario Rápido', 'Contar productos en almacén', 2, 600, 80, 1);

-- Logs de trabajo de ejemplo
INSERT INTO work_logs (employee_id, task_definition_id, status, start_time, end_time, duration_seconds, points_earned) VALUES
(1, 1, 'completado', '2025-10-26 08:00:00', '2025-10-26 08:04:30', 270, 80),
(1, 2, 'completado', '2025-10-26 08:15:00', '2025-10-26 08:18:00', 180, 30),
(2, 1, 'completado', '2025-10-26 09:00:00', '2025-10-26 09:04:00', 240, 110),
(2, 3, 'activo', '2025-10-26 10:00:00', NULL, NULL, 0);

-- Badges de ejemplo
INSERT INTO badges (name, description, icon_url, criteria) VALUES
('Velocista', 'Completa 10 tareas en tiempo récord', 'https://example.com/badges/speed.png', '{"tasks_completed": 10, "time_improvement": "15%"}'),
('Consistente', 'Trabaja 5 días consecutivos sin faltas', 'https://example.com/badges/consistent.png', '{"consecutive_days": 5}'),
('Colaborador', 'Ayuda a 3 compañeros diferentes', 'https://example.com/badges/team.png', '{"helped_colleagues": 3}');

-- Asignar algunos badges
INSERT INTO employee_badges (employee_id, badge_id) VALUES
(2, 1),
(3, 2),
(3, 3);