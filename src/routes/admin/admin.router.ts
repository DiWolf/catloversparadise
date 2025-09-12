import { Router } from 'express';
import { AuthController } from '../../controllers/AuthController';
import { AdminController } from '../../controllers/AdminController';
import { requireAuth, redirectIfAuthenticated, requireAdmin, requireEditor } from '../../middlewares/auth';

const router = Router();

// Rutas de autenticación (públicas)
router.get('/login', redirectIfAuthenticated, AuthController.showLogin);
router.post('/login', AuthController.login);
router.get('/register', redirectIfAuthenticated, AuthController.showRegister);
router.post('/register', AuthController.register);
router.get('/logout', AuthController.logout);

// Rutas protegidas
router.use(requireAuth);

// Dashboard
router.get('/', AdminController.dashboard);

// Rutas de gatos (Editor o Admin)
router.get('/cats', requireEditor, AdminController.listCats);
router.get('/cats/create', requireEditor, AdminController.showCreateCat);
router.post('/cats/create', requireEditor, AdminController.createCat);
router.get('/cats/:id/edit', requireEditor, AdminController.showEditCat);
router.post('/cats/:id/edit', requireEditor, AdminController.updateCat);
router.post('/cats/:id/delete', requireEditor, AdminController.deleteCat);

// Rutas de usuarios (solo Admin)
router.get('/users', requireAdmin, AdminController.listUsers);

// Perfil de usuario
router.get('/profile', AuthController.showProfile);

export default router;
