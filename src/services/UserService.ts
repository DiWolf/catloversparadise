import bcrypt from 'bcrypt';
import { query } from '../config/database';
import { User, UserWithRole, Role, LoginRequest, RegisterRequest } from '../types/User';

export class UserService {
  // Buscar usuario por username o email
  static async findByUsernameOrEmail(identifier: string): Promise<UserWithRole | null> {
    try {
      const sql = `
        SELECT u.*, r.name as role_name, r.description as role_description, r.permissions
        FROM users u
        JOIN roles r ON u.role_id = r.id
        WHERE (u.username = ? OR u.email = ?) AND u.is_active = TRUE
      `;
      const users = await query(sql, [identifier, identifier]);
      
      if (users.length === 0) return null;
      
      const user = users[0];
      return {
        ...user,
        role: {
          id: user.role_id,
          name: user.role_name,
          description: user.role_description,
          permissions: typeof user.permissions === 'string' ? JSON.parse(user.permissions) : user.permissions,
          created_at: user.created_at,
          updated_at: user.updated_at
        }
      };
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }

  // Buscar usuario por ID
  static async findById(id: number): Promise<UserWithRole | null> {
    try {
      const sql = `
        SELECT u.*, r.name as role_name, r.description as role_description, r.permissions
        FROM users u
        JOIN roles r ON u.role_id = r.id
        WHERE u.id = ? AND u.is_active = TRUE
      `;
      const users = await query(sql, [id]);
      
      if (users.length === 0) return null;
      
      const user = users[0];
      return {
        ...user,
        role: {
          id: user.role_id,
          name: user.role_name,
          description: user.role_description,
          permissions: typeof user.permissions === 'string' ? JSON.parse(user.permissions) : user.permissions,
          created_at: user.created_at,
          updated_at: user.updated_at
        }
      };
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  // Verificar contraseña
  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error('Error verifying password:', error);
      throw error;
    }
  }

  // Crear nuevo usuario
  static async create(userData: RegisterRequest): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const sql = `
        INSERT INTO users (username, email, password_hash, role_id)
        VALUES (?, ?, ?, ?)
      `;
      
      const result = await query(sql, [
        userData.username,
        userData.email,
        hashedPassword,
        userData.role_id || 3 // Por defecto rol de viewer
      ]);
      
      const newUser = await this.findById(result.insertId);
      return newUser!;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Actualizar último login
  static async updateLastLogin(id: number): Promise<void> {
    try {
      const sql = 'UPDATE users SET last_login = NOW() WHERE id = ?';
      await query(sql, [id]);
    } catch (error) {
      console.error('Error updating last login:', error);
      throw error;
    }
  }

  // Obtener todos los usuarios (solo para admin)
  static async findAll(): Promise<UserWithRole[]> {
    try {
      const sql = `
        SELECT u.*, r.name as role_name, r.description as role_description, r.permissions
        FROM users u
        JOIN roles r ON u.role_id = r.id
        WHERE u.is_active = TRUE
        ORDER BY u.created_at DESC
      `;
      const users = await query(sql);
      
      return users.map((user: any) => ({
        ...user,
        role: {
          id: user.role_id,
          name: user.role_name,
          description: user.role_description,
          permissions: typeof user.permissions === 'string' ? JSON.parse(user.permissions) : user.permissions,
          created_at: user.created_at,
          updated_at: user.updated_at
        }
      }));
    } catch (error) {
      console.error('Error finding all users:', error);
      throw error;
    }
  }

  // Obtener todos los roles
  static async getRoles(): Promise<Role[]> {
    try {
      const sql = 'SELECT * FROM roles ORDER BY name';
      const roles = await query(sql);
      
      return roles.map((role: any) => ({
        ...role,
        permissions: typeof role.permissions === 'string' ? JSON.parse(role.permissions) : role.permissions
      }));
    } catch (error) {
      console.error('Error getting roles:', error);
      throw error;
    }
  }
}
