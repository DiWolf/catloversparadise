import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { LoginRequest, RegisterRequest } from '../types/User';

export class AuthController {
  // Mostrar formulario de login
  static async showLogin(req: Request, res: Response) {
    try {
      const errorMessage = req.flash('error');
      const successMessage = req.flash('success');
      
      res.render('admin/login', {
        title: 'Iniciar Sesión',
        error: errorMessage.length > 0 ? errorMessage[0] : null,
        success: successMessage.length > 0 ? successMessage[0] : null
      });
    } catch (error) {
      console.error('Error showing login:', error);
      res.status(500).render('admin/500', { title: 'Error del servidor' });
    }
  }

  // Procesar login
  static async login(req: Request, res: Response) {
    try {
      const { username, password }: LoginRequest = req.body;
      
      if (!username || !password) {
        req.flash('error', 'Usuario y contraseña son requeridos');
        return res.redirect('/admin/login');
      }
      
      // Buscar usuario
      const user = await UserService.findByUsernameOrEmail(username);
      if (!user) {
        req.flash('error', 'Credenciales inválidas');
        return res.redirect('/admin/login');
      }
      
      // Verificar contraseña
      const isValidPassword = await UserService.verifyPassword(password, user.password_hash);
      if (!isValidPassword) {
        req.flash('error', 'Credenciales inválidas');
        return res.redirect('/admin/login');
      }
      
      // Actualizar último login
      await UserService.updateLastLogin(user.id);
      
      // Guardar en sesión
      req.session.user = user as any;
      
      req.flash('success', `Bienvenido, ${user.username}!`);
      res.redirect('/admin');
      
    } catch (error) {
      console.error('Login error:', error);
      req.flash('error', 'Error interno del servidor');
      res.redirect('/admin/login');
    }
  }

  // Mostrar formulario de registro
  static async showRegister(req: Request, res: Response) {
    try {
      const roles = await UserService.getRoles();
      const errorMessage = req.flash('error');
      const successMessage = req.flash('success');
      
      res.render('admin/register', {
        title: 'Registrar Usuario',
        roles,
        error: errorMessage.length > 0 ? errorMessage[0] : null,
        success: successMessage.length > 0 ? successMessage[0] : null
      });
    } catch (error) {
      console.error('Error showing register:', error);
      res.status(500).render('admin/500', { title: 'Error del servidor' });
    }
  }

  // Procesar registro
  static async register(req: Request, res: Response) {
    try {
      const { username, email, password, role_id }: RegisterRequest = req.body;
      
      if (!username || !email || !password) {
        req.flash('error', 'Todos los campos son requeridos');
        return res.redirect('/admin/register');
      }
      
      // Verificar si el usuario ya existe
      const existingUser = await UserService.findByUsernameOrEmail(username);
      if (existingUser) {
        req.flash('error', 'El usuario ya existe');
        return res.redirect('/admin/register');
      }
      
      // Verificar si el email ya existe
      const existingEmail = await UserService.findByUsernameOrEmail(email);
      if (existingEmail) {
        req.flash('error', 'El email ya está registrado');
        return res.redirect('/admin/register');
      }
      
      // Crear usuario
      const newUser = await UserService.create({
        username,
        email,
        password,
        role_id: role_id ? parseInt(String(role_id)) : 3
      });
      
      req.flash('success', 'Usuario creado exitosamente');
      res.redirect('/admin/users');
      
    } catch (error) {
      console.error('Register error:', error);
      req.flash('error', 'Error interno del servidor');
      res.redirect('/admin/register');
    }
  }

  // Logout
  static async logout(req: Request, res: Response) {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destroy error:', err);
        }
        res.redirect('/admin/login');
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.redirect('/admin/login');
    }
  }

  // Mostrar perfil de usuario
  static async showProfile(req: Request, res: Response) {
    try {
      const errorMessage = req.flash('error');
      const successMessage = req.flash('success');
      
      res.render('admin/profile', {
        title: 'Mi Perfil',
        user: req.user,
        error: errorMessage.length > 0 ? errorMessage[0] : null,
        success: successMessage.length > 0 ? successMessage[0] : null
      });
    } catch (error) {
      console.error('Error showing profile:', error);
      res.status(500).render('admin/500', { title: 'Error del servidor' });
    }
  }
}
