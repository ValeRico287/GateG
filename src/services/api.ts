interface LoginResponse {
  success: boolean;
  token: string;
  employee: {
    id: number;
    employee_code: string;
    first_name: string;
    last_name: string;
    role: string;
    team_id?: number;
    points: number;
    level: number;
  };
}

interface Employee {
  id: number;
  employee_code: string;
  first_name: string;
  last_name: string;
  role: string;
  team_id?: number;
  team_name?: string;
  points: number;
  level: number;
  is_active: boolean;
}

interface Task {
  id: number;
  name: string;
  description?: string;
  team_id?: number;
  standard_time_seconds: number;
  points_base: number;
  points_bonus_per_second_saved: number;
}

class ApiClient {
  private baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:4000';
  private token: string | null = localStorage.getItem('gateg_token');

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async login(employee_code: string, pin: string): Promise<LoginResponse> {
    const result = await this.request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ employee_code, pin }),
    });

    if (result.success && result.token) {
      this.token = result.token;
      localStorage.setItem('gateg_token', result.token);
      localStorage.setItem('gateg_employee', JSON.stringify(result.employee));
    }

    return result;
  }

  async getProfile(): Promise<Employee> {
    return this.request<Employee>('/api/employee/profile');
  }

  async getTasks(): Promise<Task[]> {
    return this.request<Task[]>('/api/tasks');
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('gateg_token');
    localStorage.removeItem('gateg_employee');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getCurrentEmployee(): any {
    const stored = localStorage.getItem('gateg_employee');
    return stored ? JSON.parse(stored) : null;
  }
}

export const apiClient = new ApiClient();
export type { LoginResponse, Employee, Task };