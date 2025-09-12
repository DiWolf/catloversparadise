import { Request, Response } from 'express';
import { CatService } from '../services/CatService';
import { UserService } from '../services/UserService';
import { CreateCatRequest, UpdateCatRequest } from '../types/Cat';

export class AdminController {
  // Dashboard principal
  static async dashboard(req: Request, res: Response) {
    try {
      const cats = await CatService.findAll();
      const users = await UserService.findAll();
      
      res.render('admin/dashboard', {
        title: 'Panel de Administración',
        user: req.user,
        stats: {
          totalCats: cats.length,
          totalUsers: users.length,
          activeCats: cats.filter(cat => cat.is_active).length
        },
        recentCats: cats.slice(0, 5),
        recentUsers: users.slice(0, 5)
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).render('admin/500', { title: 'Error del servidor' });
    }
  }

  // Listar gatos
  static async listCats(req: Request, res: Response) {
    try {
      const cats = await CatService.findAll();
      const errorMessage = req.flash('error');
      const successMessage = req.flash('success');
      
      res.render('admin/cats/list', {
        title: 'Gestión de Gatos',
        user: req.user,
        cats,
        error: errorMessage.length > 0 ? errorMessage[0] : null,
        success: successMessage.length > 0 ? successMessage[0] : null
      });
    } catch (error) {
      console.error('List cats error:', error);
      res.status(500).render('admin/500', { title: 'Error del servidor' });
    }
  }

  // Mostrar formulario de crear gato
  static async showCreateCat(req: Request, res: Response) {
    try {
      const errorMessage = req.flash('error');
      const successMessage = req.flash('success');
      
      res.render('admin/cats/create', {
        title: 'Crear Nuevo Gato',
        user: req.user,
        error: errorMessage.length > 0 ? errorMessage[0] : null,
        success: successMessage.length > 0 ? successMessage[0] : null
      });
    } catch (error) {
      console.error('Show create cat error:', error);
      res.status(500).render('admin/500', { title: 'Error del servidor' });
    }
  }

  // Crear gato
  static async createCat(req: Request, res: Response) {
    try {
      const catData: CreateCatRequest = {
        name: req.body.name,
        breed: req.body.breed,
        slug: req.body.slug,
        description: req.body.description,
        characteristics: req.body.characteristics,
        temperament: req.body.temperament,
        care: req.body.care,
        hero_image: req.body.hero_image,
        main_image: req.body.main_image,
        translations: [
          {
            language: 'sp',
            name: req.body.name_sp || req.body.name,
            description: req.body.description_sp || req.body.description,
            characteristics: req.body.characteristics_sp || req.body.characteristics,
            temperament: req.body.temperament_sp || req.body.temperament,
            care: req.body.care_sp || req.body.care
          },
          {
            language: 'eng',
            name: req.body.name_eng || req.body.name,
            description: req.body.description_eng || req.body.description,
            characteristics: req.body.characteristics_eng || req.body.characteristics,
            temperament: req.body.temperament_eng || req.body.temperament,
            care: req.body.care_eng || req.body.care
          }
        ]
      };
      
      // Verificar si el slug ya existe
      if (catData.slug) {
        const slugExists = await CatService.slugExists(catData.slug);
        if (slugExists) {
          req.flash('error', 'El slug ya existe. Por favor, elige otro.');
          return res.redirect('/admin/cats/create');
        }
      }
      
      await CatService.create(catData, req.user!.id);
      
      req.flash('success', 'Gato creado exitosamente');
      res.redirect('/admin/cats');
      
    } catch (error) {
      console.error('Create cat error:', error);
      req.flash('error', 'Error al crear el gato');
      res.redirect('/admin/cats/create');
    }
  }

  // Mostrar formulario de editar gato
  static async showEditCat(req: Request, res: Response) {
    try {
      const catId = parseInt(req.params.id);
      const cat = await CatService.findById(catId);
      
      if (!cat) {
        req.flash('error', 'Gato no encontrado');
        return res.redirect('/admin/cats');
      }
      
      const errorMessage = req.flash('error');
      const successMessage = req.flash('success');
      
      res.render('admin/cats/edit', {
        title: 'Editar Gato',
        user: req.user,
        cat,
        error: errorMessage.length > 0 ? errorMessage[0] : null,
        success: successMessage.length > 0 ? successMessage[0] : null
      });
    } catch (error) {
      console.error('Show edit cat error:', error);
      res.status(500).render('admin/500', { title: 'Error del servidor' });
    }
  }

  // Actualizar gato
  static async updateCat(req: Request, res: Response) {
    try {
      const catId = parseInt(req.params.id);
      const catData: UpdateCatRequest = {
        id: catId,
        name: req.body.name,
        breed: req.body.breed,
        slug: req.body.slug,
        description: req.body.description,
        characteristics: req.body.characteristics,
        temperament: req.body.temperament,
        care: req.body.care,
        hero_image: req.body.hero_image,
        main_image: req.body.main_image,
        translations: [
          {
            language: 'sp',
            name: req.body.name_sp || req.body.name,
            description: req.body.description_sp || req.body.description,
            characteristics: req.body.characteristics_sp || req.body.characteristics,
            temperament: req.body.temperament_sp || req.body.temperament,
            care: req.body.care_sp || req.body.care
          },
          {
            language: 'eng',
            name: req.body.name_eng || req.body.name,
            description: req.body.description_eng || req.body.description,
            characteristics: req.body.characteristics_eng || req.body.characteristics,
            temperament: req.body.temperament_eng || req.body.temperament,
            care: req.body.care_eng || req.body.care
          }
        ]
      };
      
      // Verificar si el slug ya existe (excluyendo el gato actual)
      if (catData.slug) {
        const slugExists = await CatService.slugExists(catData.slug, catId);
        if (slugExists) {
          req.flash('error', 'El slug ya existe. Por favor, elige otro.');
          return res.redirect(`/admin/cats/${catId}/edit`);
        }
      }
      
      await CatService.update(catId, catData, req.user!.id);
      
      req.flash('success', 'Gato actualizado exitosamente');
      res.redirect('/admin/cats');
      
    } catch (error) {
      console.error('Update cat error:', error);
      req.flash('error', 'Error al actualizar el gato');
      res.redirect(`/admin/cats/${req.params.id}/edit`);
    }
  }

  // Eliminar gato
  static async deleteCat(req: Request, res: Response) {
    try {
      const catId = parseInt(req.params.id);
      
      await CatService.delete(catId);
      
      req.flash('success', 'Gato eliminado exitosamente');
      res.redirect('/admin/cats');
      
    } catch (error) {
      console.error('Delete cat error:', error);
      req.flash('error', 'Error al eliminar el gato');
      res.redirect('/admin/cats');
    }
  }

  // Listar usuarios
  static async listUsers(req: Request, res: Response) {
    try {
      const users = await UserService.findAll();
      const errorMessage = req.flash('error');
      const successMessage = req.flash('success');
      
      res.render('admin/users/list', {
        title: 'Gestión de Usuarios',
        user: req.user,
        users,
        error: errorMessage.length > 0 ? errorMessage[0] : null,
        success: successMessage.length > 0 ? successMessage[0] : null
      });
    } catch (error) {
      console.error('List users error:', error);
      res.status(500).render('admin/500', { title: 'Error del servidor' });
    }
  }
}
