export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  role_id: number;
  is_active: boolean;
  last_login: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: {
    cats: string[];
    users: string[];
  };
  created_at: Date;
  updated_at: Date;
}

export interface UserWithRole extends User {
  role: Role;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role_id?: number;
}




