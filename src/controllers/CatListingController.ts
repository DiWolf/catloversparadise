import { Request, Response } from 'express';
import { CatListingService } from '../services/CatListingService';
import { CatService } from '../services/CatService';
import { CreateCatListingRequest, UpdateCatListingRequest } from '../types/CatListing';
import { deleteFiles } from '../middlewares/upload';
import fs from 'fs';
import path from 'path';

export class CatListingController {
  // Dashboard de listings para admin
  static async dashboard(req: Request, res: Response) {
    try {
      const listings = await CatListingService.findAll();
      const cats = await CatService.findAll();
      
      const stats = {
        totalListings: listings.length,
        availableListings: listings.filter(l => l.status === 'available').length,
        reservedListings: listings.filter(l => l.status === 'reserved').length,
        soldListings: listings.filter(l => l.status === 'sold').length,
        totalCats: cats.length
      };
      
      res.render('admin/listings/dashboard', {
        title: 'Catálogo de Gatos',
        user: req.user,
        stats,
        recentListings: listings.slice(0, 5),
        recentCats: cats.slice(0, 5)
      });
    } catch (error) {
      console.error('Listings dashboard error:', error);
      res.status(500).render('admin/500', { title: 'Error del servidor' });
    }
  }

  // Listar todos los listings
  static async listListings(req: Request, res: Response) {
    try {
      const filters = {
        cat_id: req.query.cat_id ? parseInt(req.query.cat_id as string) : undefined,
        gender: req.query.gender as 'male' | 'female' | undefined,
        status: req.query.status as 'available' | 'reserved' | 'sold' | undefined,
        search: req.query.search as string | undefined
      };
      
      const listings = await CatListingService.findAll(filters);
      const cats = await CatService.findAll();
      
      const errorMessage = req.flash('error');
      const successMessage = req.flash('success');
      
      res.render('admin/listings/list', {
        title: 'Gestión de Catálogo',
        user: req.user,
        listings,
        cats,
        filters,
        error: errorMessage.length > 0 ? errorMessage[0] : null,
        success: successMessage.length > 0 ? successMessage[0] : null
      });
    } catch (error) {
      console.error('List listings error:', error);
      res.status(500).render('admin/500', { title: 'Error del servidor' });
    }
  }

  // Mostrar formulario de crear listing
  static async showCreateListing(req: Request, res: Response) {
    try {
      const cats = await CatService.findAll();
      const errorMessage = req.flash('error');
      const successMessage = req.flash('success');
      
      res.render('admin/listings/create', {
        title: 'Agregar Gato al Catálogo',
        user: req.user,
        cats,
        error: errorMessage.length > 0 ? errorMessage[0] : null,
        success: successMessage.length > 0 ? successMessage[0] : null
      });
    } catch (error) {
      console.error('Show create listing error:', error);
      res.status(500).render('admin/500', { title: 'Error del servidor' });
    }
  }

  // Crear nuevo listing
  static async createListing(req: Request, res: Response) {
    try {
      console.log('=== CREATE LISTING ===');
      console.log('req.files:', req.files);
      console.log('req.file:', req.file);
      console.log('req.body:', req.body);
      
      // Procesar imágenes subidas - SIMPLE como tu ejemplo
      let images: string[] = [];
      if (req.files && Array.isArray(req.files)) {
        images = req.files.map((file: Express.Multer.File) => {
          console.log('Processing file:', file.filename, 'Path:', file.path);
          return `/uploads/listings/${file.filename}`;
        });
        console.log('Images array:', images);
      }

      const listingData: CreateCatListingRequest = {
        cat_id: parseInt(req.body.cat_id),
        name: req.body.name,
        gender: req.body.gender,
        age_months: parseInt(req.body.age_months),
        color: req.body.color || undefined,
        eye_color: req.body.eye_color || undefined,
        special_characteristics: req.body.special_characteristics || undefined,
        pet_price: req.body.pet_price ? parseFloat(req.body.pet_price) : undefined,
        breeding_price: req.body.breeding_price ? parseFloat(req.body.breeding_price) : undefined,
        status: req.body.status || 'available',
        images: images,
        description: req.body.description || undefined,
        whatsapp_message: req.body.whatsapp_message || undefined,
        translations: [
          {
            language: 'sp',
            name: req.body.name_sp || req.body.name,
            description: req.body.description_sp || req.body.description,
            special_characteristics: req.body.special_characteristics_sp || req.body.special_characteristics,
            whatsapp_message: req.body.whatsapp_message_sp || req.body.whatsapp_message
          },
          {
            language: 'eng',
            name: req.body.name_eng || req.body.name,
            description: req.body.description_eng || req.body.description,
            special_characteristics: req.body.special_characteristics_eng || req.body.special_characteristics,
            whatsapp_message: req.body.whatsapp_message_eng || req.body.whatsapp_message
          }
        ]
      };
      
      console.log('About to create listing with data:', JSON.stringify(listingData, null, 2));
      
      const createdListing = await CatListingService.create(listingData, req.user!.id);
      
      console.log('Listing created successfully:', createdListing);
      
      req.flash('success', 'Gato agregado al catálogo exitosamente');
      res.redirect('/admin/listings');
      
    } catch (error) {
      console.error('Create listing error:', error);
      
      // Si hay error, eliminar las imágenes subidas
      if (req.files && Array.isArray(req.files)) {
        const filenames = req.files.map((file: Express.Multer.File) => file.filename);
        deleteFiles(filenames);
      }
      
      req.flash('error', 'Error al agregar el gato al catálogo');
      res.redirect('/admin/listings/create');
    }
  }

  // Mostrar formulario de editar listing
  static async showEditListing(req: Request, res: Response) {
    try {
      const listingId = parseInt(req.params.id);
      const listing = await CatListingService.findById(listingId);
      const cats = await CatService.findAll();
      
      if (!listing) {
        req.flash('error', 'Gato no encontrado en el catálogo');
        return res.redirect('/admin/listings');
      }
      
      const errorMessage = req.flash('error');
      const successMessage = req.flash('success');
      
      res.render('admin/listings/edit', {
        title: 'Editar Gato del Catálogo',
        user: req.user,
        listing,
        cats,
        error: errorMessage.length > 0 ? errorMessage[0] : null,
        success: successMessage.length > 0 ? successMessage[0] : null
      });
    } catch (error) {
      console.error('Show edit listing error:', error);
      res.status(500).render('admin/500', { title: 'Error del servidor' });
    }
  }

  // Actualizar listing
  static async updateListing(req: Request, res: Response) {
    try {
      const listingId = parseInt(req.params.id);
      
      // Obtener el listing actual
      const currentListing = await CatListingService.findById(listingId);
      if (!currentListing) {
        req.flash('error', 'Gato no encontrado');
        return res.redirect('/admin/listings');
      }
      
      // Procesar imágenes - SIMPLE como tu ejemplo
      let images = [...(currentListing.images || [])];
      
      // Eliminar imágenes marcadas para eliminar
      if (req.body.imagesToRemove) {
        const imagesToRemove = req.body.imagesToRemove.split(',').filter((img: string) => img.trim());
        images = images.filter(img => !imagesToRemove.includes(img));
        
        // Eliminar archivos físicamente
        for (const imagePath of imagesToRemove) {
          const fullPath = path.join(process.cwd(), 'public', imagePath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            console.log('Archivo eliminado:', fullPath);
          }
        }
      }
      
      // Agregar nuevas imágenes
      if (req.files && Array.isArray(req.files)) {
        const newImages = req.files.map((file: Express.Multer.File) => `/uploads/listings/${file.filename}`);
        images = [...images, ...newImages];
      }
      
      const listingData: UpdateCatListingRequest = {
        id: listingId,
        cat_id: parseInt(req.body.cat_id),
        name: req.body.name,
        gender: req.body.gender,
        age_months: parseInt(req.body.age_months),
        color: req.body.color || undefined,
        eye_color: req.body.eye_color || undefined,
        special_characteristics: req.body.special_characteristics || undefined,
        pet_price: req.body.pet_price ? parseFloat(req.body.pet_price) : undefined,
        breeding_price: req.body.breeding_price ? parseFloat(req.body.breeding_price) : undefined,
        status: req.body.status,
        images: images,
        description: req.body.description || undefined,
        whatsapp_message: req.body.whatsapp_message || undefined,
        translations: [
          {
            language: 'sp',
            name: req.body.name_sp || req.body.name,
            description: req.body.description_sp || req.body.description,
            special_characteristics: req.body.special_characteristics_sp || req.body.special_characteristics,
            whatsapp_message: req.body.whatsapp_message_sp || req.body.whatsapp_message
          },
          {
            language: 'eng',
            name: req.body.name_eng || req.body.name,
            description: req.body.description_eng || req.body.description,
            special_characteristics: req.body.special_characteristics_eng || req.body.special_characteristics,
            whatsapp_message: req.body.whatsapp_message_eng || req.body.whatsapp_message
          }
        ]
      };
      
      console.log('About to update listing with data:', JSON.stringify(listingData, null, 2));
      
      const updatedListing = await CatListingService.update(listingId, listingData, req.user!.id);
      
      console.log('Listing updated successfully:', updatedListing);
      
      req.flash('success', 'Gato actualizado exitosamente');
      res.redirect('/admin/listings');
      
    } catch (error) {
      console.error('Update listing error:', error);
      
      // Limpiar archivos en caso de error
      if (req.files && Array.isArray(req.files)) {
        const filenames = req.files.map((file: Express.Multer.File) => file.filename);
        deleteFiles(filenames);
      }
      
      req.flash('error', 'Error al actualizar el gato');
      res.redirect(`/admin/listings/${req.params.id}/edit`);
    }
  }

  // Eliminar listing
  static async deleteListing(req: Request, res: Response) {
    try {
      const listingId = parseInt(req.params.id);
      
      // Obtener el listing antes de eliminarlo para acceder a las imágenes
      const listing = await CatListingService.findById(listingId);
      
      if (!listing) {
        req.flash('error', 'Gato no encontrado');
        return res.redirect('/admin/listings');
      }
      
      // Eliminar imágenes físicamente
      if (listing.images && listing.images.length > 0) {
        for (const imagePath of listing.images) {
          const fullPath = path.join(process.cwd(), 'public', imagePath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            console.log('Archivo eliminado:', fullPath);
          }
        }
      }
      
      // Eliminar de la base de datos
      await CatListingService.delete(listingId);
      
      req.flash('success', 'Gato eliminado del catálogo exitosamente');
      res.redirect('/admin/listings');
      
    } catch (error) {
      console.error('Delete listing error:', error);
      req.flash('error', 'Error al eliminar el gato del catálogo');
      res.redirect('/admin/listings');
    }
  }

  // Cambiar estado del listing
  static async updateStatus(req: Request, res: Response) {
    try {
      const listingId = parseInt(req.params.id);
      const newStatus = req.body.status as 'available' | 'reserved' | 'sold';
      
      await CatListingService.update(listingId, { id: listingId, status: newStatus }, req.user!.id);
      
      req.flash('success', `Estado actualizado a ${newStatus}`);
      res.redirect('/admin/listings');
      
    } catch (error) {
      console.error('Update status error:', error);
      req.flash('error', 'Error al actualizar el estado');
      res.redirect('/admin/listings');
    }
  }
}
