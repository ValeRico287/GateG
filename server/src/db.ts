import mysql, { Pool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Pool de conexiones MySQL
export const pool: Pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gateg',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Función helper para ejecutar consultas
export const query = async (sql: string, params?: any[]): Promise<any> => {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Tipos TypeScript para las tablas
export interface Employee {
  id: number;
  employee_code: string;
  first_name: string;
  last_name: string;
  pin_hash: string;
  role: 'Empleado' | 'Supervisor' | 'Administrador';
  team_id?: number;
  points: number;
  level: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Team {
  id: number;
  name: string;
  supervisor_id?: number;
  created_at: Date;
  updated_at: Date;
}

export interface WorkLog {
  id: number;
  employee_id: number;
  task_definition_id: number;
  status: 'activo' | 'completado' | 'cancelado';
  start_time: Date;
  end_time?: Date;
  duration_seconds?: number;
  points_earned: number;
  metadata?: any;
}

export interface TaskDefinition {
  id: number;
  name: string;
  description?: string;
  team_id?: number;
  standard_time_seconds: number;
  points_base: number;
  points_bonus_per_second_saved: number;
}

// Verificar conexión
export const testConnection = async (): Promise<boolean> => {
  try {
    await pool.execute('SELECT 1');
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};