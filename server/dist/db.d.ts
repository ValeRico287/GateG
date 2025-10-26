import { Pool } from 'mysql2/promise';
export declare const pool: Pool;
export declare const query: (sql: string, params?: any[]) => Promise<any>;
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
export declare const testConnection: () => Promise<boolean>;
//# sourceMappingURL=db.d.ts.map