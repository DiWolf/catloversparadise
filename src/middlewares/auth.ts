import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import { UserWithRole } from '../types/User';

// Extender la interfaz Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: UserWithRole;
    }
  }
}

// Middleware para verificar autenticación
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.session.user) {
      return res.redirect('/admin/login');
    }
    
    // Verificar que el usuario sigue activo
    const user = await UserService.findById(req.session.user.id);
    if (!user || !user.is_active) {
      req.session.destroy(() => {});
      return res.redirect('/admin/login');
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.redirect('/admin/login');
  }
};

// Middleware para verificar permisos específicos
export const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autorizado' });
    }
    
    const userPermissions = req.user.role.permissions;
    
    // Si el usuario tiene permisos "all", permitir todo
    if (Array.isArray(userPermissions) && userPermissions.includes('all')) {
      return next();
    }
    
    // Si el usuario tiene el permiso específico
    if (Array.isArray(userPermissions) && userPermissions.includes(permission)) {
      return next();
    }
    
    return res.status(403).json({ error: 'Permisos insuficientes' });
  };
};

// Middleware para verificar rol específico
export const requireRole = (roleName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autorizado' });
    }
    
    if (req.user.role.name !== roleName) {
      return res.status(403).json({ error: 'Rol insuficiente' });
    }
    
    next();
  };
};

// Middleware para verificar si ya está autenticado (para login/register)
export const redirectIfAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user) {
    return res.redirect('/admin');
  }
  next();
};

// Middleware para verificar si es administrador
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  
  if (req.user.role.name !== 'Admin') {
    return res.status(403).json({ error: 'Se requieren permisos de administrador' });
  }
  
  next();
};

// Middleware para verificar si puede editar (Admin o Editor)
export const requireEditor = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  
  const allowedRoles = ['Admin', 'Editor'];
  if (!allowedRoles.includes(req.user.role.name)) {
    return res.status(403).json({ error: 'Se requieren permisos de editor' });
  }
  
  next();
};
